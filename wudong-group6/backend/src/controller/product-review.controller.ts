import { Inject, Controller, Get, Post, Put, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ProductReviewService } from '../service/product-review.service';

@Controller('/api/product-review')
export class ProductReviewController {
  @Inject() ctx: Context;
  @Inject() service: ProductReviewService;

  @Get('/list')
  async list(@Query('productId') productId: number, @Query('page') page: number, @Query('pageSize') pageSize: number) {
    const r = await this.service.listByProduct(productId, page, pageSize);
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/admin/list')
  async adminList(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('productId') productId: number, @Query('status') status: number) {
    const r = await this.service.adminList({ page, pageSize, productId, status });
    return { success: true, data: r.list, total: r.total };
  }

  @Post('/create')
  async create(@Body() body: any) { const r = await this.service.create(body); return { success: true, message: '评价成功', data: r }; }

  @Put('/reply')
  async reply(@Body() body: { id: number; reply: string }) { const r = await this.service.reply(body.id, body.reply); return r ? { success: true, message: '回复成功' } : { success: false, message: '评价不存在' }; }

  @Put('/status')
  async status(@Body() body: { id: number; status: number }) { const r = await this.service.updateStatus(body.id, body.status); return r ? { success: true, message: '状态更新' } : { success: false, message: '评价不存在' }; }
}
