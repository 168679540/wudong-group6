import { Provide } from '@midwayjs/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ProductReview } from '../entity/product-review.entity';
import { IPageParams, IPageResult } from '../interface';

@Provide()
export class ProductReviewService {
  @InjectEntityModel(ProductReview)
  model: Repository<ProductReview>;

  async listByProduct(productId: number, page = 1, pageSize = 20): Promise<IPageResult<ProductReview>> {
    const qb = this.model.createQueryBuilder('r')
      .where('r.is_deleted = 0').andWhere('r.product_id = :pid', { pid: productId }).andWhere('r.status = 1');
    const [list, total] = await qb.skip((page - 1) * pageSize).take(pageSize).orderBy('r.created_at', 'DESC').getManyAndCount();
    return { list, total, page, pageSize };
  }

  async adminList(params: IPageParams & { productId?: number; status?: number }): Promise<IPageResult<ProductReview>> {
    const { page = 1, pageSize = 10, productId, status } = params;
    const qb = this.model.createQueryBuilder('r').where('r.is_deleted = 0');
    if (productId) qb.andWhere('r.product_id = :pid', { pid: productId });
    if (status !== undefined && status !== null) qb.andWhere('r.status = :st', { st: status });
    const [list, total] = await qb.skip((page - 1) * pageSize).take(pageSize).orderBy('r.created_at', 'DESC').getManyAndCount();
    return { list, total, page, pageSize };
  }

  async create(data: Partial<ProductReview>): Promise<ProductReview> {
    const r = new ProductReview(); Object.assign(r, data); return this.model.save(r);
  }

  async reply(id: number, reply: string): Promise<ProductReview | null> {
    const r = await this.model.createQueryBuilder('r').where('r.id = :id', { id }).andWhere('r.is_deleted = 0').getOne();
    if (!r) return null; r.reply = reply; return this.model.save(r);
  }

  async updateStatus(id: number, status: number): Promise<ProductReview | null> {
    const r = await this.model.createQueryBuilder('r').where('r.id = :id', { id }).getOne();
    if (!r) return null; r.status = status; return this.model.save(r);
  }

  async followUp(id: number, content: string): Promise<ProductReview | null> {
    const r = await this.model.createQueryBuilder('r').where('r.id = :id', { id }).andWhere('r.is_deleted = 0').getOne();
    if (!r) return null;
    // 检查30天限制
    const days = (Date.now() - new Date(r.createdAt).getTime()) / (1000 * 60 * 60 * 24);
    if (days > 30) throw new Error('评价已超过30天，无法追评');
    if (r.followUp) throw new Error('已追评过，只能追评一次');
    r.followUp = content;
    return this.model.save(r);
  }
}
