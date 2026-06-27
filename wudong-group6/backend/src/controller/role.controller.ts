import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { RoleService } from '../service/role.service';

@Controller('/api/role')
export class RoleController {
  @Inject()
  ctx: Context;

  @Inject()
  roleService: RoleService;

  /**
   * 角色列表（分页）
   */
  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('status') status: number) {
    const result = await this.roleService.list({ page, pageSize, keyword, status });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  /**
   * 所有启用角色
   */
  @Get('/all')
  async all() {
    const list = await this.roleService.getAll();
    return { success: true, message: 'OK', data: list };
  }

  /**
   * 角色详情
   */
  @Get('/detail')
  async detail(@Query('id') id: number) {
    const role = await this.roleService.detail(id);
    if (!role) {
      return { success: false, message: '角色不存在' };
    }
    return { success: true, message: 'OK', data: role };
  }

  /**
   * 创建角色
   */
  @Post('/create')
  async create(@Body() body: any) {
    const role = await this.roleService.create(body);
    return { success: true, message: '创建成功', data: role };
  }

  /**
   * 更新角色
   */
  @Put('/update')
  async update(@Body() body: any) {
    const { id, ...data } = body;
    const role = await this.roleService.update(id, data);
    if (!role) {
      return { success: false, message: '角色不存在' };
    }
    return { success: true, message: '更新成功', data: role };
  }

  /**
   * 删除角色（软删除）
   */
  @Del('/delete')
  async delete(@Query('id') id: number) {
    const result = await this.roleService.remove(id);
    if (!result) {
      return { success: false, message: '角色不存在' };
    }
    return { success: true, message: '删除成功' };
  }
}
