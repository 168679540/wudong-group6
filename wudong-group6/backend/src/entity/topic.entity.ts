import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('topic') export class Topic {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ type: 'varchar', length: 50 }) name: string;
  @Column({ type: 'varchar', length: 200, nullable: true }) description: string;
  @Column({ name: 'note_count', type: 'int', default: 0 }) noteCount: number;
  @Column({ name: 'follow_count', type: 'int', default: 0 }) followCount: number;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
