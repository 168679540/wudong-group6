import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../entity/order.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class OrderService {
  @InjectEntityModel(Order)
  orderModel: Repository<Order>;

  async list(
    params: IPageParams & { keyword?: string; type?: string; status?: number }
  ): Promise<IPageResult<Order>> {
    const { page = 1, pageSize = 10, keyword, type, status } = params;

    const qb = this.orderModel
      .createQueryBuilder('o')
      .where('o.is_deleted = 0');

    if (keyword) {
      qb.andWhere('o.order_no LIKE :keyword', { keyword: `%${keyword}%` });
    }
    if (type) {
      qb.andWhere('o.type = :type', { type });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('o.status = :status', { status });
    }

    qb.skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('o.created_at', 'DESC');

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async create(data: { type: string; amount: number; userId?: number; merchantId?: number; itemName?: string; itemImage?: string }): Promise<Order> {
    const now = new Date();
    const orderNo = 'WD' + now.getFullYear() +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0') +
      String(now.getHours()).padStart(2, '0') +
      String(now.getMinutes()).padStart(2, '0') +
      String(now.getSeconds()).padStart(2, '0') +
      Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    const order = new Order();
    order.orderNo = orderNo;
    order.userId = data.userId || 1;
    order.type = data.type;
    order.amount = data.amount;
    order.itemName = data.itemName || null;
    order.itemImage = data.itemImage || null;
    order.status = 1; // 已支付
    order.merchantId = data.merchantId || null;
    return this.orderModel.save(order);
  }

  async ship(id: number, expressCompany: string, expressNo: string): Promise<Order | null> {
    const order = await this.orderModel.findOne({ where: { id, isDeleted: 0 } });
    if (!order) return null;
    order.expressCompany = expressCompany;
    order.expressNo = expressNo;
    order.status = 2; // 已确认/已发货
    return this.orderModel.save(order);
  }

  async refund(id: number): Promise<Order | null> {
    const order = await this.orderModel.findOne({ where: { id, isDeleted: 0 } });
    if (!order) return null;
    if (order.status !== 1) throw new Error('当前状态不可退款');
    order.status = 4; // 已取消/已退款
    return this.orderModel.save(order);
  }

  async returnOrder(id: number): Promise<Order | null> {
    const order = await this.orderModel.findOne({ where: { id, isDeleted: 0 } });
    if (!order) return null;
    if (order.status !== 2) throw new Error('当前状态不可退货');
    const days = (Date.now() - new Date(order.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (days > 7) throw new Error('已超过7天退货期限');
    order.status = 4;
    return this.orderModel.save(order);
  }

  async confirm(id: number): Promise<Order | null> {
    const order = await this.orderModel.findOne({ where: { id, isDeleted: 0 } });
    if (!order) return null;
    if (order.status !== 1) throw new Error('当前状态不可确认');
    order.status = 2; // 已确认
    return this.orderModel.save(order);
  }

  async reject(id: number): Promise<Order | null> {
    const order = await this.orderModel.findOne({ where: { id, isDeleted: 0 } });
    if (!order) return null;
    if (order.status !== 1) throw new Error('当前状态不可拒绝');
    order.status = 4; // 已取消
    return this.orderModel.save(order);
  }
}
