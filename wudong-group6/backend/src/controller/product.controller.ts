import { Inject, Controller, Get, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ProductService } from '../service/product.service';

@Controller('/api/product')
export class ProductController {
  @Inject() ctx: Context;
  @Inject() productService: ProductService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('category') category: string) {
    const r = await this.productService.list({ page, pageSize, keyword, category });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) {
    const p = await this.productService.detail(id);
    return p ? { success: true, data: p } : { success: false, message: '商品不存在' };
  }
}
