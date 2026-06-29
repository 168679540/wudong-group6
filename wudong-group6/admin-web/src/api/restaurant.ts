import request from './request';

export interface Restaurant {
  id: number; name: string; coverImage: string; address: string;
  avgPrice: number; rating: number; description: string; merchantId: number; status?: number;
}

export const getRestaurantList = (params?: any) => request.get('/restaurant/list', { params });
export const getAdminRestaurantList = (params?: any) => request.get('/restaurant/admin/list', { params });
export const getRestaurantDetail = (id: number) => request.get('/restaurant/detail', { params: { id } });
export const createRestaurant = (data: Partial<Restaurant>) => request.post('/restaurant/create', data);
export const updateRestaurant = (data: Partial<Restaurant> & { id: number }) => request.put('/restaurant/update', data);
export const deleteRestaurant = (id: number) => request.delete('/restaurant/delete', { params: { id } });
export const updateRestaurantStatus = (id: number, status: number) => request.put('/restaurant/status', { id, status });
