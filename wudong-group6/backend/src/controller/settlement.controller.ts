import { Inject, Controller, Get, Post, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { SettlementService } from '../service/settlement.service';

@Controller('/api/settlement')
export class SettlementController {
  @Inject()
  ctx: Context;

  @Inject()
  settlementService: SettlementService;

  @Get('/list')
  async list(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
    @Query('type') type: string,
    @Query('status') status: number,
  ) {
    const result = await this.settlementService.list({ page, pageSize, keyword, type, status });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  @Get('/stats')
  async stats() {
    const data = await this.settlementService.stats();
    return { success: true, data };
  }

  @Post('/settle')
  async settle(@Body() body: { id: number }) {
    const ok = await this.settlementService.settle(body.id);
    return ok
      ? { success: true, message: '结算完成' }
      : { success: false, message: '商户不存在' };
  }
}
