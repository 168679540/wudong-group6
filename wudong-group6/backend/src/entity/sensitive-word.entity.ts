import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('sensitive_words') export class SensitiveWord {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ type: 'varchar', length: 50 }) word: string;
  @Column({ type: 'varchar', length: 20, default: '其他' }) category: string;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
