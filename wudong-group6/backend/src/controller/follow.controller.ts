import { Inject, Controller, Get, Post, Query, Body } from '@midwayjs/core';import { Context } from '@midwayjs/koa';import { FollowService } from '../service/follow.service';
@Controller('/api/follow') export class FollowController {
  @Inject() ctx: Context; @Inject() service: FollowService;
  @Get('/check') async check(@Query('followerId')fid:number,@Query('followingId')fid2:number){const followed=await this.service.isFollowing(fid||1,fid2);return{success:true,data:{followed}};}
  @Post('/toggle') async toggle(@Body()b:{followerId?:number;followingId:number}){const result=await this.service.toggle(b.followerId||1,b.followingId);return{success:true,message:result.followed?'已关注':'已取消关注',data:result};}
}
