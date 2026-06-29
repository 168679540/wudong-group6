import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
@Entity('traffic_guide')
export class TrafficGuide {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ type: 'varchar', length: 200 }) title: string;
  @Column({ type: 'varchar', length: 100, nullable: true }) origin: string;
  @Column({ type: 'varchar', length: 100, nullable: true }) destination: string;
  @Column({ name: 'transport_type', type: 'varchar', length: 50, nullable: true }) transportType: string;
  @Column({ type: 'varchar', length: 50, nullable: true }) duration: string;
  @Column({ type: 'varchar', length: 100, nullable: true }) cost: string;
  @Column({ name: 'cover_image', type: 'varchar', length: 255, nullable: true }) coverImage: string;
  @Column({ type: 'text', nullable: true }) content: string;
  @Column({ name: 'merchant_id', type: 'int', unsigned: true, nullable: true }) merchantId: number;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @Column({ name: 'view_count', type: 'int', default: 0 }) viewCount: number;
  @CreateDateColumn({ name: 'created_at' }) createdAt: Date;
  @UpdateDateColumn({ name: 'updated_at' }) updatedAt: Date;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
