import { Provide } from '@midwayjs/core';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { Topic } from '../entity/topic.entity';
@Provide() export class TopicService {
  @InjectEntityModel(Topic) model: Repository<Topic>;
  async activeList(): Promise<Topic[]> { return this.model.createQueryBuilder('t').where('t.is_deleted=0').andWhere('t.status=1').orderBy('t.follow_count','DESC').getMany(); }
  async adminList(): Promise<Topic[]> { return this.model.createQueryBuilder('t').where('t.is_deleted=0').orderBy('t.follow_count','DESC').getMany(); }
  async create(data:Partial<Topic>):Promise<Topic>{const t=new Topic();Object.assign(t,data);return this.model.save(t);}
  async update(id:number,data:Partial<Topic>):Promise<Topic|null>{const t=await this.model.createQueryBuilder('t').where('t.id=:id',{id}).getOne();if(!t)return null;Object.assign(t,data);return this.model.save(t);}
  async remove(id:number):Promise<boolean>{const r=await this.model.createQueryBuilder().update(Topic).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0;}
}
