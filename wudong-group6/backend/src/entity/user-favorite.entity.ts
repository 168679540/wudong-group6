import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('user_favorite')
export class UserFavorite {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'user_id', type: 'int', unsigned: true, default: 1 }) userId: number;
  @Column({ type: 'varchar', length: 20, default: 'product' }) type: string;
  @Column({ name: 'target_id', type: 'int', unsigned: true }) targetId: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
