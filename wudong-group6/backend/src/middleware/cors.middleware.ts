import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';

@Middleware()
export class CorsMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      ctx.set('Access-Control-Allow-Origin', '*');
      ctx.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
      ctx.set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
      ctx.set('Access-Control-Allow-Credentials', 'true');

      if (ctx.method === 'OPTIONS') {
        ctx.status = 204;
        return;
      }

      await next();

      // 强制响应编码为 UTF-8，解决中文乱码
      if (ctx.body && typeof ctx.body === 'object') {
        ctx.set('Content-Type', 'application/json; charset=utf-8');
      }
    };
  }

  static getName(): string {
    return 'cors';
  }
}
