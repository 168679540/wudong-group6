import { Inject, Controller, Get, Post, Del, Body, Query } from '@midwayjs/core';import { Context } from '@midwayjs/koa';import { SensitiveWordService } from '../service/sensitive-word.service';
@Controller('/api/sensitive-word') export class SensitiveWordController {
  @Inject() ctx: Context; @Inject() service: SensitiveWordService;
  @Get('/list') async list(){const list=await this.service.list();return{success:true,data:list};}
  @Post('/create') async create(@Body()b:any){const r=await this.service.create(b);return{success:true,message:'已添加',data:r};}
  @Del('/delete') async delete(@Query('id')id:number){const ok=await this.service.remove(id);return ok?{success:true,message:'已删除'}:{success:false,message:'不存在'};}
}
