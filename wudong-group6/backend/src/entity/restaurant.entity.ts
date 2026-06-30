import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('restaurant')
export class Restaurant {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ name: 'cover_image', type: 'varchar', length: 255, nullable: true }) coverImage: string;
  @Column({ type: 'varchar', length: 255, nullable: true }) address: string;
  @Column({ name: 'avg_price', type: 'decimal', precision: 10, scale: 2, default: 0 }) avgPrice: number;
  @Column({ type: 'decimal', precision: 2, scale: 1, default: 5.0 }) rating: number;
  @Column({ name: 'cancellation_policy', type: 'varchar', length: 500, nullable: true }) cancellationPolicy: string;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'merchant_id', type: 'int', unsigned: true, nullable: true }) merchantId: number;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
