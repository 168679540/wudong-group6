import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { UserFavorite } from '../entity/user-favorite.entity';

@Provide()
export class UserFavoriteService {
  @InjectEntityModel(UserFavorite)
  model: Repository<UserFavorite>;

  async list(userId: number, type = 'product'): Promise<UserFavorite[]> {
    return this.model.createQueryBuilder('f').where('f.user_id = :uid', { uid: userId }).andWhere('f.type = :type', { type }).orderBy('f.created_at', 'DESC').getMany();
  }

  async isFavorited(userId: number, type: string, targetId: number): Promise<boolean> {
    const count = await this.model.createQueryBuilder('f').where('f.user_id = :uid', { uid: userId }).andWhere('f.type = :type', { type }).andWhere('f.target_id = :tid', { tid: targetId }).getCount();
    return count > 0;
  }

  async toggle(userId: number, type: string, targetId: number): Promise<{ favorited: boolean }> {
    const existing = await this.model.createQueryBuilder('f').where('f.user_id = :uid', { uid: userId }).andWhere('f.type = :type', { type }).andWhere('f.target_id = :tid', { tid: targetId }).getOne();
    if (existing) { await this.model.remove(existing); return { favorited: false }; }
    const f = new UserFavorite(); f.userId = userId; f.type = type; f.targetId = targetId; await this.model.save(f);
    return { favorited: true };
  }
}
