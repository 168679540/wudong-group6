import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('banner')
export class Banner {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200, nullable: true })
  title: string;

  @Column({ name: 'image_url', type: 'varchar', length: 255 })
  imageUrl: string;

  @Column({ name: 'link_url', type: 'varchar', length: 255, nullable: true })
  linkUrl: string;

  @Column({ name: 'sort_order', type: 'int', default: 0 })
  sortOrder: number;

  @Column({ type: 'varchar', length: 50, default: 'home' })
  position: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'start_time', type: 'datetime', nullable: true })
  startTime: Date;

  @Column({ name: 'end_time', type: 'datetime', nullable: true })
  endTime: Date;

  @Column({ name: 'created_by', type: 'int', unsigned: true, nullable: true })
  createdBy: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
