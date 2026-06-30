import { Provide } from '@midwayjs/core';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { RecommendedContent } from '../entity/recommend.entity';
@Provide() export class RecommendService {
  @InjectEntityModel(RecommendedContent) model: Repository<RecommendedContent>;
  async list(): Promise<RecommendedContent[]> { return this.model.createQueryBuilder('r').where('r.is_deleted=0').orderBy('r.sort_order','ASC').getMany(); }
  async activeList(): Promise<RecommendedContent[]> { return this.model.createQueryBuilder('r').where('r.is_deleted=0').andWhere('r.status=1').orderBy('r.sort_order','ASC').getMany(); }
  async create(data:Partial<RecommendedContent>):Promise<RecommendedContent>{const r=new RecommendedContent();Object.assign(r,data);return this.model.save(r);}
  async update(id:number,data:Partial<RecommendedContent>):Promise<RecommendedContent|null>{const r=await this.model.createQueryBuilder('r').where('r.id=:id',{id}).getOne();if(!r)return null;Object.assign(r,data);return this.model.save(r);}
  async remove(id:number):Promise<boolean>{const r=await this.model.createQueryBuilder().update(RecommendedContent).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0;}
}
