import { Inject, Controller, Get, Post, Put, Body, Query } from '@midwayjs/core'; import { Context } from '@midwayjs/koa'; import { RoomCalendarService } from '../service/room-calendar.service';
@Controller('/api/room-calendar') export class RoomCalendarController {
  @Inject() ctx: Context; @Inject() service: RoomCalendarService;
  @Get('/list') async list(@Query('homestayId') hid: number, @Query('days') days: number) { const list = await this.service.listByHomestay(hid, days||7); return { success: true, data: list }; }
  @Put('/set') async set(@Body() b: { id: number; availableRooms?: number; status?: number; price?: number }) { const r = await this.service.set(b.id, b); return r ? { success: true, message: '更新成功', data: r } : { success: false, message: '不存在' }; }
  @Post('/batch') async batchSet(@Body() b: { homestayId: number; date: string; availableRooms: number; status: number; price?: number }) { const r = await this.service.batchSet(b.homestayId, b.date, b.availableRooms, b.status, b.price); return { success: true, message: '设置成功', data: r }; }
}
