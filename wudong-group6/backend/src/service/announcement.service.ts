import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../entity/announcement.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class AnnouncementService {
  @InjectEntityModel(Announcement)
  announcementModel: Repository<Announcement>;

  /**
   * 获取公告列表（分页）
   */
  async list(
    params: IPageParams & { keyword?: string; type?: string; status?: number }
  ): Promise<IPageResult<Announcement>> {
    const { page = 1, pageSize = 10, keyword, type, status } = params;

    const qb = this.announcementModel
      .createQueryBuilder('a')
      .where('a.is_deleted = 0');

    if (keyword) {
      qb.andWhere('a.title LIKE :keyword', { keyword: `%${keyword}%` });
    }
    if (type) {
      qb.andWhere('a.type = :type', { type });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('a.status = :status', { status });
    }

    qb.skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('a.is_top', 'DESC')
      .addOrderBy('a.publish_time', 'DESC')
      .addOrderBy('a.created_at', 'DESC');

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 获取公告详情
   */
  async detail(id: number): Promise<Announcement | null> {
    return this.announcementModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();
  }

  /**
   * 创建公告
   */
  async create(data: Partial<Announcement>): Promise<Announcement> {
    const announcement = new Announcement();
    Object.assign(announcement, data);
    return this.announcementModel.save(announcement);
  }

  /**
   * 更新公告
   */
  async update(id: number, data: Partial<Announcement>): Promise<Announcement | null> {
    const announcement = await this.announcementModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();

    if (!announcement) return null;
    Object.assign(announcement, data);
    return this.announcementModel.save(announcement);
  }

  /**
   * 软删除公告
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.announcementModel
      .createQueryBuilder()
      .update(Announcement)
      .set({ isDeleted: 1 as any })
      .where('id = :id', { id })
      .andWhere('is_deleted = 0')
      .execute();

    return (result.affected ?? 0) > 0;
  }

  /**
   * 发布公告
   */
  async publish(id: number): Promise<Announcement | null> {
    const announcement = await this.announcementModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();

    if (!announcement) return null;
    announcement.status = 1;
    announcement.publishTime = new Date();
    return this.announcementModel.save(announcement);
  }

  /**
   * 置顶/取消置顶
   */
  async toggleTop(id: number): Promise<Announcement | null> {
    const announcement = await this.announcementModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();

    if (!announcement) return null;
    announcement.isTop = announcement.isTop === 1 ? 0 : 1;
    return this.announcementModel.save(announcement);
  }
}
