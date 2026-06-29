import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { HomestayService } from '../service/homestay.service';

@Controller('/api/homestay')
export class HomestayController {
  @Inject() ctx: Context;
  @Inject() hService: HomestayService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('minPrice') minPrice: number, @Query('maxPrice') maxPrice: number, @Query('minRating') minRating: number, @Query('amenity') amenity: string) {
    const r = await this.hService.list({ page, pageSize, keyword, minPrice, maxPrice, minRating, amenity });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/admin/list')
  async adminList(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('status') status: number) {
    const r = await this.hService.adminList({ page, pageSize, keyword, status });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) { const p = await this.hService.detail(id); return p ? { success: true, data: p } : { success: false, message: '不存在' }; }

  @Post('/create')
  async create(@Body() body: any) { const r = await this.hService.create(body); return { success: true, message: '创建成功', data: r }; }

  @Put('/update')
  async update(@Body() body: any) { const { id, ...data } = body; const r = await this.hService.update(id, data); return r ? { success: true, message: '更新成功' } : { success: false, message: '不存在' }; }

  @Del('/delete')
  async delete(@Query('id') id: number) { const ok = await this.hService.remove(id); return ok ? { success: true, message: '删除成功' } : { success: false, message: '不存在' }; }

  @Put('/status')
  async status(@Body() body: { id: number; status: number }) { const r = await this.hService.updateStatus(body.id, body.status); return r ? { success: true, message: '状态更新' } : { success: false, message: '不存在' }; }

  @Get('/stats')
  async stats() { const data = await this.hService.stats(); return { success: true, data }; }
}
