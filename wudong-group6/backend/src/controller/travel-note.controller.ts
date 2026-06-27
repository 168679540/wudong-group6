import { Inject, Controller, Get, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { TravelNoteService } from '../service/travel-note.service';

@Controller('/api/travel-note')
export class TravelNoteController {
  @Inject()
  ctx: Context;

  @Inject()
  travelNoteService: TravelNoteService;

  @Get('/list')
  async list(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
    @Query('status') status: number,
    @Query('location') location: string,
  ) {
    const result = await this.travelNoteService.list({ page, pageSize, keyword, status, location });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) {
    const note = await this.travelNoteService.detail(id);
    if (!note) return { success: false, message: '游记不存在' };
    return { success: true, data: note };
  }

  @Put('/approve')
  async approve(@Body() body: { id: number; reviewerId: number }) {
    const note = await this.travelNoteService.approve(body.id, body.reviewerId);
    if (!note) return { success: false, message: '游记不存在' };
    return { success: true, message: '审核通过' };
  }

  @Put('/reject')
  async reject(@Body() body: { id: number; reviewerId: number; reason: string }) {
    const note = await this.travelNoteService.reject(body.id, body.reviewerId, body.reason);
    if (!note) return { success: false, message: '游记不存在' };
    return { success: true, message: '已驳回' };
  }

  @Put('/take-down')
  async takeDown(@Body() body: { id: number }) {
    const note = await this.travelNoteService.takeDown(body.id);
    if (!note) return { success: false, message: '游记不存在' };
    return { success: true, message: '已下架' };
  }

  @Del('/delete')
  async delete(@Query('id') id: number) {
    const ok = await this.travelNoteService.remove(id);
    return ok
      ? { success: true, message: '删除成功' }
      : { success: false, message: '游记不存在' };
  }
}
