import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class ProductService {
  @InjectEntityModel(Product)
  model: Repository<Product>;

  async list(params: IPageParams & { keyword?: string; category?: string; minPrice?: number; maxPrice?: number; sort?: string }): Promise<IPageResult<Product>> {
    const { page = 1, pageSize = 10, keyword, category, minPrice, maxPrice, sort } = params;
    const qb = this.model.createQueryBuilder('p').where('p.is_deleted = 0').andWhere('p.status = 1');
    if (keyword) qb.andWhere('p.name LIKE :kw', { kw: `%${keyword}%` });
    if (category) qb.andWhere('p.category = :cat', { cat: category });
    if (minPrice !== undefined && minPrice !== null) qb.andWhere('p.price >= :minp', { minp: minPrice });
    if (maxPrice !== undefined && maxPrice !== null) qb.andWhere('p.price <= :maxp', { maxp: maxPrice });
    if (sort === 'price_asc') qb.orderBy('p.price', 'ASC');
    else if (sort === 'price_desc') qb.orderBy('p.price', 'DESC');
    else if (sort === 'sales') qb.orderBy('p.sales', 'DESC');
    else { qb.orderBy('p.sales', 'DESC').addOrderBy('p.created_at', 'DESC'); }
    qb.skip((page - 1) * pageSize).take(pageSize);
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async batchCreate(items: Partial<Product>[]): Promise<number> {
    let count = 0;
    for (const item of items) {
      const p = new Product(); Object.assign(p, item); await this.model.save(p); count++;
    }
    return count;
  }

  /** 管理后台：全量列表（含下架） */
  async adminList(params: IPageParams & { keyword?: string; category?: string; status?: number }): Promise<IPageResult<Product>> {
    const { page = 1, pageSize = 10, keyword, category, status } = params;
    const qb = this.model.createQueryBuilder('p').where('p.is_deleted = 0');
    if (keyword) qb.andWhere('p.name LIKE :kw', { kw: `%${keyword}%` });
    if (category) qb.andWhere('p.category = :cat', { cat: category });
    if (status !== undefined && status !== null) qb.andWhere('p.status = :st', { st: status });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('p.created_at', 'DESC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async detail(id: number): Promise<Product | null> {
    return this.model.createQueryBuilder('p').where('p.id = :id', { id }).andWhere('p.is_deleted = 0').getOne();
  }

  async create(data: Partial<Product>): Promise<Product> {
    const p = new Product();
    Object.assign(p, data);
    return this.model.save(p);
  }

  async update(id: number, data: Partial<Product>): Promise<Product | null> {
    const p = await this.model.createQueryBuilder('p').where('p.id = :id', { id }).andWhere('p.is_deleted = 0').getOne();
    if (!p) return null;
    Object.assign(p, data);
    return this.model.save(p);
  }

  async remove(id: number): Promise<boolean> {
    const r = await this.model.createQueryBuilder().update(Product).set({ isDeleted: 1 as any }).where('id = :id', { id }).andWhere('is_deleted = 0').execute();
    return (r.affected ?? 0) > 0;
  }

  async updateStatus(id: number, status: number): Promise<Product | null> {
    const p = await this.model.createQueryBuilder('p').where('p.id = :id', { id }).andWhere('p.is_deleted = 0').getOne();
    if (!p) return null;
    p.status = status;
    return this.model.save(p);
  }

  async stats(): Promise<{ hotTop: Product[]; lowStock: Product[]; totalSold: number }> {
    const hotTop = await this.model.createQueryBuilder('p')
      .where('p.is_deleted = 0').andWhere('p.status = 1')
      .orderBy('p.sales', 'DESC').limit(10).getMany();
    const lowStock = await this.model.createQueryBuilder('p')
      .where('p.is_deleted = 0').andWhere('p.status = 1').andWhere('p.stock < 10').andWhere('p.stock > 0')
      .orderBy('p.stock', 'ASC').getMany();
    const totalResult = await this.model.createQueryBuilder('p')
      .select('COALESCE(SUM(p.sales), 0)', 'total').where('p.is_deleted = 0').getRawOne();
    return { hotTop, lowStock, totalSold: Number(totalResult?.total || 0) };
  }
}
