import request from './request';

export interface Restaurant {
  id: number; name: string; coverImage: string; address: string;
  avgPrice: number; rating: number; description: string; merchantId: number;
}

export const getRestaurantList = (params?: any) => request.get('/restaurant/list', { params });
export const getRestaurantDetail = (id: number) => request.get('/restaurant/detail', { params: { id } });
