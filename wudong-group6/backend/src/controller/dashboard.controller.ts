import { Inject, Controller, Get } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { Merchant } from '../entity/merchant.entity';
import { MerchantApplication } from '../entity/merchant-application.entity';
import { Order } from '../entity/order.entity';

function localDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function lastSevenDays(): string[] {
  const result: string[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    result.push(localDate(d));
  }
  return result;
}

@Controller('/api/dashboard')
export class DashboardController {
  @Inject()
  ctx: Context;

  @InjectEntityModel(User)
  userModel: Repository<User>;

  @InjectEntityModel(MerchantApplication)
  applicationModel: Repository<MerchantApplication>;

  @InjectEntityModel(Merchant)
  merchantModel: Repository<Merchant>;

  @InjectEntityModel(Order)
  orderModel: Repository<Order>;

  @Get('/stats')
  async stats() {
    const now = new Date();
    const todayStr = localDate(now);
    const days = lastSevenDays();
    const sevenDaysAgoStr = days[0];

    const [
      totalUsers, totalOrders, totalGMVResult,
      pendingMerchants, totalMerchants,
      orderTrend, userTrend,
      orderTypeDistribution,
    ] = await Promise.all([
      this.userModel.createQueryBuilder('u').where('u.is_deleted = 0').getCount(),
      this.orderModel.createQueryBuilder('o').where('o.is_deleted = 0').getCount(),
      this.orderModel.createQueryBuilder('o').select('COALESCE(SUM(o.amount),0)', 'total').where('o.is_deleted = 0').getRawOne(),
      this.applicationModel.createQueryBuilder('a').where('a.is_deleted = 0').andWhere('a.status = 0').getCount(),
      this.merchantModel.createQueryBuilder('m').where('m.is_deleted = 0').getCount(),

      // 订单趋势：SELECT 和 GROUP BY 表达式必须完全一致
      this.orderModel.createQueryBuilder('o')
        .select("DATE(o.created_at)", 'date')
        .addSelect('COUNT(*)', 'count')
        .where('o.is_deleted = 0')
        .andWhere("DATE(o.created_at) >= :start", { start: sevenDaysAgoStr })
        .groupBy("DATE(o.created_at)")
        .orderBy('date', 'ASC')
        .getRawMany(),

      this.userModel.createQueryBuilder('u')
        .select("DATE(u.created_at)", 'date')
        .addSelect('COUNT(*)', 'count')
        .where('u.is_deleted = 0')
        .andWhere("DATE(u.created_at) >= :start", { start: sevenDaysAgoStr })
        .groupBy("DATE(u.created_at)")
        .orderBy('date', 'ASC')
        .getRawMany(),

      // 订单类型分布
      this.orderModel.createQueryBuilder('o')
        .select('o.type', 'type')
        .addSelect('COUNT(*)', 'value')
        .where('o.is_deleted = 0')
        .groupBy('o.type')
        .getRawMany(),
    ]);

    // 今日数据
    const todayOrders = await this.orderModel.createQueryBuilder('o')
      .where('o.is_deleted = 0')
      .andWhere("DATE(o.created_at) = :today", { today: todayStr })
      .getCount();
    const todayGMVResult = await this.orderModel.createQueryBuilder('o')
      .select('COALESCE(SUM(o.amount),0)', 'total')
      .where('o.is_deleted = 0')
      .andWhere("DATE(o.created_at) = :today", { today: todayStr })
      .getRawOne();
    const todayUsers = await this.userModel.createQueryBuilder('u')
      .where('u.is_deleted = 0')
      .andWhere("DATE(u.created_at) = :today", { today: todayStr })
      .getCount();

    const orderMap: Record<string, number> = {};
    orderTrend.forEach((r: any) => {
      const d = typeof r.date === 'string' ? r.date.slice(0, 10) : localDate(new Date(r.date));
      orderMap[d] = Number(r.count);
    });
    const userMap: Record<string, number> = {};
    userTrend.forEach((r: any) => {
      const d = typeof r.date === 'string' ? r.date.slice(0, 10) : localDate(new Date(r.date));
      userMap[d] = Number(r.count);
    });

    return {
      success: true,
      data: {
        todayUsers, todayOrders,
        todayGMV: Number(todayGMVResult?.total || 0),
        pendingMerchants,
        totalUsers, totalOrders,
        totalGMV: Number(totalGMVResult?.total || 0),
        totalMerchants,
        orderTrend: days.map(d => orderMap[d] || 0),
        userTrend: days.map(d => userMap[d] || 0),
        orderTypeDistribution: orderTypeDistribution.map((r: any) => ({
          name: r.type,
          value: Number(r.value),
        })),
      },
    };
  }

  // 图表数据接口（兼容前端旧请求）
  @Get('/chart')
  async chart() {
    return this.stats();
  }
}
