import { Inject, Controller, Get, Post, Put, Body, Query } from '@midwayjs/core';import { Context } from '@midwayjs/koa';import { TicketReviewService } from '../service/ticket-review.service';
@Controller('/api/ticket-review') export class TicketReviewController {
  @Inject() ctx: Context; @Inject() service: TicketReviewService;
  @Get('/list') async list(@Query('ticketId')tid:number,@Query('page')p:number,@Query('pageSize')ps:number){const r=await this.service.listByTicket(tid,p,ps);return{success:true,data:r.list,total:r.total};}
  @Get('/admin/list') async adminList(@Query('page')p:number,@Query('pageSize')ps:number,@Query('ticketId')tid:number,@Query('status')s:number){const r=await this.service.adminList({page:p,pageSize:ps,ticketId:tid,status:s});return{success:true,data:r.list,total:r.total};}
  @Post('/create') async create(@Body()b:any){const r=await this.service.create(b);return{success:true,message:'评价成功',data:r};}
  @Put('/reply') async reply(@Body()b:{id:number;reply:string}){const r=await this.service.reply(b.id,b.reply);return r?{success:true,message:'回复成功'}:{success:false,message:'不存在'};}
  @Put('/status') async status(@Body()b:{id:number;status:number}){const r=await this.service.updateStatus(b.id,b.status);return r?{success:true,message:'状态更新'}:{success:false,message:'不存在'};}
}
