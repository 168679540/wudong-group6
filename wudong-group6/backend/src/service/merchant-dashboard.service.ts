import { Provide } from '@midwayjs/core'; import { InjectEntityModel } from '@midwayjs/typeorm'; import { Repository } from 'typeorm'; import { Order } from '../entity/order.entity';
@Provide() export class MerchantDashboardService {
  @InjectEntityModel(Order) orderModel: Repository<Order>;
  async getStats(merchantId: number) {
    const today = new Date().toISOString().slice(0,10);
    const[todayOrders,todayGMV,totalOrders,pendingCount] = await Promise.all([
      this.orderModel.createQueryBuilder('o').where('o.merchant_id=:mid',{mid:merchantId}).andWhere("DATE(o.created_at)=:t",{t:today}).getCount(),
      this.orderModel.createQueryBuilder('o').select('COALESCE(SUM(o.amount),0)','t').where('o.merchant_id=:mid',{mid:merchantId}).andWhere("DATE(o.created_at)=:t",{t:today}).getRawOne(),
      this.orderModel.createQueryBuilder('o').where('o.merchant_id=:mid',{mid:merchantId}).getCount(),
      this.orderModel.createQueryBuilder('o').where('o.merchant_id=:mid',{mid:merchantId}).andWhere('o.status=1').getCount(),
    ]);
    return {todayOrders,todayGMV: Number(todayGMV?.t||0),totalOrders,pendingCount};
  }
}
