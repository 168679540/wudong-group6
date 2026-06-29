import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('agro_category')
export class AgroCategory {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ type: 'varchar', length: 50 }) name: string;
  @Column({ name: 'sort_order', type: 'int', default: 0 }) sortOrder: number;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
