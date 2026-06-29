import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from '../entity/product-category.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class ProductCategoryService {
  @InjectEntityModel(ProductCategory)
  model: Repository<ProductCategory>;

  async list(params: IPageParams & { status?: number }): Promise<IPageResult<ProductCategory>> {
    const { page = 1, pageSize = 50, status } = params;
    const qb = this.model.createQueryBuilder('c').where('c.is_deleted = 0');
    if (status !== undefined && status !== null) qb.andWhere('c.status = :st', { st: status });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('c.sort_order', 'ASC').addOrderBy('c.created_at', 'DESC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async activeList(): Promise<ProductCategory[]> {
    return this.model.createQueryBuilder('c').where('c.is_deleted = 0').andWhere('c.status = 1').orderBy('c.sort_order', 'ASC').getMany();
  }

  async create(data: Partial<ProductCategory>): Promise<ProductCategory> { const c = new ProductCategory(); Object.assign(c, data); return this.model.save(c); }
  async update(id: number, data: Partial<ProductCategory>): Promise<ProductCategory | null> { const c = await this.model.createQueryBuilder('c').where('c.id = :id', { id }).getOne(); if (!c) return null; Object.assign(c, data); return this.model.save(c); }
  async remove(id: number): Promise<boolean> { const r = await this.model.createQueryBuilder().update(ProductCategory).set({ isDeleted: 1 as any }).where('id = :id', { id }).execute(); return (r.affected ?? 0) > 0; }
}
