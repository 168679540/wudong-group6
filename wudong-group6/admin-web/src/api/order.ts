import request from './request';

export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  type: string;
  status: number;
  amount: number;
  merchantId: number;
  itemName?: string;
  itemImage?: string;
  expressCompany?: string;
  expressNo?: string;
  createdAt: string;
  updatedAt: string;
}

export const getOrderList = (params: any) => {
  return request.get('/order/list', { params });
};

export const createOrder = (data: { type: string; amount: number; userId?: number; merchantId?: number; itemName?: string; itemImage?: string }) => {
  return request.post('/order/create', data);
};

export const shipOrder = (id: number, expressCompany: string, expressNo: string) => {
  return request.post('/order/ship', { id, expressCompany, expressNo });
};

export const refundOrder = (id: number) => {
  return request.post('/order/refund', { id });
};

export const returnOrder = (id: number) => {
  return request.post('/order/return', { id });
};

export const confirmOrder = (id: number) => {
  return request.post('/order/confirm', { id });
};

export const rejectOrder = (id: number) => {
  return request.post('/order/reject', { id });
};