import request from './request';

export interface ProductReview {
  id: number; productId: number; userId: number; rating: number;
  content: string; reply: string; followUp?: string; status: number; createdAt: string;
}

export const getProductReviews = (productId: number) => request.get('/product-review/list', { params: { productId } });
export const getAdminReviews = (params?: any) => request.get('/product-review/admin/list', { params });
export const createReview = (data: { productId: number; rating: number; content: string }) => request.post('/product-review/create', data);
export const replyReview = (id: number, reply: string) => request.put('/product-review/reply', { id, reply });
export const updateReviewStatus = (id: number, status: number) => request.put('/product-review/status', { id, status });
export const followUpReview = (id: number, content: string) => request.post('/product-review/follow-up', { id, content });
