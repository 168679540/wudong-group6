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

  async detail(id: number): Promise<Product | null> {
    return this.model.createQueryBuilder('p').where('p.id = :id', { id }).andWhere('p.is_deleted = 0').getOne();
  }
}
