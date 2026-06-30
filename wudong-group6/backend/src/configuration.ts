import { Configuration, App, Logger } from '@midwayjs/core';
import * as koa from '@midwayjs/koa';
import * as validate from '@midwayjs/validate';
import * as info from '@midwayjs/info';
import * as typeorm from '@midwayjs/typeorm';
import { join } from 'path';
import { ReportMiddleware } from './middleware/report.middleware';
import { OperationLogMiddleware } from './middleware/operation-log.middleware';

@Configuration({
  imports: [
    koa,
    validate,
    typeorm,
    {
      component: info,
      enabledEnvironment: ['local'],
    },
  ],
  importConfigs: [join(__dirname, './config')],
})
export class MainConfiguration {
  @App('koa')
  app: koa.Application;

  @Logger()
  logger;

  async onReady() {
    // CORS 必须通过原生 Koa 注册在中间件链最前端，比所有路由更早执行
    this.app.use(async (ctx, next) => {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      ctx.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      ctx.set('Access-Control-Allow-Credentials', 'true');

      if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
        ctx.body = '';
        return;
      }

      await next();
    });

    this.app.useMiddleware([ReportMiddleware, OperationLogMiddleware]);
  }
}
