import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { TravelNote } from '../entity/travel-note.entity';
import { Comment } from '../entity/comment.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class CommunityService {
  @InjectEntityModel(TravelNote) noteModel: Repository<TravelNote>;
  @InjectEntityModel(Comment) commentModel: Repository<Comment>;

  async noteList(params: IPageParams & { keyword?: string; location?: string }): Promise<IPageResult<TravelNote>> {
    const { page = 1, pageSize = 10, keyword, location } = params;
    const qb = this.noteModel.createQueryBuilder('t').where('t.is_deleted = 0').andWhere('t.status = 1');
    if (keyword) qb.andWhere('t.title LIKE :kw', { kw: `%${keyword}%` });
    if (location) qb.andWhere('t.location LIKE :loc', { loc: `%${location}%` });
    qb.skip((page - 1) * pageSize).take(pageSize).orderBy('t.created_at', 'DESC');
    const [list, total] = await qb.getManyAndCount();
    return { list, total, page, pageSize };
  }

  async noteDetail(id: number): Promise<TravelNote | null> {
    return this.noteModel.createQueryBuilder('t').where('t.id = :id', { id }).andWhere('t.is_deleted = 0').getOne();
  }

  async getComments(noteId: number): Promise<Comment[]> {
    return this.commentModel.createQueryBuilder('c').where('c.travel_note_id = :id', { id: noteId }).andWhere('c.is_deleted = 0').orderBy('c.created_at', 'DESC').getMany();
  }

  async addComment(travelNoteId: number, content: string, userId: number): Promise<Comment> {
    const c = new Comment();
    c.travelNoteId = travelNoteId;
    c.content = content;
    c.userId = userId;
    return this.commentModel.save(c);
  }

  async stats(): Promise<{ totalNotes: number; totalViews: number; totalLikes: number; totalComments: number }> {
    const [n, c] = await Promise.all([
      this.noteModel.createQueryBuilder('t').select('COUNT(*)','cnt').addSelect('COALESCE(SUM(t.viewCount),0)','views').addSelect('COALESCE(SUM(t.likeCount),0)','likes').where('t.is_deleted=0').andWhere('t.status=1').getRawOne(),
      this.commentModel.createQueryBuilder('c').select('COUNT(*)','cnt').where('c.is_deleted=0').getRawOne(),
    ]);
    return { totalNotes: Number(n?.cnt)||0, totalViews: Number(n?.views)||0, totalLikes: Number(n?.likes)||0, totalComments: Number(c?.cnt)||0 };
  }
}
