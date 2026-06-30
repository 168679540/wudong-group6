import { Inject, Controller, Get, Post, Put, Body, Query } from '@midwayjs/core';import { Context } from '@midwayjs/koa';import { ReportService } from '../service/report.service';
@Controller('/api/report') export class ReportController {
  @Inject() ctx: Context; @Inject() service: ReportService;
  @Get('/admin/list') async adminList(@Query('page')p:number,@Query('pageSize')ps:number){const r=await this.service.adminList(p,ps);return{success:true,data:r.list,total:r.total};}
  @Post('/create') async create(@Body()b:any){const r=await this.service.create(b);return{success:true,message:'举报已提交',data:r};}
  @Put('/handle') async handle(@Body()b:{id:number;status:number;handledBy:number;handleNote?:string}){const r=await this.service.handle(b.id,b.handledBy,b.handleNote||'');return r?{success:true,message:'已处理'}:{success:false,message:'不存在'};}
}
