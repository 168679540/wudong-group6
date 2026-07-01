import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
@Entity('room_calendar') export class RoomCalendar {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true }) id: number;
  @Column({ name: 'homestay_id', type: 'int', unsigned: true }) homestayId: number;
  @Column({ type: 'date' }) date: string;
  @Column({ name: 'available_rooms', type: 'int', default: 0 }) availableRooms: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true }) price: number;
  @Column({ type: 'tinyint', default: 1 }) status: number;
}
