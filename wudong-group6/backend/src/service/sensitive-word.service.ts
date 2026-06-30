import { Provide } from '@midwayjs/core';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { SensitiveWord } from '../entity/sensitive-word.entity';
@Provide() export class SensitiveWordService {
  @InjectEntityModel(SensitiveWord) model: Repository<SensitiveWord>;
  async list(): Promise<SensitiveWord[]> { return this.model.createQueryBuilder('s').where('s.is_deleted=0').getMany(); }
  async create(data:Partial<SensitiveWord>):Promise<SensitiveWord>{const w=new SensitiveWord();Object.assign(w,data);return this.model.save(w);}
  async remove(id:number):Promise<boolean>{const r=await this.model.createQueryBuilder().update(SensitiveWord).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0;}
}
