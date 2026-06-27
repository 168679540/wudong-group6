import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Homestay } from '../entity/homestay.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class HomestayService {
  @InjectEntityModel(Homestay)
  model: Repository<Homestay>;

  async list(params: IPageParams & { keyword?: string }): Promise<IPageResult<Homestay>> {
    const { page = 1, pageSize = 10, keyword } = params;
    const qb = this.model.createQueryBuilder('h').where('h.is_deleted = 0').andWhere('h.status = 1');
    if (keyword) qb.andWhere('h.name LIKE :kw', { kw: `%${keyword}%` });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('h.price_per_night', 'ASC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async detail(id: number): Promise<Homestay | null> {
    return this.model.createQueryBuilder('h').where('h.id = :id', { id }).andWhere('h.is_deleted = 0').getOne();
  }
}
