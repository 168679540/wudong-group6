import { Inject, Controller, Get, Del, Query } from '@midwayjs/core';import { Context } from '@midwayjs/koa';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { Comment } from '../entity/comment.entity';
@Controller('/api/comment') export class CommentAdminController {
  @Inject() ctx: Context;
  @InjectEntityModel(Comment) model: Repository<Comment>;
  @Get('/admin/list') async adminList(@Query('page')p:number,@Query('pageSize')ps:number,@Query('travelNoteId')tid:number){const qb=this.model.createQueryBuilder('c').where('c.is_deleted=0');if(tid)qb.andWhere('c.travel_note_id=:tid',{tid});const[l,t]=await qb.skip(((p||1)-1)*(ps||10)).take(ps||10).orderBy('c.created_at','DESC').getManyAndCount();return{success:true,data:l,total:t};}
  @Del('/delete') async delete(@Query('id')id:number){const r=await this.model.createQueryBuilder().update(Comment).set({isDeleted:1 as any}).where('id=:id',{id}).execute();return(r.affected??0)>0?{success:true,message:'已删除'}:{success:false,message:'不存在'};}
}
