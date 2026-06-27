import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { AdminService } from '../service/admin.service';

@Controller('/api/admin')
export class AdminController {
  @Inject()
  ctx: Context;

  @Inject()
  adminService: AdminService;

  /**
   * 管理员登录
   */
  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    if (!username || !password) {
      return { success: false, message: '用户名和密码不能为空' };
    }
    const result = await this.adminService.login({ username, password });
    if (!result) {
      return { success: false, message: '用户名或密码错误' };
    }
    return { success: true, message: '登录成功', data: result };
  }

  /**
   * 管理员列表（分页）
   */
  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('roleId') roleId: number, @Query('status') status: number) {
    const result = await this.adminService.list({ page, pageSize, keyword, roleId, status });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  /**
   * 管理员详情
   */
  @Get('/detail')
  async detail(@Query('id') id: number) {
    const admin = await this.adminService.detail(id);
    if (!admin) {
      return { success: false, message: '管理员不存在' };
    }
    return { success: true, message: 'OK', data: admin };
  }

  /**
   * 创建管理员
   */
  @Post('/create')
  async create(@Body() body: any) {
    const admin = await this.adminService.create(body);
    return { success: true, message: '创建成功', data: admin };
  }

  /**
   * 更新管理员
   */
  @Put('/update')
  async update(@Body() body: any) {
    const { id, ...data } = body;
    const admin = await this.adminService.update(id, data);
    if (!admin) {
      return { success: false, message: '管理员不存在' };
    }
    return { success: true, message: '更新成功', data: admin };
  }

  /**
   * 删除管理员（软删除）
   */
  @Del('/delete')
  async delete(@Query('id') id: number) {
    const result = await this.adminService.remove(id);
    if (!result) {
      return { success: false, message: '管理员不存在' };
    }
    return { success: true, message: '删除成功' };
  }

  /**
   * 修改管理员状态
   */
  @Put('/status')
  async updateStatus(@Body() body: { id: number; status: number }) {
    const { id, status } = body;
    const admin = await this.adminService.updateStatus(id, status);
    if (!admin) {
      return { success: false, message: '管理员不存在' };
    }
    return { success: true, message: '状态更新成功', data: admin };
  }

  /**
   * 获取角色列表（供创建管理员时选择角色）
   */
  @Get('/roles')
  async getRoles() {
    const list = await this.adminService.getRoleList();
    return { success: true, message: 'OK', data: list };
  }
}
