import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('product_review')
export class ProductReview {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'product_id', type: 'int', unsigned: true }) productId: number;
  @Column({ name: 'user_id', type: 'int', unsigned: true, default: 1 }) userId: number;
  @Column({ type: 'tinyint', default: 5 }) rating: number;
  @Column({ type: 'varchar', length: 500, nullable: true }) content: string;
  @Column({ type: 'varchar', length: 500, nullable: true }) reply: string;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
