import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('user_follow') export class UserFollow {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'follower_id', type: 'int', unsigned: true }) followerId: number;
  @Column({ name: 'following_id', type: 'int', unsigned: true }) followingId: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
