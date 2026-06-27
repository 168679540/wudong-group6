import request from './request';

export interface Product {
  id: number; name: string; category: string; price: number;
  stock: number; coverImage: string; description: string; sales: number; merchantId: number;
}

export const getProductList = (params?: any) => request.get('/product/list', { params });
export const getProductDetail = (id: number) => request.get('/product/detail', { params: { id } });
