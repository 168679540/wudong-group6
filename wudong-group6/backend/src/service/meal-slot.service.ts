import { Provide } from '@midwayjs/core'; import { InjectEntityModel } from '@midwayjs/typeorm'; import { Repository } from 'typeorm'; import { MealSlot } from '../entity/meal-slot.entity';
@Provide() export class MealSlotService {
  @InjectEntityModel(MealSlot) model: Repository<MealSlot>;
  async listByRestaurant(restaurantId: number): Promise<MealSlot[]> { return this.model.createQueryBuilder('s').where('s.restaurant_id=:rid',{rid:restaurantId}).andWhere('s.is_deleted=0').andWhere('s.status=1').orderBy('s.start_time','ASC').getMany(); }
  async adminList(restaurantId?: number): Promise<MealSlot[]> { const qb = this.model.createQueryBuilder('s').where('s.is_deleted=0'); if (restaurantId) qb.andWhere('s.restaurant_id=:rid',{rid:restaurantId}); return qb.orderBy('s.restaurant_id','ASC').addOrderBy('s.start_time','ASC').getMany(); }
  async create(data:Partial<MealSlot>):Promise<MealSlot>{const s=new MealSlot();Object.assign(s,data);return this.model.save(s);}
  async update(id:number,data:Partial<MealSlot>):Promise<MealSlot|null>{const s=await this.model.createQueryBuilder('s').where('s.id=:id',{id}).getOne();if(!s)return null;Object.assign(s,data);return this.model.save(s);}
  async remove(id:number):Promise<boolean>{const r=await this.model.createQueryBuilder().update(MealSlot).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0;}
}
