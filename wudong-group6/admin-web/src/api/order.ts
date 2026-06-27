import request from './request';

export interface Order {
  id: number;
  orderNo: string;
  userId: number;
  type: string;
  status: number;
  amount: number;
  merchantId: number;
  createdAt: string;
  updatedAt: string;
}

export const getOrderList = (params: any) => {
  return request.get('/order/list', { params });
};

export const createOrder = (data: { type: string; amount: number; userId?: number; merchantId?: number }) => {
  return request.post('/order/create', data);
};