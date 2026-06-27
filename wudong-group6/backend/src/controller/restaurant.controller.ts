import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { RestaurantService } from '../service/restaurant.service';

@Controller('/api/restaurant')
export class RestaurantController {
  @Inject() ctx: Context;
  @Inject() restaurantService: RestaurantService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string) {
    const r = await this.restaurantService.list({ page, pageSize, keyword });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) {
    const p = await this.restaurantService.detail(id);
    return p ? { success: true, data: p } : { success: false, message: '餐厅不存在' };
  }
}
