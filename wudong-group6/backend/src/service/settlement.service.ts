import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { IPageParams, IPageResult } from '../interface';

export interface SettlementSummary {
  type: string;
  totalOrders: number;
  totalAmount: number;
  serviceFee: number;
  settlementAmount: number;
  paidCount: number;
  unpaidCount: number;
}

@Provide()
export class SettlementService {
  @InjectEntityModel(Order)
  orderModel: Repository<Order>;

  /**
   * 结算统计：按业务类型 + 支付状态分组汇总
   */
  async list(
    params: IPageParams & { keyword?: string; type?: string; status?: number }
  ): Promise<IPageResult<SettlementSummary>> {
    const { page = 1, pageSize = 10, type } = params;

    // 按 type 分组统计
    const qb = this.orderModel
      .createQueryBuilder('o')
      .select('o.type', 'type')
      .addSelect('COUNT(*)', 'totalOrders')
      .addSelect('COALESCE(SUM(o.amount), 0)', 'totalAmount')
      .addSelect('COALESCE(SUM(CASE WHEN o.status >= 1 THEN o.amount ELSE 0 END), 0)', 'paidAmount')
      .addSelect('COALESCE(SUM(CASE WHEN o.status = 0 THEN o.amount ELSE 0 END), 0)', 'unpaidAmount')
      .addSelect('COUNT(CASE WHEN o.status >= 1 THEN 1 ELSE NULL END)', 'paidCount')
      .addSelect('COUNT(CASE WHEN o.status = 0 THEN 1 ELSE NULL END)', 'unpaidCount')
      .where('o.is_deleted = 0')
      .groupBy('o.type');

    if (type) {
      qb.andWhere('o.type = :type', { type });
    }

    // 拿到分组汇总
    const rawList = await qb
      .orderBy('totalAmount', 'DESC')
      .getRawMany();

    const rate = 0.05;
    const list: SettlementSummary[] = rawList.map(r => {
      const totalAmount = Number(r.totalAmount);
      const serviceFee = Math.round(totalAmount * rate);
      return {
        type: r.type,
        totalOrders: Number(r.totalOrders),
        totalAmount,
        serviceFee,
        settlementAmount: totalAmount - serviceFee,
        paidCount: Number(r.paidCount),
        unpaidCount: Number(r.unpaidCount),
      };
    });

    const total = list.length;
    const paged = list.slice((page - 1) * pageSize, page * pageSize);

    return { list: paged, total, page, pageSize };
  }

  /**
   * 结算总览统计
   */
  async stats() {
    const result = await this.list({ page: 1, pageSize: 9999 });
    const list = result.list;

    const totalAmount = list.reduce((s, r) => s + r.totalAmount, 0);
    const totalSettlementAmount = list.reduce((s, r) => s + r.settlementAmount, 0);
    const totalServiceFee = list.reduce((s, r) => s + r.serviceFee, 0);
    const totalOrders = list.reduce((s, r) => s + r.totalOrders, 0);

    // 按状态统计
    const paidOrdersRaw = await this.orderModel
      .createQueryBuilder('o')
      .where('o.is_deleted = 0')
      .andWhere('o.status >= 1')
      .getCount();
    const unpaidOrdersRaw = await this.orderModel
      .createQueryBuilder('o')
      .where('o.is_deleted = 0')
      .andWhere('o.status = 0')
      .getCount();

    return {
      summary: {
        totalAmount,
        totalSettlementAmount,
        totalServiceFee,
        totalOrders,
        pendingCount: unpaidOrdersRaw,
        settledCount: paidOrdersRaw,
        moduleCount: list.length,
      },
    };
  }

  /**
   * 执行结算（标记为已结算）
   */
  async settle(id: number): Promise<boolean> {
    const order = await this.orderModel.findOne({ where: { id, isDeleted: 0 } });
    if (!order) return false;
    order.status = 3; // 3=已完成
    await this.orderModel.save(order);
    return true;
  }
}
