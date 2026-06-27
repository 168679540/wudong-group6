import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('merchant')
export class Merchant {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ name: 'shop_name', type: 'varchar', length: 100 })
  shopName: string;

  @Column({ type: 'varchar', length: 20 })
  module: string;

  @Column({ name: 'contact_name', type: 'varchar', length: 50, nullable: true })
  contactName: string;

  @Column({ name: 'contact_phone', type: 'varchar', length: 20, nullable: true })
  contactPhone: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ name: 'settlement_cycle', type: 'varchar', length: 20, default: 'T+7' })
  settlementCycle: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
