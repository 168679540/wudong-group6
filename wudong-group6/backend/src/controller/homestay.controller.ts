import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { HomestayService } from '../service/homestay.service';

@Controller('/api/homestay')
export class HomestayController {
  @Inject() ctx: Context;
  @Inject() homestayService: HomestayService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string) {
    const r = await this.homestayService.list({ page, pageSize, keyword });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) {
    const p = await this.homestayService.detail(id);
    return p ? { success: true, data: p } : { success: false, message: '民宿不存在' };
  }
}
