import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core'; import { Context } from '@midwayjs/koa'; import { MealSlotService } from '../service/meal-slot.service';
@Controller('/api/meal-slot') export class MealSlotController {
  @Inject() ctx: Context; @Inject() service: MealSlotService;
  @Get('/list') async list(@Query('restaurantId') rid:number){const r=await this.service.listByRestaurant(rid);return{success:true,data:r};}
  @Get('/admin/list') async adminList(@Query('restaurantId') rid:number){const r=await this.service.adminList(rid);return{success:true,data:r};}
  @Post('/create') async create(@Body() b:any){const r=await this.service.create(b);return{success:true,message:'创建成功',data:r};}
  @Put('/update') async update(@Body() b:any){const{id,...d}=b;const r=await this.service.update(id,d);return r?{success:true,message:'更新成功'}:{success:false,message:'不存在'};}
  @Del('/delete') async delete(@Query('id') id:number){const ok=await this.service.remove(id);return ok?{success:true,message:'删除成功'}:{success:false,message:'不存在'};}
}
