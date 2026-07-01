import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { TicketService } from '../service/ticket.service';

@Controller('/api/ticket')
export class TicketController {
  @Inject() ctx: Context;
  @Inject() tService: TicketService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('type') type: string, @Query('minPrice') minPrice: number, @Query('maxPrice') maxPrice: number, @Query('minRating') minRating: number) {
    const r = await this.tService.list({ page, pageSize, keyword, type, minPrice, maxPrice, minRating });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/admin/list')
  async adminList(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('type') type: string, @Query('status') status: number) {
    const r = await this.tService.adminList({ page, pageSize, keyword, type, status });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) { const p = await this.tService.detail(id); return p ? { success: true, data: p } : { success: false, message: '不存在' }; }

  @Post('/create')
  async create(@Body() body: any) { const r = await this.tService.create(body); return { success: true, message: '创建成功', data: r }; }

  @Put('/update')
  async update(@Body() body: any) { const { id, ...data } = body; const r = await this.tService.update(id, data); return r ? { success: true, message: '更新成功' } : { success: false, message: '不存在' }; }

  @Del('/delete')
  async delete(@Query('id') id: number) { const ok = await this.tService.remove(id); return ok ? { success: true, message: '删除成功' } : { success: false, message: '不存在' }; }

  @Put('/status')
  async status(@Body() body: { id: number; status: number }) { const r = await this.tService.updateStatus(body.id, body.status); return r ? { success: true, message: '状态更新' } : { success: false, message: '不存在' }; }

  @Get('/stats')
  async stats() { const data = await this.tService.stats(); return { success: true, data }; }

  @Post('/verify')
  async verify(@Body() body: { eTicketCode: string }) {
    const ticket = await this.tService.verifyETicket(body.eTicketCode);
    return ticket ? { success: true, message: '核销成功' } : { success: false, message: '电子票无效或已核销' };
  }
}
