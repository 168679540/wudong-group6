import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Role } from './role.entity';

@Entity('admin')
export class Admin {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'real_name', type: 'varchar', length: 50, nullable: true })
  realName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ name: 'role_id', type: 'int', unsigned: true, nullable: true })
  roleId: number;

  @ManyToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ name: 'last_login_time', type: 'datetime', nullable: true })
  lastLoginTime: Date;

  @Column({ name: 'last_login_ip', type: 'varchar', length: 50, nullable: true })
  lastLoginIp: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
