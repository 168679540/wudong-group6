import { Inject, Controller, Get, Query } from '@midwayjs/core';import { Context } from '@midwayjs/koa';import { OperationLogService } from '../service/operation-log.service';
@Controller('/api/operation-log') export class OperationLogController {
  @Inject() ctx: Context; @Inject() service: OperationLogService;
  @Get('/list') async list(@Query('page')p:number,@Query('pageSize')ps:number){const r=await this.service.list(p,ps);return{success:true,data:r.list,total:r.total};}
}
