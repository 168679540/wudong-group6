import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Restaurant } from '../entity/restaurant.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class RestaurantService {
  @InjectEntityModel(Restaurant)
  model: Repository<Restaurant>;

  async list(params: IPageParams & { keyword?: string }): Promise<IPageResult<Restaurant>> {
    const { page = 1, pageSize = 10, keyword } = params;
    const qb = this.model.createQueryBuilder('r').where('r.is_deleted = 0').andWhere('r.status = 1');
    if (keyword) qb.andWhere('r.name LIKE :kw', { kw: `%${keyword}%` });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('r.rating', 'DESC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async detail(id: number): Promise<Restaurant | null> {
    return this.model.createQueryBuilder('r').where('r.id = :id', { id }).andWhere('r.is_deleted = 0').getOne();
  }
}
