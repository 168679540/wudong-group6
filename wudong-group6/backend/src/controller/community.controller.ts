import { Inject, Controller, Get, Post, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { CommunityService } from '../service/community.service';

@Controller('/api/community')
export class CommunityController {
  @Inject() ctx: Context;
  @Inject() communityService: CommunityService;

  @Get('/note/list')
  async noteList(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('location') location: string) {
    const r = await this.communityService.noteList({ page, pageSize, keyword, location });
    return { success: true, data: r.list, total: r.total };
  }

  @Get('/note/detail')
  async noteDetail(@Query('id') id: number) {
    const note = await this.communityService.noteDetail(id);
    if (!note) return { success: false, message: '游记不存在' };
    const comments = await this.communityService.getComments(id);
    return { success: true, data: { note, comments } };
  }

  @Post('/note/comment')
  async addComment(@Body() body: { travelNoteId: number; content: string; userId?: number }) {
    const c = await this.communityService.addComment(body.travelNoteId, body.content, body.userId || 1);
    return { success: true, message: '评论成功', data: c };
  }

  @Get('/stats')
  async stats() { const data = await this.communityService.stats(); return { success: true, data }; }
}
