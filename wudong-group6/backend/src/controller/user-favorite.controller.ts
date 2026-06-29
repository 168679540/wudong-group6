import { Inject, Controller, Get, Post, Query, Body } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserFavoriteService } from '../service/user-favorite.service';

@Controller('/api/favorite')
export class UserFavoriteController {
  @Inject() ctx: Context;
  @Inject() service: UserFavoriteService;

  @Get('/list')
  async list(@Query('userId') userId: number, @Query('type') type: string) {
    const list = await this.service.list(userId || 1, type || 'product');
    return { success: true, data: list };
  }

  @Get('/check')
  async check(@Query('userId') userId: number, @Query('type') type: string, @Query('targetId') targetId: number) {
    const favorited = await this.service.isFavorited(userId || 1, type || 'product', targetId);
    return { success: true, data: { favorited } };
  }

  @Post('/toggle')
  async toggle(@Body() body: { userId?: number; type: string; targetId: number }) {
    const result = await this.service.toggle(body.userId || 1, body.type || 'product', body.targetId);
    return { success: true, message: result.favorited ? '已收藏' : '已取消收藏', data: result };
  }
}
