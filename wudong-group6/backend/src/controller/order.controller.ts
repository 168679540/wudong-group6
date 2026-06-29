import { Inject, Controller, Get, Post, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { OrderService } from '../service/order.service';

@Controller('/api/order')
export class OrderController {
  @Inject() ctx: Context;
  @Inject() orderService: OrderService;

  @Get('/list')
  async list(
    @Query('page') page: number, @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string, @Query('type') type: string, @Query('status') status: number,
  ) {
    const result = await this.orderService.list({ page, pageSize, keyword, type, status });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  @Post('/create')
  async create(@Body() body: { type: string; amount: number; userId?: number; merchantId?: number; itemName?: string; itemImage?: string }) {
    const order = await this.orderService.create(body);
    return { success: true, message: '下单成功', data: order };
  }

  @Post('/ship')
  async ship(@Body() body: { id: number; expressCompany: string; expressNo: string }) {
    const order = await this.orderService.ship(body.id, body.expressCompany, body.expressNo);
    return order ? { success: true, message: '发货成功', data: order } : { success: false, message: '订单不存在' };
  }
}
