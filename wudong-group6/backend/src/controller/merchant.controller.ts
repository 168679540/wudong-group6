import { Inject, Controller, Get, Post, Put, Del, Body, Query } from '@midwayjs/core';
import { Context } from '@midwayjs/koa';
import { MerchantService } from '../service/merchant.service';

@Controller('/api/merchant')
export class MerchantController {
  @Inject()
  ctx: Context;

  @Inject()
  merchantService: MerchantService;

  /**
   * 商家登录
   */
  @Post('/login')
  async login(@Body() body: { username: string; password: string }) {
    const { username, password } = body;
    if (!username || !password) {
      return { success: false, message: '用户名和密码不能为空' };
    }
    const result = await this.merchantService.login({ username, password });
    if (!result) {
      return { success: false, message: '用户名或密码错误' };
    }
    return { success: true, message: '登录成功', data: result };
  }

  /**
   * 商家列表（分页）
   */
  @Get('/list')
  async list(@Query('page') page: number, @Query('pageSize') pageSize: number, @Query('keyword') keyword: string, @Query('module') module: string, @Query('status') status: number) {
    const result = await this.merchantService.list({ page, pageSize, keyword, module, status });
    return { success: true, message: 'OK', data: result.list, total: result.total };
  }

  /**
   * 商家详情
   */
  @Get('/detail')
  async detail(@Query('id') id: number) {
    const merchant = await this.merchantService.detail(id);
    if (!merchant) {
      return { success: false, message: '商家不存在' };
    }
    return { success: true, message: 'OK', data: merchant };
  }

  /**
   * 创建商家
   */
  @Post('/create')
  async create(@Body() body: any) {
    const merchant = await this.merchantService.create(body);
    return { success: true, message: '创建成功', data: merchant };
  }

  /**
   * 更新商家
   */
  @Put('/update')
  async update(@Body() body: any) {
    const { id, ...data } = body;
    const merchant = await this.merchantService.update(id, data);
    if (!merchant) {
      return { success: false, message: '商家不存在' };
    }
    return { success: true, message: '更新成功', data: merchant };
  }

  /**
   * 删除商家（软删除）
   */
  @Del('/delete')
  async delete(@Query('id') id: number) {
    const result = await this.merchantService.remove(id);
    if (!result) {
      return { success: false, message: '商家不存在' };
    }
    return { success: true, message: '删除成功' };
  }

  /**
   * 修改商家状态
   */
  @Put('/status')
  async updateStatus(@Body() body: { id: number; status: number }) {
    const { id, status } = body;
    const merchant = await this.merchantService.updateStatus(id, status);
    if (!merchant) {
      return { success: false, message: '商家不存在' };
    }
    return { success: true, message: '状态更新成功', data: merchant };
  }
}
