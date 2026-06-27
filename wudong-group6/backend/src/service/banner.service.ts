import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { Banner } from '../entity/banner.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class BannerService {
  @InjectEntityModel(Banner)
  bannerModel: Repository<Banner>;

  /**
   * 获取轮播图列表（分页）
   */
  async list(
    params: IPageParams & { keyword?: string; position?: string; status?: number }
  ): Promise<IPageResult<Banner>> {
    const { page = 1, pageSize = 10, keyword, position, status } = params;

    const qb = this.bannerModel
      .createQueryBuilder('b')
      .where('b.is_deleted = 0');

    if (keyword) {
      qb.andWhere('b.title LIKE :keyword', { keyword: `%${keyword}%` });
    }
    if (position) {
      qb.andWhere('b.position = :position', { position });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('b.status = :status', { status });
    }

    qb.skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('b.sort_order', 'ASC')
      .addOrderBy('b.created_at', 'DESC');

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 获取启用的轮播图（前端展示用）
   */
  async getActiveList(position?: string): Promise<Banner[]> {
    const now = new Date();

    const qb = this.bannerModel
      .createQueryBuilder('b')
      .where('b.is_deleted = 0')
      .andWhere('b.status = 1');

    if (position) {
      qb.andWhere('b.position = :position', { position });
    }

    // 时间范围过滤：未设置时间 或 当前在有效期内
    qb.andWhere(
      new Brackets(qb2 => {
        qb2
          .where('b.start_time IS NULL AND b.end_time IS NULL')
          .orWhere('b.start_time <= :now AND b.end_time >= :now', { now })
          .orWhere('b.start_time <= :now1 AND b.end_time IS NULL', { now1: now })
          .orWhere('b.start_time IS NULL AND b.end_time >= :now2', { now2: now });
      })
    );

    qb.orderBy('b.sort_order', 'ASC').addOrderBy('b.created_at', 'DESC');

    return qb.getMany();
  }

  /**
   * 获取轮播图详情
   */
  async detail(id: number): Promise<Banner | null> {
    return this.bannerModel
      .createQueryBuilder('b')
      .where('b.id = :id', { id })
      .andWhere('b.is_deleted = 0')
      .getOne();
  }

  /**
   * 创建轮播图
   */
  async create(data: Partial<Banner>): Promise<Banner> {
    const banner = new Banner();
    Object.assign(banner, data);
    return this.bannerModel.save(banner);
  }

  /**
   * 更新轮播图
   */
  async update(id: number, data: Partial<Banner>): Promise<Banner | null> {
    const banner = await this.bannerModel
      .createQueryBuilder('b')
      .where('b.id = :id', { id })
      .andWhere('b.is_deleted = 0')
      .getOne();

    if (!banner) return null;
    Object.assign(banner, data);
    return this.bannerModel.save(banner);
  }

  /**
   * 软删除轮播图
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.bannerModel
      .createQueryBuilder()
      .update(Banner)
      .set({ isDeleted: 1 as any })
      .where('id = :id', { id })
      .andWhere('is_deleted = 0')
      .execute();

    return (result.affected ?? 0) > 0;
  }

  /**
   * 修改轮播图状态
   */
  async updateStatus(id: number, status: number): Promise<Banner | null> {
    const banner = await this.bannerModel
      .createQueryBuilder('b')
      .where('b.id = :id', { id })
      .andWhere('b.is_deleted = 0')
      .getOne();

    if (!banner) return null;
    banner.status = status;
    return this.bannerModel.save(banner);
  }
}
