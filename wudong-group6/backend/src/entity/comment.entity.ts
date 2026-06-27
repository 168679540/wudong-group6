import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'travel_note_id', type: 'int', unsigned: true }) travelNoteId: number;
  @Column({ name: 'user_id', type: 'int', unsigned: true }) userId: number;
  @Column({ type: 'varchar', length: 500 }) content: string;
  @Column({ name: 'like_count', type: 'int', default: 0 }) likeCount: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
