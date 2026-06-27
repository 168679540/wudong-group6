import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApplicationService } from '../service/application.service';

@Controller('/api/application')
export class ApplicationController {
  @Inject()
  ctx: Context;

  @Inject()
  applicationService: ApplicationService;

  /**
   * 申请列表（分页）
   */
  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('module') module: string, @Query('status') status: number) {
    const result = await this.applicationService.list({ page, pageSize, keyword, module, status });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  /**
   * 申请详情
   */
  @Get('/detail')
  async detail(@Query('id') id: number) {
    const application = await this.applicationService.detail(id);
    if (!application) {
      return { success: false, message: '申请不存在' };
    }
    return { success: true, message: 'OK', data: application };
  }

  /**
   * 提交入驻申请
   */
  @Post('/create')
  async create(@Body() body: any) {
    const application = await this.applicationService.create(body);
    return { success: true, message: '提交成功', data: application };
  }

  /**
   * 更新申请
   */
  @Put('/update')
  async update(@Body() body: any) {
    const { id, ...data } = body;
    const application = await this.applicationService.update(id, data);
    if (!application) {
      return { success: false, message: '申请不存在' };
    }
    return { success: true, message: '更新成功', data: application };
  }

  /**
   * 删除申请（软删除）
   */
  @Del('/delete')
  async delete(@Query('id') id: number) {
    const result = await this.applicationService.remove(id);
    if (!result) {
      return { success: false, message: '申请不存在' };
    }
    return { success: true, message: '删除成功' };
  }

  /**
   * 审核通过
   */
  @Put('/approve')
  async approve(@Body() body: { id: number; reviewerId: number }) {
    const { id, reviewerId } = body;
    const application = await this.applicationService.approve(id, reviewerId);
    if (!application) {
      return { success: false, message: '申请不存在' };
    }
    return { success: true, message: '审核通过', data: application };
  }

  /**
   * 审核驳回
   */
  @Put('/reject')
  async reject(@Body() body: { id: number; reviewerId: number; reason: string }) {
    const { id, reviewerId, reason } = body;
    const application = await this.applicationService.reject(id, reviewerId, reason);
    if (!application) {
      return { success: false, message: '申请不存在' };
    }
    return { success: true, message: '已驳回', data: application };
  }
}
