import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelNote } from '../entity/travel-note.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class TravelNoteService {
  @InjectEntityModel(TravelNote)
  travelNoteModel: Repository<TravelNote>;

  /**
   * 游记列表（分页 + 审核筛选）
   */
  async list(
    params: IPageParams & { keyword?: string; status?: number; location?: string }
  ): Promise<IPageResult<TravelNote>> {
    const { page = 1, pageSize = 10, keyword, status, location } = params;

    const qb = this.travelNoteModel
      .createQueryBuilder('t')
      .where('t.is_deleted = 0');

    if (keyword) {
      qb.andWhere('t.title LIKE :keyword', { keyword: `%${keyword}%` });
    }
    if (location) {
      qb.andWhere('t.location LIKE :location', { location: `%${location}%` });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('t.status = :status', { status });
    }

    qb.skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('t.status', 'ASC')
      .addOrderBy('t.created_at', 'DESC');

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 游记详情
   */
  async detail(id: number): Promise<TravelNote | null> {
    return this.travelNoteModel
      .createQueryBuilder('t')
      .where('t.id = :id', { id })
      .andWhere('t.is_deleted = 0')
      .getOne();
  }

  /**
   * 审核通过
   */
  async approve(id: number, reviewerId: number): Promise<TravelNote | null> {
    const note = await this.travelNoteModel
      .createQueryBuilder('t')
      .where('t.id = :id', { id })
      .andWhere('t.is_deleted = 0')
      .getOne();

    if (!note) return null;
    note.status = 1;
    note.reviewerId = reviewerId;
    note.reviewTime = new Date();
    note.publishTime = new Date();
    return this.travelNoteModel.save(note);
  }

  /**
   * 审核驳回
   */
  async reject(id: number, reviewerId: number, reason: string): Promise<TravelNote | null> {
    const note = await this.travelNoteModel
      .createQueryBuilder('t')
      .where('t.id = :id', { id })
      .andWhere('t.is_deleted = 0')
      .getOne();

    if (!note) return null;
    note.status = 2;
    note.reviewerId = reviewerId;
    note.rejectReason = reason;
    note.reviewTime = new Date();
    return this.travelNoteModel.save(note);
  }

  /**
   * 下架
   */
  async takeDown(id: number): Promise<TravelNote | null> {
    const note = await this.travelNoteModel
      .createQueryBuilder('t')
      .where('t.id = :id', { id })
      .andWhere('t.is_deleted = 0')
      .getOne();

    if (!note) return null;
    note.status = 3;
    return this.travelNoteModel.save(note);
  }

  /**
   * 软删除
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.travelNoteModel
      .createQueryBuilder()
      .update(TravelNote)
      .set({ isDeleted: 1 as any })
      .where('id = :id', { id })
      .andWhere('is_deleted = 0')
      .execute();

    return (result.affected ?? 0) > 0;
  }
}
