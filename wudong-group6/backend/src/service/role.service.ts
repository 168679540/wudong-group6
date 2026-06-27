import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entity/role.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class RoleService {
  @InjectEntityModel(Role)
  roleModel: Repository<Role>;

  /**
   * 获取角色列表（分页）
   */
  async list(
    params: IPageParams & { keyword?: string; status?: number }
  ): Promise<IPageResult<Role>> {
    const { page = 1, pageSize = 10, keyword, status } = params;

    const qb = this.roleModel
      .createQueryBuilder('r')
      .where('r.is_deleted = 0');

    if (keyword) {
      qb.andWhere('r.role_name LIKE :keyword', { keyword: `%${keyword}%` });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('r.status = :status', { status });
    }

    qb.skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('r.created_at', 'DESC');

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 获取所有启用的角色
   */
  async getAll(): Promise<Role[]> {
    return this.roleModel
      .createQueryBuilder('r')
      .where('r.is_deleted = 0')
      .andWhere('r.status = 1')
      .orderBy('r.created_at', 'ASC')
      .getMany();
  }

  /**
   * 获取角色详情
   */
  async detail(id: number): Promise<Role | null> {
    return this.roleModel
      .createQueryBuilder('r')
      .where('r.id = :id', { id })
      .andWhere('r.is_deleted = 0')
      .getOne();
  }

  /**
   * 创建角色
   */
  async create(data: Partial<Role>): Promise<Role> {
    const role = new Role();
    Object.assign(role, data);
    return this.roleModel.save(role);
  }

  /**
   * 更新角色
   */
  async update(id: number, data: Partial<Role>): Promise<Role | null> {
    const role = await this.roleModel
      .createQueryBuilder('r')
      .where('r.id = :id', { id })
      .andWhere('r.is_deleted = 0')
      .getOne();

    if (!role) return null;
    Object.assign(role, data);
    return this.roleModel.save(role);
  }

  /**
   * 软删除角色
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.roleModel
      .createQueryBuilder()
      .update(Role)
      .set({ isDeleted: 1 as any })
      .where('id = :id', { id })
      .andWhere('is_deleted = 0')
      .execute();

    return (result.affected ?? 0) > 0;
  }
}
