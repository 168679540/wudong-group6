import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'role_name', type: 'varchar', length: 50 })
  roleName: string;

  @Column({ type: 'json', nullable: true })
  permissions: any;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
