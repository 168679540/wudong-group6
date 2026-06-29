import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('system_message') export class SystemMessage {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'user_id', type: 'int', unsigned: true, default: 0 }) userId: number;
  @Column({ type: 'varchar', length: 20, default: 'system' }) type: string;
  @Column({ type: 'varchar', length: 200, nullable: true }) title: string;
  @Column({ type: 'text', nullable: true }) content: string;
  @Column({ name: 'is_read', type: 'tinyint', default: 0 }) isRead: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
