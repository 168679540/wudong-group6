import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  nickname: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'tinyint', default: 0 })
  gender: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'last_login_time', type: 'datetime', nullable: true })
  lastLoginTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
