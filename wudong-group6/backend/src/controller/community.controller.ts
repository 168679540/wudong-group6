import { Inject, Controller, Get, Query } from '@midwayjs/core';
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
}
