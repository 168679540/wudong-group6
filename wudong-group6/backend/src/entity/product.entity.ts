import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ type: 'varchar', length: 200 }) name: string;
  @Column({ type: 'varchar', length: 50, default: '银饰' }) category: string;
  @Column({ type: 'decimal', precision: 10, scale: 2 }) price: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 }) freight: number;
  @Column({ type: 'int', default: 0 }) stock: number;
  @Column({ name: 'cover_image', type: 'varchar', length: 255, nullable: true }) coverImage: string;
  @Column({ type: 'json', nullable: true }) images: any;
  @Column({ type: 'json', nullable: true }) specs: any;
  @Column({ type: 'text', nullable: true }) description: string;
  @Column({ name: 'merchant_id', type: 'int', unsigned: true, nullable: true }) merchantId: number;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @Column({ type: 'int', default: 0 }) sales: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
