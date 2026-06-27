import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Ticket } from '../entity/ticket.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class TicketService {
  @InjectEntityModel(Ticket)
  model: Repository<Ticket>;

  async list(params: IPageParams & { keyword?: string; type?: string }): Promise<IPageResult<Ticket>> {
    const { page = 1, pageSize = 10, keyword, type } = params;
    const qb = this.model.createQueryBuilder('t').where('t.is_deleted = 0').andWhere('t.status = 1');
    if (keyword) qb.andWhere('t.name LIKE :kw', { kw: `%${keyword}%` });
    if (type) qb.andWhere('t.type = :type', { type });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('t.price', 'ASC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async detail(id: number): Promise<Ticket | null> {
    return this.model.createQueryBuilder('t').where('t.id = :id', { id }).andWhere('t.is_deleted = 0').getOne();
  }
}
