import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('meal_slot')
export class MealSlot {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'restaurant_id', type: 'int', unsigned: true }) restaurantId: number;
  @Column({ type: 'varchar', length: 50 }) name: string;
  @Column({ name: 'start_time', type: 'varchar', length: 10, nullable: true }) startTime: string;
  @Column({ name: 'end_time', type: 'varchar', length: 10, nullable: true }) endTime: string;
  @Column({ name: 'max_bookings', type: 'int', default: 20 }) maxBookings: number;
  @Column({ type: 'tinyint', default: 1 }) status: number;
  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 }) isDeleted: number;
}
