import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('merchant_application')
export class MerchantApplication {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @Column({ name: 'shop_name', type: 'varchar', length: 100 })
  shopName: string;

  @Column({ type: 'varchar', length: 20 })
  module: string;

  @Column({ name: 'contact_name', type: 'varchar', length: 50, nullable: true })
  contactName: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ name: 'business_license', type: 'varchar', length: 255, nullable: true })
  businessLicense: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  qualification: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ name: 'reject_reason', type: 'varchar', length: 500, nullable: true })
  rejectReason: string;

  @Column({ name: 'reviewer_id', type: 'int', unsigned: true, nullable: true })
  reviewerId: number;

  @Column({ name: 'review_time', type: 'datetime', nullable: true })
  reviewTime: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
