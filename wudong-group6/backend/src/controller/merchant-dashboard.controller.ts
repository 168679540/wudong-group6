import { Inject, Controller, Get, Query } from '@midwayjs/core'; import { Context } from '@midwayjs/koa'; import { MerchantDashboardService } from '../service/merchant-dashboard.service';
@Controller('/api/merchant-dashboard') export class MerchantDashboardController {
  @Inject() ctx: Context; @Inject() service: MerchantDashboardService;
  @Get('/stats') async stats(@Query('merchantId') mid: number) { const data = await this.service.getStats(mid||1); return { success: true, data }; }
}
