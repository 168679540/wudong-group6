import { Provide } from '@midwayjs/core';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { Report } from '../entity/report.entity';
@Provide() export class ReportService {
  @InjectEntityModel(Report) model: Repository<Report>;
  async adminList(page=1,pageSize=10):Promise<{list:Report[];total:number}>{const qb=this.model.createQueryBuilder('r').where('r.is_deleted=0');const[l,t]=await qb.skip((page-1)*pageSize).take(pageSize).orderBy('r.created_at','DESC').getManyAndCount();return{list:l,total:t};}
  async create(data:Partial<Report>):Promise<Report>{const r=new Report();Object.assign(r,data);return this.model.save(r);}
  async handle(id:number,handledBy:number,note:string):Promise<Report|null>{const r=await this.model.createQueryBuilder('r').where('r.id=:id',{id}).getOne();if(!r)return null;r.status=1;r.handledBy=handledBy;r.handleNote=note;return this.model.save(r);}
}
