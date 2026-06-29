import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('order')
export class Order {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ name: 'order_no', type: 'varchar', length: 50 })
  orderNo: string;

  @Column({ name: 'user_id', type: 'int', unsigned: true })
  userId: number;

  @Column({ type: 'varchar', length: 20 })
  type: string; // 商品/餐位/住宿/门票/路线

  @Column({ name: 'item_name', type: 'varchar', length: 200, nullable: true })
  itemName: string;

  @Column({ name: 'item_image', type: 'varchar', length: 500, nullable: true })
  itemImage: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number; // 0=待支付, 1=已支付, 2=已确认, 3=已完成, 4=已取消

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ name: 'merchant_id', type: 'int', unsigned: true, nullable: true })
  merchantId: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'is_deleted', type: 'tinyint', default: 0 })
  isDeleted: number;
}
