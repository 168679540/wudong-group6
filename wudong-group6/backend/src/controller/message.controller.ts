import { Inject, Controller, Get, Post, Del, Body, Query } from '@midwayjs/core';import { Context } from '@midwayjs/koa';import { MessageService } from '../service/message.service';
@Controller('/api/message') export class MessageController {
  @Inject() ctx: Context; @Inject() service: MessageService;
  @Get('/list') async list(@Query('userId')uid:number,@Query('page')p:number,@Query('pageSize')ps:number){const r=await this.service.list(uid||1,p,ps);return{success:true,data:r.list,total:r.total};}
  @Get('/admin/list') async adminList(@Query('page')p:number,@Query('pageSize')ps:number){const r=await this.service.adminList(p,ps);return{success:true,data:r.list,total:r.total};}
  @Post('/create') async create(@Body()b:any){const r=await this.service.create(b);return{success:true,message:'发送成功',data:r};}
  @Del('/delete') async delete(@Query('id')id:number){const ok=await this.service.remove(id);return ok?{success:true,message:'已删除'}:{success:false,message:'不存在'};}
}
