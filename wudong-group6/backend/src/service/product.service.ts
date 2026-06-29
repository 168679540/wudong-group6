import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class ProductService {
  @InjectEntityModel(Product)
  model: Repository<Product>;

  async list(params: IPageParams & { keyword?: string; category?: string }): Promise<IPageResult<Product>> {
    const { page = 1, pageSize = 10, keyword, category } = params;
    const qb = this.model.createQueryBuilder('p').where('p.is_deleted = 0').andWhere('p.status = 1');
    if (keyword) qb.andWhere('p.name LIKE :kw', { kw: `%${keyword}%` });
    if (category) qb.andWhere('p.category = :cat', { cat: category });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('p.sales', 'DESC').addOrderBy('p.created_at', 'DESC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
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
}
