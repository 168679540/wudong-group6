import { Inject, Controller, Get, Post, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { ApplicationService } from '../service/application.service';

@Controller('/api/merchant-application')
export class MerchantApplicationController {
  @Inject()
  ctx: Context;

  @Inject()
  merchantApplicationService: ApplicationService;

  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('status') status: number, @Query('keyword') keyword: string) {
    const result = await this.merchantApplicationService.list({ page, pageSize, status, keyword });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  @Post('/create')
  async create(@Body() body: { userId: number; shopName: string; module: string; contactName?: string; contactPhone?: string }) {
    const result = await this.merchantApplicationService.create(body);
    return { success: true, message: '申请已提交', data: result };
  }

  @Post('/review')
  async review(@Body() body: { id: number; status: number; rejectReason?: string }) {
    const result = await this.merchantApplicationService.update(body.id, {
      status: body.status,
      rejectReason: body.rejectReason,
    });
    if (!result) {
      return { success: false, message: '审核失败' };
    }
    return { success: true, message: '审核成功' };
  }
}