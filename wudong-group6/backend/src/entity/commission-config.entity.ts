import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from 'typeorm';
@Entity('commission_config') export class CommissionConfig {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'module_name', type: 'varchar', length: 50, unique: true }) moduleName: string;
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5.00 }) rate: number;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
}
