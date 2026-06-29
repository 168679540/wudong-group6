import { Provide } from '@midwayjs/core';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { Ticket } from '../entity/ticket.entity';import { ProductReview } from '../entity/product-review.entity';import { IPageParams, IPageResult } from '../interface';
@Provide() export class TicketService {
  @InjectEntityModel(Ticket) model: Repository<Ticket>;
  @InjectEntityModel(ProductReview) reviewModel: Repository<ProductReview>;
  async list(params: IPageParams & { keyword?: string; type?: string; minPrice?: number; maxPrice?: number; minRating?: number }): Promise<IPageResult<Ticket>> {
    const { page=1, pageSize=10, keyword, type, minPrice, maxPrice, minRating } = params;
    const qb = this.model.createQueryBuilder('t').where('t.is_deleted=0').andWhere('t.status=1');
    if (keyword) qb.andWhere('t.name LIKE :kw',{kw:`%${keyword}%`}); if (type) qb.andWhere('t.type=:tp',{tp:type});
    if (minPrice) qb.andWhere('t.price>=:minp',{minp:minPrice}); if (maxPrice) qb.andWhere('t.price<=:maxp',{maxp:maxPrice});
    if (minRating && minRating > 0) qb.andWhere('t.rating>=:mr',{mr:minRating});
    qb.skip((page-1)*pageSize).take(pageSize).orderBy('t.price','ASC');
    const [list, total] = await qb.getManyAndCount(); return { list, total, page, pageSize };
  }
  async adminList(params: IPageParams & { keyword?: string; type?: string; status?: number }): Promise<IPageResult<Ticket>> {
    const { page=1, pageSize=10, keyword, type, status } = params;
    const qb = this.model.createQueryBuilder('t').where('t.is_deleted=0');
    if (keyword) qb.andWhere('t.name LIKE :kw',{kw:`%${keyword}%`}); if (type) qb.andWhere('t.type=:tp',{tp:type});
    if (status!==undefined&&status!==null) qb.andWhere('t.status=:st',{st:status});
    qb.skip((page-1)*pageSize).take(pageSize).orderBy('t.created_at','DESC');
    const [list, total] = await qb.getManyAndCount(); return { list, total, page, pageSize };
  }
  async detail(id:number):Promise<Ticket|null>{return this.model.createQueryBuilder('t').where('t.id=:id',{id}).getOne();}
  async create(data:Partial<Ticket>):Promise<Ticket>{const t=new Ticket();Object.assign(t,data);return this.model.save(t);}
  async update(id:number,data:Partial<Ticket>):Promise<Ticket|null>{const t=await this.model.createQueryBuilder('t').where('t.id=:id',{id}).getOne();if(!t)return null;Object.assign(t,data);return this.model.save(t);}
  async remove(id:number):Promise<boolean>{const r=await this.model.createQueryBuilder().update(Ticket).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0;}
  async updateStatus(id:number,status:number):Promise<Ticket|null>{const t=await this.model.createQueryBuilder('t').where('t.id=:id',{id}).getOne();if(!t)return null;t.status=status;return this.model.save(t);}
  async stats():Promise<{totalStock:number;avgPrice:number;topRated:any[];totalSold:number}>{
    const r=await this.model.createQueryBuilder('t').select('SUM(t.stock)','stock').addSelect('AVG(t.price)','avgp').where('t.is_deleted=0').getRawOne();
    const top=await this.model.createQueryBuilder('t').select(['t.id','t.name','t.rating','t.type']).where('t.is_deleted=0').andWhere('t.status=1').orderBy('t.rating','DESC').limit(5).getRawMany();
    return {totalStock:Number(r?.stock)||0,avgPrice:Number(r?.avgp)||0,topRated:top,totalSold:0};
  }
}
