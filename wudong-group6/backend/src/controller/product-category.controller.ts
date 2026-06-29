import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ProductCategoryService } from '../service/product-category.service';

@Controller('/api/product-category')
export class ProductCategoryController {
  @Inject() ctx: Context;
  @Inject() service: ProductCategoryService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    const r = await this.service.list({ page, pageSize });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/active')
  async active() {
    const list = await this.service.activeList();
    return { success: true, data: list };
  }

  @Post('/create')
  async create(@Body() body: any) { const c = await this.service.create(body); return { success: true, message: '创建成功', data: c }; }

  @Put('/update')
  async update(@Body() body: any) { const { id, ...data } = body; const c = await this.service.update(id, data); return c ? { success: true, message: '更新成功', data: c } : { success: false, message: '分类不存在' }; }

  @Del('/delete')
  async delete(@Query('id') id: number) { const ok = await this.service.remove(id); return ok ? { success: true, message: '删除成功' } : { success: false, message: '分类不存在' }; }
}
