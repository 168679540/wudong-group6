import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { TicketService } from '../service/ticket.service';

@Controller('/api/ticket')
export class TicketController {
  @Inject() ctx: Context;
  @Inject() ticketService: TicketService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('type') type: string) {
    const r = await this.ticketService.list({ page, pageSize, keyword, type });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) {
    const p = await this.ticketService.detail(id);
    return p ? { success: true, data: p } : { success: false, message: '门票/路线不存在' };
  }
}
