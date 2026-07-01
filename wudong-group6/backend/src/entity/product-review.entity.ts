import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('product_review')
export class ProductReview {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'product_id', type: 'int', unsigned: true, nullable: true }) productId: number;
  @Column({ name: 'restaurant_id', type: 'int', unsigned: true, nullable: true }) restaurantId: number;
  @Column({ name: 'homestay_id', type: 'int', unsigned: true, nullable: true }) homestayId: number;
  @Column({ name: 'ticket_id', type: 'int', unsigned: true, nullable: true }) ticketId: number;
  @Column({ name: 'user_id', type: 'int', unsigned: true, default: 1 }) userId: number;
  @Column({ type: 'tinyint', default: 5 }) rating: number;
  @Column({ type: 'varchar', length: 500, nullable: true }) content: string;
  @Column({ type: 'varchar', length: 500, nullable: true }) reply: string;
  @Column({ name: 'follow_up', type: 'varchar', length: 500, nullable: true }) followUp: string;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
