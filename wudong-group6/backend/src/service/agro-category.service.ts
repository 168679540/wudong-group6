import { Provide } from '@midwayjs/core'; import { InjectEntityModel } from '@midwayjs/typeorm'; import { Repository } from 'typeorm'; import { AgroCategory } from '../entity/agro-category.entity'; import { IPageParams, IPageResult } from '../interface';
@Provide() export class AgroCategoryService {
  @InjectEntityModel(AgroCategory) model: Repository<AgroCategory>;
  async list(params: IPageParams): Promise<IPageResult<AgroCategory>> { const { page=1, pageSize=50 } = params; const qb = this.model.createQueryBuilder('c').where('c.is_deleted=0'); qb.skip((page-1)*pageSize).take(pageSize).orderBy('c.sort_order','ASC'); const[l,t]=await qb.getManyAndCount(); return {list:l,total:t,page,pageSize}; }
  async activeList(): Promise<AgroCategory[]> { return this.model.createQueryBuilder('c').where('c.is_deleted=0').andWhere('c.status=1').orderBy('c.sort_order','ASC').getMany(); }
  async create(data:Partial<AgroCategory>):Promise<AgroCategory>{const c=new AgroCategory();Object.assign(c,data);return this.model.save(c);}
  async update(id:number,data:Partial<AgroCategory>):Promise<AgroCategory|null>{const c=await this.model.createQueryBuilder('c').where('c.id=:id',{id}).getOne();if(!c)return null;Object.assign(c,data);return this.model.save(c);}
  async remove(id:number):Promise<boolean>{const r=await this.model.createQueryBuilder().update(AgroCategory).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0;}
}
