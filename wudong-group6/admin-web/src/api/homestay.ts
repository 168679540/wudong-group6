import request from './request';

export interface Homestay {
  id: number; name: string; coverImage: string; address: string;
  pricePerNight: number; roomCount: number; amenities: string; rating: number; description: string;
  merchantId: number; status?: number;
}

export const getHomestayList = (params?: any) => request.get('/homestay/list', { params });
export const getAdminHomestayList = (params?: any) => request.get('/homestay/admin/list', { params });
export const getHomestayDetail = (id: number) => request.get('/homestay/detail', { params: { id } });
export const createHomestay = (data: Partial<Homestay>) => request.post('/homestay/create', data);
export const updateHomestay = (data: Partial<Homestay> & { id: number }) => request.put('/homestay/update', data);
export const deleteHomestay = (id: number) => request.delete('/homestay/delete', { params: { id } });
export const updateHomestayStatus = (id: number, status: number) => request.put('/homestay/status', { id, status });
