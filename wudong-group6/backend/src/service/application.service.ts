import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { MerchantApplication } from '../entity/merchant-application.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class ApplicationService {
  @InjectEntityModel(MerchantApplication)
  applicationModel: Repository<MerchantApplication>;

  /**
   * 获取申请列表（分页）
   */
  async list(
    params: IPageParams & { keyword?: string; module?: string; status?: number }
  ): Promise<IPageResult<MerchantApplication>> {
    const { page = 1, pageSize = 10, keyword, module, status } = params;

    const qb = this.applicationModel
      .createQueryBuilder('a')
      .where('a.is_deleted = 0');

    if (keyword) {
      qb.andWhere('a.shop_name LIKE :keyword', { keyword: `%${keyword}%` });
    }
    if (module) {
      qb.andWhere('a.module = :module', { module });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('a.status = :status', { status });
    }

    qb.skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('a.created_at', 'DESC');

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 获取申请详情
   */
  async detail(id: number): Promise<MerchantApplication | null> {
    return this.applicationModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();
  }

  /**
   * 创建入驻申请
   */
  async create(data: Partial<MerchantApplication>): Promise<MerchantApplication> {
    const application = new MerchantApplication();
    Object.assign(application, data);
    return this.applicationModel.save(application);
  }

  /**
   * 更新申请
   */
  async update(id: number, data: Partial<MerchantApplication>): Promise<MerchantApplication | null> {
    const application = await this.applicationModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();

    if (!application) return null;
    Object.assign(application, data);
    return this.applicationModel.save(application);
  }

  /**
   * 软删除申请
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.applicationModel
      .createQueryBuilder()
      .update(MerchantApplication)
      .set({ isDeleted: 1 as any })
      .where('id = :id', { id })
      .andWhere('is_deleted = 0')
      .execute();

    return (result.affected ?? 0) > 0;
  }

  /**
   * 审核通过
   */
  async approve(id: number, reviewerId: number): Promise<MerchantApplication | null> {
    const application = await this.applicationModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();

    if (!application) return null;
    application.status = 1;
    application.reviewerId = reviewerId;
    application.reviewTime = new Date();
    return this.applicationModel.save(application);
  }

  /**
   * 审核驳回
   */
  async reject(id: number, reviewerId: number, reason: string): Promise<MerchantApplication | null> {
    const application = await this.applicationModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();

    if (!application) return null;
    application.status = 2;
    application.reviewerId = reviewerId;
    application.rejectReason = reason;
    application.reviewTime = new Date();
    return this.applicationModel.save(application);
  }
}
