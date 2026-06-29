import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { RestaurantService } from '../service/restaurant.service';

@Controller('/api/restaurant')
export class RestaurantController {
  @Inject() ctx: Context;
  @Inject() rService: RestaurantService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string) {
    const r = await this.rService.list({ page, pageSize, keyword });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/admin/list')
  async adminList(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('status') status: number) {
    const r = await this.rService.adminList({ page, pageSize, keyword, status });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) { const p = await this.rService.detail(id); return p ? { success: true, data: p } : { success: false, message: '不存在' }; }

  @Post('/create')
  async create(@Body() body: any) { const r = await this.rService.create(body); return { success: true, message: '创建成功', data: r }; }

  @Put('/update')
  async update(@Body() body: any) { const { id, ...data } = body; const r = await this.rService.update(id, data); return r ? { success: true, message: '更新成功' } : { success: false, message: '不存在' }; }

  @Del('/delete')
  async delete(@Query('id') id: number) { const ok = await this.rService.remove(id); return ok ? { success: true, message: '删除成功' } : { success: false, message: '不存在' }; }

  @Put('/status')
  async status(@Body() body: { id: number; status: number }) { const r = await this.rService.updateStatus(body.id, body.status); return r ? { success: true, message: '状态更新' } : { success: false, message: '不存在' }; }

  @Get('/stats')
  async stats() { const data = await this.rService.stats(); return { success: true, data }; }
}
