import { Inject, Controller, Get, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { UserAdminService } from '../service/user-admin.service';

@Controller('/api/user')
export class UserAdminController {
  @Inject()
  ctx: Context;

  @Inject()
  userAdminService: UserAdminService;

  @Get('/list')
  async list(
    @Query('page') page: number,
    @Query('pageSize') pageSize: number,
    @Query('keyword') keyword: string,
    @Query('status') status: number,
  ) {
    const result = await this.userAdminService.list({ page, pageSize, keyword, status });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  @Get('/detail')
  async detail(@Query('id') id: number) {
    const user = await this.userAdminService.detail(id);
    if (!user) return { success: false, message: '用户不存在' };
    return { success: true, data: user };
  }

  @Put('/status')
  async updateStatus(@Body() body: { id: number; status: number }) {
    const user = await this.userAdminService.updateStatus(body.id, body.status);
    if (!user) return { success: false, message: '用户不存在' };
    return { success: true, message: '状态更新成功' };
  }

  @Del('/delete')
  async delete(@Query('id') id: number) {
    const ok = await this.userAdminService.remove(id);
    return ok
      ? { success: true, message: '删除成功' }
      : { success: false, message: '用户不存在' };
  }
}
