import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Homestay } from '../entity/homestay.entity';
import { ProductReview } from '../entity/product-review.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class HomestayService {
  @InjectEntityModel(Homestay) model: Repository<Homestay>;
  @InjectEntityModel(ProductReview) reviewModel: Repository<ProductReview>;

  async list(params: IPageParams & { keyword?: string; minPrice?: number; maxPrice?: number; minRating?: number; amenity?: string }): Promise<IPageResult<Homestay>> {
    const { page = 1, pageSize = 10, keyword, minPrice, maxPrice, minRating, amenity } = params;
    const qb = this.model.createQueryBuilder('h').where('h.is_deleted = 0').andWhere('h.status = 1');
    if (keyword) qb.andWhere('h.name LIKE :kw', { kw: `%${keyword}%` });
    if (minPrice) qb.andWhere('h.price_per_night >= :minp', { minp: minPrice });
    if (maxPrice) qb.andWhere('h.price_per_night <= :maxp', { maxp: maxPrice });
    if (minRating && minRating > 0) qb.andWhere('h.rating >= :mr', { mr: minRating });
    if (amenity) qb.andWhere('h.amenities LIKE :am', { am: `%${amenity}%` });
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

  async stats(): Promise<{ totalRooms: number; avgPrice: number; topRated: any[]; totalBookings: number }> {
    const total = await this.model.createQueryBuilder('h').select('SUM(h.roomCount)','rooms').addSelect('AVG(h.pricePerNight)','avgp').where('h.is_deleted=0').andWhere('h.status=1').getRawOne();
    const top = await this.model.createQueryBuilder('h').select(['h.id','h.name','h.rating','h.price_per_night','h.roomCount']).where('h.is_deleted=0').andWhere('h.status=1').orderBy('h.rating','DESC').limit(5).getRawMany();
    return { totalRooms: Number(total?.rooms) || 0, avgPrice: Number(total?.avgp) || 0, topRated: top, totalBookings: 0 };
  }
}
