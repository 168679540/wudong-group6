import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';import { Context } from '@midwayjs/koa';import { TrafficGuideService } from '../service/traffic-guide.service';
@Controller('/api/traffic-guide') export class TrafficGuideController {
  @Inject() ctx: Context; @Inject() service: TrafficGuideService;
  @Get('/list') async list(@Query('page')p:number,@Query('pageSize')ps:number,@Query('keyword')kw:string){const r=await this.service.list({page:p,pageSize:ps,keyword:kw});return{success:true,data:r.list,total:r.total};}
  @Get('/admin/list') async adminList(@Query('page')p:number,@Query('pageSize')ps:number,@Query('status')s:number){const r=await this.service.adminList({page:p,pageSize:ps,status:s});return{success:true,data:r.list,total:r.total};}
  @Get('/detail') async detail(@Query('id')id:number){const d=await this.service.detail(id);return d?{success:true,data:d}:{success:false,message:'不存在'};}
  @Post('/create') async create(@Body()b:any){const r=await this.service.create(b);return{success:true,message:'创建成功',data:r};}
  @Put('/update') async update(@Body()b:any){const{id,...d}=b;const r=await this.service.update(id,d);return r?{success:true,message:'更新成功'}:{success:false,message:'不存在'};}
  @Del('/delete') async delete(@Query('id')id:number){const ok=await this.service.remove(id);return ok?{success:true,message:'删除成功'}:{success:false,message:'不存在'};}
}
