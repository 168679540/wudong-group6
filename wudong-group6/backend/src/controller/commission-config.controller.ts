import { Inject, Controller, Get, Put, Body } from '@midwayjs/core'; import { Context } from '@midwayjs/koa'; import { CommissionConfigService } from '../service/commission-config.service';
@Controller('/api/commission') export class CommissionConfigController {
  @Inject() ctx: Context; @Inject() service: CommissionConfigService;
  @Get('/list') async list() { const list = await this.service.list(); return { success: true, data: list }; }
  @Put('/update') async update(@Body() b: { moduleName: string; rate: number }) { const r = await this.service.update(b.moduleName, b.rate); return r ? { success: true, message: '保存成功', data: r } : { success: false, message: '保存失败' }; }
}
