import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('recommended_content') export class RecommendedContent {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ type: 'varchar', length: 200, nullable: true }) title: string;
  @Column({ name: 'content_type', type: 'varchar', length: 20, nullable: true }) contentType: string;
  @Column({ name: 'target_id', type: 'int', unsigned: true, nullable: true }) targetId: number;
  @Column({ name: 'image_url', type: 'varchar', length: 255, nullable: true }) imageUrl: string;
  @Column({ name: 'link_url', type: 'varchar', length: 255, nullable: true }) linkUrl: string;
  @Column({ name: 'sort_order', type: 'int', default: 0 }) sortOrder: number;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
