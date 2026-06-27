import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AnnouncementService } from '../service/announcement.service';

@Controller('/api/announcement')
export class AnnouncementController {
  @Inject()
  ctx: Context;

  @Inject()
  announcementService: AnnouncementService;

  /**
   * 公告列表（分页）
   */
  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('type') type: string, @Query('status') status: number) {
    const result = await this.announcementService.list({ page, pageSize, keyword, type, status });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  /**
   * 公告详情
   */
  @Get('/detail')
  async detail(@Query('id') id: number) {
    const announcement = await this.announcementService.detail(id);
    if (!announcement) {
      return { success: false, message: '公告不存在' };
    }
    return { success: true, message: 'OK', data: announcement };
  }

  /**
   * 创建公告
   */
  @Post('/create')
  async create(@Body() body: any) {
    const announcement = await this.announcementService.create(body);
    return { success: true, message: '创建成功', data: announcement };
  }

  /**
   * 更新公告
   */
  @Put('/update')
  async update(@Body() body: any) {
    const { id, ...data } = body;
    const announcement = await this.announcementService.update(id, data);
    if (!announcement) {
      return { success: false, message: '公告不存在' };
    }
    return { success: true, message: '更新成功', data: announcement };
  }

  /**
   * 删除公告（软删除）
   */
  @Del('/delete')
  async delete(@Query('id') id: number) {
    const result = await this.announcementService.remove(id);
    if (!result) {
      return { success: false, message: '公告不存在' };
    }
    return { success: true, message: '删除成功' };
  }

  /**
   * 发布公告
   */
  @Put('/publish')
  async publish(@Body() body: { id: number }) {
    const { id } = body;
    const announcement = await this.announcementService.publish(id);
    if (!announcement) {
      return { success: false, message: '公告不存在' };
    }
    return { success: true, message: '发布成功', data: announcement };
  }

  /**
   * 置顶/取消置顶
   */
  @Put('/toggleTop')
  async toggleTop(@Body() body: { id: number }) {
    const { id } = body;
    const announcement = await this.announcementService.toggleTop(id);
    if (!announcement) {
      return { success: false, message: '公告不存在' };
    }
    return { success: true, message: '操作成功', data: announcement };
  }
}
