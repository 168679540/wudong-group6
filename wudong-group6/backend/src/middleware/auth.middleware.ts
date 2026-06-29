import { Middleware, IMiddleware } from '@midwayjs/core';
import { NextFunction, Context } from '@midwayjs/koa';
import * as jwt from 'jsonwebtoken';
import { IJwtPayload } from '../interface';

/**
 * JWT 认证中间件
 * 对需要登录的接口进行 token 校验
 * 白名单路径无需验证
 */
const WHITE_LIST = [
  '/',
  '/api/admin/login',
  '/api/merchant/login',
  '/api/application/create',
  '/api/merchant-application/create',
  '/api/banner/active',
  '/api/dashboard/stats',
  '/api/dashboard/chart',
  '/api/community/note/list',
  '/api/community/note/detail',
  '/api/product/list',
  '/api/product/detail',
  '/api/restaurant/list',
  '/api/restaurant/detail',
  '/api/homestay/list',
  '/api/homestay/detail',
  '/api/ticket/list',
  '/api/ticket/detail',
  '/api/order/create',
  '/api/order/list',
  '/api/product-category/active',
  '/api/product-review/list',
  '/api/product-review/create',
  '/api/favorite/list',
  '/api/favorite/check',
  '/api/favorite/toggle',
  '/api/agro-product/list',
  '/api/agro-product/detail',
  '/api/meal-slot/list',
  '/api/agro-category/active',
  '/api/restaurant-review/list',
  '/api/restaurant-review/create',
  '/api/homestay-review/list',
  '/api/homestay-review/create',
  '/api/ticket-review/list',
  '/api/ticket-review/create',
  '/api/traffic-guide/list',
  '/api/traffic-guide/detail',
];

@Middleware()
export class AuthMiddleware implements IMiddleware<Context, NextFunction> {
  resolve() {
    return async (ctx: Context, next: NextFunction) => {
      // 白名单路径跳过验证
      if (WHITE_LIST.includes(ctx.path)) {
        return await next();
      }

      // 从请求头获取 token
      const token = ctx.get('Authorization')?.replace('Bearer ', '');

      if (!token) {
        ctx.status = 401;
        ctx.body = { success: false, message: '未登录，请先登录' };
        return;
      }

      try {
        // 验证 token
        const payload = jwt.verify(token, 'wudong-jwt-secret') as IJwtPayload;
        // 将用户信息挂载到 ctx 上
        (ctx as any).currentUser = payload;
        await next();
      } catch (err) {
        ctx.status = 401;
        ctx.body = { success: false, message: '登录已过期，请重新登录' };
        return;
      }
    };
  }

  static getName(): string {
    return 'auth';
  }
}
