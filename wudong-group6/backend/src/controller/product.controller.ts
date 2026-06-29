import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ProductService } from '../service/product.service';
import { Product } from '../entity/product.entity';

@Controller('/api/product')
export class ProductController {
  @Inject() ctx: Context;
  @Inject() productService: ProductService;

  /** PC端列表（仅上架商品，支持价格筛选+排序） */
  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('category') category: string, @Query('minPrice') minPrice: number, @Query('maxPrice') maxPrice: number, @Query('minRating') minRating: number, @Query('sort') sort: string) {
    const r = await this.productService.list({ page, pageSize, keyword, category, minPrice, maxPrice, minRating, sort });
    return { success: true, data: r.list, total: r.total };
  }

  /** 管理后台列表（含下架） */
  @Get('/admin/list')
  async adminList(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('category') category: string, @Query('status') status: number) {
    const r = await this.productService.adminList({ page, pageSize, keyword, category, status });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) {
    const p = await this.productService.detail(id);
    return p ? { success: true, data: p } : { success: false, message: '商品不存在' };
  }

  @Post('/create')
  async create(@Body() body: any) {
    const p = await this.productService.create(body);
    return { success: true, message: '创建成功', data: p };
  }

  @Put('/update')
  async update(@Body() body: any) {
    const { id, ...data } = body;
    const p = await this.productService.update(id, data);
    return p ? { success: true, message: '更新成功', data: p } : { success: false, message: '商品不存在' };
  }

  @Del('/delete')
  async delete(@Query('id') id: number) {
    const ok = await this.productService.remove(id);
    return ok ? { success: true, message: '删除成功' } : { success: false, message: '商品不存在' };
  }

  @Put('/status')
  async updateStatus(@Body() body: { id: number; status: number }) {
    const p = await this.productService.updateStatus(body.id, body.status);
    return p ? { success: true, message: '状态更新成功', data: p } : { success: false, message: '商品不存在' };
  }

  @Get('/stats')
  async stats() {
    const data = await this.productService.stats();
    return { success: true, data };
  }

  @Post('/batch-create')
  async batchCreate(@Body() body: { items: Partial<Product>[] }) {
    const count = await this.productService.batchCreate(body.items || []);
    return { success: true, message: `成功导入 ${count} 件商品`, data: { count } };
  }
}
