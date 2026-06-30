import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';import { Context } from '@midwayjs/koa';import { RecommendService } from '../service/recommend.service';
@Controller('/api/recommend') export class RecommendController {
  @Inject() ctx: Context; @Inject() service: RecommendService;
  @Get('/list') async list(){const list=await this.service.list();return{success:true,data:list};}
  @Get('/active') async active(){const list=await this.service.activeList();return{success:true,data:list};}
  @Post('/create') async create(@Body()b:any){const r=await this.service.create(b);return{success:true,message:'创建成功',data:r};}
  @Put('/update') async update(@Body()b:any){const{id,...d}=b;const r=await this.service.update(id,d);return r?{success:true,message:'更新成功'}:{success:false,message:'不存在'};}
  @Del('/delete') async delete(@Query('id')id:number){const ok=await this.service.remove(id);return ok?{success:true,message:'已删除'}:{success:false,message:'不存在'};}
}
