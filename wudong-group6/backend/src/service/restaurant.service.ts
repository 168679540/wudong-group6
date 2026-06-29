import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entity/restaurant.entity';
import { IPageParams, IPageResult } from '../interface';
import { ProductReview } from '../entity/product-review.entity';

@Provide()
export class RestaurantService {
  @InjectEntityModel(Restaurant) model: Repository<Restaurant>;
  @InjectEntityModel(ProductReview) reviewModel: Repository<ProductReview>;

  async list(params: IPageParams & { keyword?: string }): Promise<IPageResult<Restaurant>> {
    const { page = 1, pageSize = 10, keyword } = params;
    const qb = this.model.createQueryBuilder('r').where('r.is_deleted = 0').andWhere('r.status = 1');
    if (keyword) qb.andWhere('r.name LIKE :kw', { kw: `%${keyword}%` });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('r.rating', 'DESC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async adminList(params: IPageParams & { keyword?: string; status?: number }): Promise<IPageResult<Restaurant>> {
    const { page = 1, pageSize = 10, keyword, status } = params;
    const qb = this.model.createQueryBuilder('r').where('r.is_deleted = 0');
    if (keyword) qb.andWhere('r.name LIKE :kw', { kw: `%${keyword}%` });
    if (status !== undefined && status !== null) qb.andWhere('r.status = :st', { st: status });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('r.created_at', 'DESC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async detail(id: number): Promise<Restaurant | null> { return this.model.createQueryBuilder('r').where('r.id = :id', { id }).andWhere('r.is_deleted = 0').getOne(); }
  async create(data: Partial<Restaurant>): Promise<Restaurant> { const r = new Restaurant(); Object.assign(r, data); return this.model.save(r); }
  async update(id: number, data: Partial<Restaurant>): Promise<Restaurant | null> { const r = await this.model.createQueryBuilder('r').where('r.id = :id', { id }).getOne(); if (!r) return null; Object.assign(r, data); return this.model.save(r); }
  async remove(id: number): Promise<boolean> { const r = await this.model.createQueryBuilder().update(Restaurant).set({ isDeleted: 1 as any }).where('id = :id', { id }).execute(); return (r.affected ?? 0) > 0; }
  async updateStatus(id: number, status: number): Promise<Restaurant | null> { const r = await this.model.createQueryBuilder('r').where('r.id = :id', { id }).getOne(); if (!r) return null; r.status = status; return this.model.save(r); }

  async stats(): Promise<{ totalBookings: number; totalRevenue: number; topRestaurants: any[] }> {
    const totalBookings = await this.model.createQueryBuilder('r').select('COUNT(*)','c').where('r.is_deleted=0').getRawOne();
    const top = await this.model.createQueryBuilder('r').select(['r.id','r.name','r.rating','r.avg_price']).where('r.is_deleted=0').andWhere('r.status=1').orderBy('r.rating','DESC').limit(5).getRawMany();
    return { totalBookings: Number(totalBookings?.c || 0), totalRevenue: 0, topRestaurants: top };
  }
}
