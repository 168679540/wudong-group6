import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core'; import { Context } from '@midwayjs/koa'; import { AgroCategoryService } from '../service/agro-category.service';
@Controller('/api/agro-category') export class AgroCategoryController {
  @Inject() ctx: Context; @Inject() service: AgroCategoryService;
  @Get('/list') async list(@Query('page')p:number,@Query('pageSize')ps:number){const r=await this.service.list({page:p,pageSize:ps});return{success:true,data:r.list,total:r.total};}
  @Get('/active') async active(){const list=await this.service.activeList();return{success:true,data:list};}
  @Post('/create') async create(@Body()b:any){const r=await this.service.create(b);return{success:true,message:'创建成功',data:r};}
  @Put('/update') async update(@Body()b:any){const{id,...d}=b;const r=await this.service.update(id,d);return r?{success:true,message:'更新成功'}:{success:false,message:'不存在'};}
  @Del('/delete') async delete(@Query('id')id:number){const ok=await this.service.remove(id);return ok?{success:true,message:'删除成功'}:{success:false,message:'不存在'};}
}
