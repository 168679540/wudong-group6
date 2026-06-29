import { Provide } from '@midwayjs/core';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { SystemMessage } from '../entity/system-message.entity';
@Provide() export class MessageService {
  @InjectEntityModel(SystemMessage) model: Repository<SystemMessage>;
  async list(userId:number,page=1,pageSize=20):Promise<{list:SystemMessage[];total:number}>{const qb=this.model.createQueryBuilder('m').where('m.is_deleted=0').andWhere('m.user_id=:uid',{uid:userId||0}).orWhere('m.user_id=0');const[l,t]=await qb.skip((page-1)*pageSize).take(pageSize).orderBy('m.created_at','DESC').getManyAndCount();return{list:l,total:t};}
  async adminList(page=1,pageSize=20):Promise<{list:SystemMessage[];total:number}>{const qb=this.model.createQueryBuilder('m').where('m.is_deleted=0');const[l,t]=await qb.skip((page-1)*pageSize).take(pageSize).orderBy('m.created_at','DESC').getManyAndCount();return{list:l,total:t};}
  async create(data:Partial<SystemMessage>):Promise<SystemMessage>{const m=new SystemMessage();Object.assign(m,data);return this.model.save(m);}
  async remove(id:number):Promise<boolean>{const r=await this.model.createQueryBuilder().update(SystemMessage).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0;}
}
