import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
@Entity('operation_log') export class OperationLog {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'operator_id', type: 'int', unsigned: true, nullable: true }) operatorId: number;
  @Column({ name: 'operator_name', type: 'varchar', length: 50, nullable: true }) operatorName: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) action: string;
  @Column({ type: 'varchar', length: 200, nullable: true }) target: string;
  @Column({ type: 'text', nullable: true }) detail: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) ip: string;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
}
