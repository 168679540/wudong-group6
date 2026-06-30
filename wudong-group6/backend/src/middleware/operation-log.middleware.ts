import { Inject, Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { TypeORMDataSourceManager } from '@midwayjs/typeorm';
import { OperationLog } from '../entity/operation-log.entity';

/**
 * 操作日志中间件：自动记录管理员的操作
 */
@Middleware()
export class OperationLogMiddleware implements IMiddleware<Context, NextFunction> {

  @Inject()
  dataSourceManager: TypeORMDataSourceManager;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      await next();

      if (!['POST', 'PUT', 'DELETE'].includes(ctx.method.toUpperCase())) return;
      const path = ctx.path;
      if (path.startsWith('/api/admin/login')) return;
      if (/^\/(api\/)?(product|restaurant|homestay|ticket|banner|announcement|admin|user-admin|role|application|merchant-application|agro|topic|travel-note|comment|product-review|restaurant-review|homestay-review|ticket-review|order|settlement|meal-slot|traffic-guide|message|product-category|agro-category|recommend|sensitive-word|report)/.test(path)) {
        try {
          const user = (ctx as any).currentUser;
          const ds = this.dataSourceManager.getDataSource('default');
          const logModel = ds.getRepository(OperationLog);
          const log = new OperationLog();
          log.operatorId = user?.id || 0;
          log.operatorName = user?.username || user?.name || '';
          log.action = ctx.method.toUpperCase();
          log.target = path;
          log.detail = JSON.stringify({ query: ctx.query, body: ctx.request.body || {} }).slice(0, 500);
          log.ip = ctx.ip;
          await logModel.save(log);
        } catch (e) {
          // 日志失败不影响业务
        }
      }
    };
  }

  static getName(): string {
    return 'operationLog';
  }
}
