import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('travel_note')
export class TravelNote {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 200 })
  title: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ name: 'cover_image', type: 'varchar', length: 255, nullable: true })
  coverImage: string;

  @Column({ type: 'json', nullable: true })
  images: any;

  @Column({ name: 'author_name', type: 'varchar', length: 50, nullable: true })
  authorName: string;

  @Column({ name: 'author_id', type: 'int', unsigned: true, nullable: true })
  authorId: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  location: string;

  @Column({ name: 'view_count', type: 'int', default: 0 })
  viewCount: number;

  @Column({ name: 'like_count', type: 'int', default: 0 })
  likeCount: number;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ name: 'reject_reason', type: 'varchar', length: 500, nullable: true })
  rejectReason: string;

  @Column({ name: 'reviewer_id', type: 'int', unsigned: true, nullable: true })
  reviewerId: number;

  @Column({ name: 'review_time', type: 'datetime', nullable: true })
  reviewTime: Date;

  @Column({ name: 'publish_time', type: 'datetime', nullable: true })
  publishTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
