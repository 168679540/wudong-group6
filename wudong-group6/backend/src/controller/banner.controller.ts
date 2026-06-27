import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { BannerService } from '../service/banner.service';

@Controller('/api/banner')
export class BannerController {
  @Inject()
  ctx: Context;

  @Inject()
  bannerService: BannerService;

  /**
   * 轮播图列表（分页，后台管理）
   */
  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('position') position: string, @Query('status') status: number) {
    const result = await this.bannerService.list({ page, pageSize, keyword, position, status });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  /**
   * 启用中的轮播图（前端展示）
   */
  @Get('/active')
  async active(@Query('position') position: string) {
    const list = await this.bannerService.getActiveList(position);
    return { success: true, message: 'OK', data: list };
  }

  /**
   * 轮播图详情
   */
  @Get('/detail')
  async detail(@Query('id') id: number) {
    const banner = await this.bannerService.detail(id);
    if (!banner) {
      return { success: false, message: '轮播图不存在' };
    }
    return { success: true, message: 'OK', data: banner };
  }

  /**
   * 创建轮播图
   */
  @Post('/create')
  async create(@Body() body: any) {
    const banner = await this.bannerService.create(body);
    return { success: true, message: '创建成功', data: banner };
  }

  /**
   * 更新轮播图
   */
  @Put('/update')
  async update(@Body() body: any) {
    const { id, ...data } = body;
    const banner = await this.bannerService.update(id, data);
    if (!banner) {
      return { success: false, message: '轮播图不存在' };
    }
    return { success: true, message: '更新成功', data: banner };
  }

  /**
   * 删除轮播图（软删除）
   */
  @Del('/delete')
  async delete(@Query('id') id: number) {
    const result = await this.bannerService.remove(id);
    if (!result) {
      return { success: false, message: '轮播图不存在' };
    }
    return { success: true, message: '删除成功' };
  }

  /**
   * 修改轮播图状态
   */
  @Put('/status')
  async updateStatus(@Body() body: { id: number; status: number }) {
    const { id, status } = body;
    const banner = await this.bannerService.updateStatus(id, status);
    if (!banner) {
      return { success: false, message: '轮播图不存在' };
    }
    return { success: true, message: '状态更新成功', data: banner };
  }
}
