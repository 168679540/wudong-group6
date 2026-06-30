import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('report') export class Report {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'reporter_id', type: 'int', unsigned: true, default: 1 }) reporterId: number;
  @Column({ name: 'target_type', type: 'varchar', length: 20 }) targetType: string;
  @Column({ name: 'target_id', type: 'int', unsigned: true }) targetId: number;
  @Column({ type: 'varchar', length: 500, nullable: true }) reason: string;
  @Column({ type: 'tinyint', default: 0 }) status: number;
  @Column({ name: 'handled_by', type: 'int', unsigned: true, nullable: true }) handledBy: number;
  @Column({ name: 'handle_note', type: 'varchar', length: 500, nullable: true }) handleNote: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
