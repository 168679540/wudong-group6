import { Provide } from '@midwayjs/core';import { InjectEntityModel } from '@midwayjs/typeorm';import { Repository } from 'typeorm';import { UserFollow } from '../entity/user-follow.entity';
@Provide() export class FollowService {
  @InjectEntityModel(UserFollow) model: Repository<UserFollow>;
  async toggle(followerId:number,followingId:number):Promise<{followed:boolean}>{const exist=await this.model.createQueryBuilder('f').where('f.follower_id=:fid',{fid:followerId}).andWhere('f.following_id=:fid2',{fid2:followingId}).getOne();if(exist){await this.model.remove(exist);return{followed:false};}const f=new UserFollow();f.followerId=followerId;f.followingId=followingId;await this.model.save(f);return{followed:true};}
  async isFollowing(followerId:number,followingId:number):Promise<boolean>{const r=await this.model.createQueryBuilder('f').where('f.follower_id=:fid',{fid:followerId}).andWhere('f.following_id=:fid2',{fid2:followingId}).getCount();return r>0;}
}
