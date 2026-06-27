import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entity/user.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class UserAdminService {
  @InjectEntityModel(User)
  userModel: Repository<User>;

  async list(
    params: IPageParams & { keyword?: string; status?: number }
  ): Promise<IPageResult<User>> {
    const { page = 1, pageSize = 10, keyword, status } = params;

    const qb = this.userModel
      .createQueryBuilder('u')
      .where('u.is_deleted = 0');

    if (keyword) {
      qb.andWhere('(u.nickname LIKE :keyword OR u.phone LIKE :keyword)', {
        keyword: `%${keyword}%`,
      });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('u.status = :status', { status });
    }

    qb.skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('u.created_at', 'DESC');

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async detail(id: number): Promise<User | null> {
    return this.userModel
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .andWhere('u.is_deleted = 0')
      .getOne();
  }

  async updateStatus(id: number, status: number): Promise<User | null> {
    const user = await this.userModel
      .createQueryBuilder('u')
      .where('u.id = :id', { id })
      .andWhere('u.is_deleted = 0')
      .getOne();

    if (!user) return null;
    user.status = status;
    return this.userModel.save(user);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.userModel
      .createQueryBuilder()
      .update(User)
      .set({ isDeleted: 1 as any })
      .where('id = :id', { id })
      .andWhere('is_deleted = 0')
      .execute();

    return (result.affected ?? 0) > 0;
  }
}
