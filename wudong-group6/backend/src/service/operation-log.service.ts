import { Provide } from '@midwayjs/core';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { OperationLog } from '../entity/operation-log.entity';
@Provide() export class OperationLogService {
  @InjectEntityModel(OperationLog) model: Repository<OperationLog>;
  async log(operatorId:number,operatorName:string,action:string,target:string,detail?:string,ip?:string):Promise<OperationLog>{const l=new OperationLog();Object.assign(l,{operatorId,operatorName,action,target,detail,ip});return this.model.save(l);}
  async list(page=1,pageSize=20):Promise<{list:OperationLog[];total:number}>{const qb=this.model.createQueryBuilder('l').orderBy('l.created_at','DESC');const[l,t]=await qb.skip((page-1)*pageSize).take(pageSize).getManyAndCount();return{list:l,total:t};}
}
