import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { Admin } from '../entity/admin.entity';
import { Role } from '../entity/role.entity';
import { IPageParams, IPageResult, ILoginParams, IJwtPayload } from '../interface';

@Provide()
export class AdminService {
  @InjectEntityModel(Admin)
  adminModel: Repository<Admin>;

  @InjectEntityModel(Role)
  roleModel: Repository<Role>;

  /**
   * 管理员登录
   */
  async login(params: ILoginParams): Promise<{ token: string; admin: Admin } | null> {
    const admin = await this.adminModel
      .createQueryBuilder('a')
      .where('a.username = :username', { username: params.username })
      .andWhere('a.is_deleted = 0')
      .andWhere('a.status = 1')
      .getOne();

    if (!admin) return null;

    const valid = bcrypt.compareSync(params.password, admin.password);
    if (!valid) return null;

    // 更新最后登录时间
    admin.lastLoginTime = new Date();
    await this.adminModel.save(admin);

    // 附带角色信息
    if (admin.roleId) {
      const role = await this.roleModel.findOne({ where: { id: admin.roleId } });
      (admin as any).role = role;
    }

    const payload: IJwtPayload = {
      id: admin.id,
      username: admin.username,
      type: 'admin',
    };
    const token = jwt.sign(payload, 'wudong-jwt-secret', { expiresIn: '24h' });

    const { password, ...safeAdmin } = admin;
    return { token, admin: safeAdmin as Admin };
  }

  /**
   * 获取管理员列表（分页）
   */
  async list(
    params: IPageParams & { keyword?: string; roleId?: number; status?: number }
  ): Promise<IPageResult<Admin>> {
    const { page = 1, pageSize = 10, keyword, roleId, status } = params;

    const qb = this.adminModel
      .createQueryBuilder('a')
      .where('a.is_deleted = 0');

    if (keyword) {
      qb.andWhere('a.username LIKE :keyword', { keyword: `%${keyword}%` });
    }
    if (roleId !== undefined && roleId !== null) {
      qb.andWhere('a.role_id = :roleId', { roleId });
    }
    if (status !== undefined && status !== null) {
      qb.andWhere('a.status = :status', { status });
    }

    qb.skip((page - 1) * pageSize)
      .take(pageSize)
      .orderBy('a.created_at', 'DESC');

    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  /**
   * 获取管理员详情
   */
  async detail(id: number): Promise<Admin | null> {
    const admin = await this.adminModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();

    if (admin && admin.roleId) {
      const role = await this.roleModel.findOne({ where: { id: admin.roleId } });
      (admin as any).role = role;
    }

    return admin;
  }

  /**
   * 创建管理员
   */
  async create(data: Partial<Admin>): Promise<Admin> {
    const admin = new Admin();
    Object.assign(admin, data);
    if (data.password) {
      admin.password = bcrypt.hashSync(data.password, 10);
    }
    return this.adminModel.save(admin);
  }

  /**
   * 更新管理员
   */
  async update(id: number, data: Partial<Admin>): Promise<Admin | null> {
    const admin = await this.adminModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();

    if (!admin) return null;

    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }

    Object.assign(admin, data);
    return this.adminModel.save(admin);
  }

  /**
   * 软删除管理员
   */
  async remove(id: number): Promise<boolean> {
    const result = await this.adminModel
      .createQueryBuilder()
      .update(Admin)
      .set({ isDeleted: 1 as any })
      .where('id = :id', { id })
      .andWhere('is_deleted = 0')
      .execute();

    return (result.affected ?? 0) > 0;
  }

  /**
   * 修改管理员状态
   */
  async updateStatus(id: number, status: number): Promise<Admin | null> {
    const admin = await this.adminModel
      .createQueryBuilder('a')
      .where('a.id = :id', { id })
      .andWhere('a.is_deleted = 0')
      .getOne();

    if (!admin) return null;
    admin.status = status;
    return this.adminModel.save(admin);
  }

  /**
   * 获取所有角色列表（供管理员选择）
   */
  async getRoleList(): Promise<Role[]> {
    return this.roleModel
      .createQueryBuilder('r')
      .where('r.is_deleted = 0')
      .andWhere('r.status = 1')
      .orderBy('r.created_at', 'ASC')
      .getMany();
  }
}
