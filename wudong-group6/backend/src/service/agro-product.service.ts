import { Provide } from '@midwayjs/core'; import { InjectEntityModel } from '@midwayjs/typeorm'; import { Repository } from 'typeorm'; import { AgroProduct } from '../entity/agro-product.entity'; import { IPageParams, IPageResult } from '../interface';
@Provide() export class AgroProductService {
  @InjectEntityModel(AgroProduct) model: Repository<AgroProduct>;
  async list(params: IPageParams & { category?: string; keyword?: string }): Promise<IPageResult<AgroProduct>> {
    const { page=1, pageSize=10, category, keyword } = params; const qb = this.model.createQueryBuilder('a').where('a.is_deleted=0').andWhere('a.status=1');
    if (keyword) qb.andWhere('a.name LIKE :kw', { kw: `%${keyword}%` }); if (category) qb.andWhere('a.category = :cat', { cat: category });
    qb.skip((page-1)*pageSize).take(pageSize).orderBy('a.sales','DESC'); const [list, total] = await qb.getManyAndCount(); return { list, total, page, pageSize };
  }
  async adminList(params: IPageParams & { status?: number }): Promise<IPageResult<AgroProduct>> { const { page=1, pageSize=10, status } = params; const qb = this.model.createQueryBuilder('a').where('a.is_deleted=0'); if (status !== undefined && status !== null) qb.andWhere('a.status=:st',{st:status}); qb.skip((page-1)*pageSize).take(pageSize).orderBy('a.created_at','DESC'); const [list,total]=await qb.getManyAndCount(); return {list,total,page,pageSize}; }
  async detail(id:number):Promise<AgroProduct|null>{return this.model.createQueryBuilder('a').where('a.id=:id',{id}).andWhere('a.is_deleted=0').getOne();}
  async create(data:Partial<AgroProduct>):Promise<AgroProduct>{const a=new AgroProduct();Object.assign(a,data);return this.model.save(a);}
  async update(id:number,data:Partial<AgroProduct>):Promise<AgroProduct|null>{const a=await this.model.createQueryBuilder('a').where('a.id=:id',{id}).getOne();if(!a)return null;Object.assign(a,data);return this.model.save(a);}
  async remove(id:number):Promise<boolean>{const r=await this.model.createQueryBuilder().update(AgroProduct).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0;}
  async updateStatus(id:number,status:number):Promise<AgroProduct|null>{const a=await this.model.createQueryBuilder('a').where('a.id=:id',{id}).getOne();if(!a)return null;a.status=status;return this.model.save(a);}
}
