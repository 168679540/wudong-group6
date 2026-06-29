import { Provide } from '@midwayjs/core';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { TrafficGuide } from '../entity/traffic-guide.entity';import { IPageParams, IPageResult } from '../interface';
@Provide() export class TrafficGuideService {
  @InjectEntityModel(TrafficGuide) model: Repository<TrafficGuide>;
  async list(params:IPageParams & {keyword?:string}):Promise<IPageResult<TrafficGuide>>{const{page=1,pageSize=10,keyword}=params;const qb=this.model.createQueryBuilder('g').where('g.is_deleted=0').andWhere('g.status=1');if(keyword)qb.andWhere('g.title LIKE :kw',{kw:`%${keyword}%`});qb.skip((page-1)*pageSize).take(pageSize).orderBy('g.view_count','DESC').addOrderBy('g.created_at','DESC');const[l,t]=await qb.getManyAndCount();return{list:l,total:t,page,pageSize};}
  async adminList(params:IPageParams & {status?:number}):Promise<IPageResult<TrafficGuide>>{const{page=1,pageSize=10,status}=params;const qb=this.model.createQueryBuilder('g').where('g.is_deleted=0');if(status!==undefined&&status!==null)qb.andWhere('g.status=:st',{st:status});qb.skip((page-1)*pageSize).take(pageSize).orderBy('g.created_at','DESC');const[l,t]=await qb.getManyAndCount();return{list:l,total:t,page,pageSize};}
  async detail(id:number):Promise<TrafficGuide|null>{return this.model.createQueryBuilder('g').where('g.id=:id',{id}).getOne();}
  async create(data:Partial<TrafficGuide>):Promise<TrafficGuide>{const g=new TrafficGuide();Object.assign(g,data);return this.model.save(g);}
  async update(id:number,data:Partial<TrafficGuide>):Promise<TrafficGuide|null>{const g=await this.model.createQueryBuilder('g').where('g.id=:id',{id}).getOne();if(!g)return null;Object.assign(g,data);return this.model.save(g);}
  async remove(id:number):Promise<boolean>{const r=await this.model.createQueryBuilder().update(TrafficGuide).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0;}
}
