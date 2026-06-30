import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { OperationLog } from '../entity/operation-log.entity';

/**
 * 操作日志中间件：自动记录管理员的操作
 */
@Middleware()
export class OperationLogMiddleware implements IMiddleware<Context, NextFunction> {

  @InjectEntityModel(OperationLog)
  logModel: Repository<OperationLog>;

  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      await next();

      // 只记录 POST/PUT/DELETE 请求（写操作）
      if (!['POST', 'PUT', 'DELETE'].includes(ctx.method.toUpperCase())) return;
      // 跳过非管理类路径
      const path = ctx.path;
      if (path.startsWith('/api/admin/login')) return;
      if (/^\/(api\/)?(product|restaurant|homestay|ticket|banner|announcement|admin|user-admin|role|application|merchant-application|agro|topic|travel-note|comment|product-review|restaurant-review|homestay-review|ticket-review|order|settlement|meal-slot|traffic-guide|message|product-category|agro-category)/.test(path)) {
        try {
          const user = (ctx as any).currentUser;
          const log = new OperationLog();
          log.operatorId = user?.id || 0;
          log.operatorName = user?.username || user?.name || '系统';
          log.action = ctx.method.toUpperCase();
          log.target = path;
          log.detail = JSON.stringify({ query: ctx.query, body: ctx.request.body }).slice(0, 500);
          log.ip = ctx.ip;
          await this.logModel.save(log);
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
