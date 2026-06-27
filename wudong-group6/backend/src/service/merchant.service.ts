import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Merchant } from '../entity/merchant.entity';
import { IPageParams, IPageResult, ILoginParams, IJwtPayload } from '../interface';

@Provide()
export class MerchantService {
  @InjectEntityModel(Merchant)
  merchantModel: Repository<Merchant>;

  /**
   * 商家登录
   */
  async login(params: ILoginParams): Promise<{ token: string; merchant: Merchant } | null> {
    const merchant = await this.merchantModel
      .createQueryBuilder('m')
      .where('m.username = :username', { username: params.username })
      .andWhere('m.is_deleted = 0')
      .andWhere('m.status = 1')
      .getOne();

    if (!merchant) return null;

    const valid = bcrypt.compareSync(params.password, merchant.password);
    if (!valid) return null;

    const payload: IJwtPayload = {
      id: merchant.id,
      username: merchant.username,
      type: 'merchant',
    };
    const token = jwt.sign(payload, 'wudong-jwt-secret', { expiresIn: '24h' });

    const { password, ...safeMerchant } = merchant;
    return { token, merchant: safeMerchant as Merchant };
  }

  /**
   * 获取商家列表（分页）
   */
  async list(
    params: IPageParams & { keyword?: string; module?: string; status?: number }
  ): Promise<IPageResult<Merchant>> {
    const { page = 1, pageSize = 10, keyword, module, status } = params;

    const qb = this.merchantModel
      .createQueryBuilder('m')
      .where('m.is_deleted = 0');

    if (keyword) {
      qb.andWhere('m.shop_name LIKE :keyword', { keyword: `%${keyword}%` });
    }
    if (module) {
      qb.andWhere('m.module = :module', { module });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('m.status = :status', { status });
    }

    qb.skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('m.created_at', 'DESC');

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 获取商家详情
   */
  async detail(id: number): Promise<Merchant | null> {
    return this.merchantModel
      .createQueryBuilder('m')
      .where('m.id = :id', { id })
      .andWhere('m.is_deleted = 0')
      .getOne();
  }

  /**
   * 创建商家
   */
  async create(data: Partial<Merchant>): Promise<Merchant> {
    const merchant = new Merchant();
    Object.assign(merchant, data);
    if (data.password) {
      merchant.password = bcrypt.hashSync(data.password, 10);
    }
    return this.merchantModel.save(merchant);
  }

  /**
   * 更新商家
   */
  async update(id: number, data: Partial<Merchant>): Promise<Merchant | null> {
    const merchant = await this.merchantModel
      .createQueryBuilder('m')
      .where('m.id = :id', { id })
      .andWhere('m.is_deleted = 0')
      .getOne();

    if (!merchant) return null;

    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }

    Object.assign(merchant, data);
    return this.merchantModel.save(merchant);
  }

  /**
   * 软删除商家
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.merchantModel
      .createQueryBuilder()
      .update(Merchant)
      .set({ isDeleted: 1 as any })
      .where('id = :id', { id })
      .andWhere('is_deleted = 0')
      .execute();

    return (result.affected ?? 0) > 0;
  }

  /**
   * 修改商家状态
   */
  async updateStatus(id: number, status: number): Promise<Merchant | null> {
    const merchant = await this.merchantModel
      .createQueryBuilder('m')
      .where('m.id = :id', { id })
      .andWhere('m.is_deleted = 0')
      .getOne();

    if (!merchant) return null;
    merchant.status = status;
    return this.merchantModel.save(merchant);
  }
}
