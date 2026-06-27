import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('announcement')
export class Announcement {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'varchar', length: 20, default: 'system' })
  type: string;

  @Column({ name: 'is_top', type: 'tinyint', default: 0 })
  isTop: number;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'publish_time', type: 'datetime', nullable: true })
  publishTime: Date;

  @Column({ name: 'created_by', type: 'int', unsigned: true, nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
