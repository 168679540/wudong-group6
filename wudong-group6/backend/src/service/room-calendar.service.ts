import { Provide } from '@midwayjs/core'; import { InjectEntityModel } from '@midwayjs/typeorm'; import { Repository } from 'typeorm'; import { RoomCalendar } from '../entity/room-calendar.entity';
@Provide() export class RoomCalendarService {
  @InjectEntityModel(RoomCalendar) model: Repository<RoomCalendar>;
  async listByHomestay(hid: number, days = 7): Promise<RoomCalendar[]> { return this.model.createQueryBuilder('r').where('r.homestay_id=:hid',{hid}).andWhere('r.date >= CURDATE()').andWhere('r.date < DATE_ADD(CURDATE(),INTERVAL :days DAY)',{days}).orderBy('r.date','ASC').getMany(); }
  async set(id: number, data: Partial<RoomCalendar>): Promise<RoomCalendar|null> { const r = await this.model.findOne({where:{id}}); if (!r) return null; Object.assign(r, data); return this.model.save(r); }
  async batchSet(hid: number, date: string, availableRooms: number, status: number, price?: number): Promise<RoomCalendar> {
    let r = await this.model.findOne({ where: { homestayId: hid, date } });
    if (!r) { r = new RoomCalendar(); r.homestayId = hid; r.date = date; }
    r.availableRooms = availableRooms; r.status = status; if (price !== undefined) r.price = price;
    return this.model.save(r);
  }
}
