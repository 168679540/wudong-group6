import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Homestay } from '../entity/homestay.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class HomestayService {
  @InjectEntityModel(Homestay) model: Repository<Homestay>;

  async list(params: IPageParams & { keyword?: string }): Promise<IPageResult<Homestay>> {
    const { page = 1, pageSize = 10, keyword } = params;
    const qb = this.model.createQueryBuilder('h').where('h.is_deleted = 0').andWhere('h.status = 1');
    if (keyword) qb.andWhere('h.name LIKE :kw', { kw: `%${keyword}%` });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('h.price_per_night', 'ASC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async adminList(params: IPageParams & { keyword?: string; status?: number }): Promise<IPageResult<Homestay>> {
    const { page = 1, pageSize = 10, keyword, status } = params;
    const qb = this.model.createQueryBuilder('h').where('h.is_deleted = 0');
    if (keyword) qb.andWhere('h.name LIKE :kw', { kw: `%${keyword}%` });
    if (status !== undefined && status !== null) qb.andWhere('h.status = :st', { st: status });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('h.created_at', 'DESC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async detail(id: number): Promise<Homestay | null> { return this.model.createQueryBuilder('h').where('h.id = :id', { id }).andWhere('h.is_deleted = 0').getOne(); }
  async create(data: Partial<Homestay>): Promise<Homestay> { const h = new Homestay(); Object.assign(h, data); return this.model.save(h); }
  async update(id: number, data: Partial<Homestay>): Promise<Homestay | null> { const h = await this.model.createQueryBuilder('h').where('h.id = :id', { id }).getOne(); if (!h) return null; Object.assign(h, data); return this.model.save(h); }
  async remove(id: number): Promise<boolean> { const r = await this.model.createQueryBuilder().update(Homestay).set({ isDeleted: 1 as any }).where('id = :id', { id }).execute(); return (r.affected ?? 0) > 0; }
  async updateStatus(id: number, status: number): Promise<Homestay | null> { const h = await this.model.createQueryBuilder('h').where('h.id = :id', { id }).getOne(); if (!h) return null; h.status = status; return this.model.save(h); }
}
