import request from './request';

export interface Homestay {
  id: number; name: string; coverImage: string; address: string;
  pricePerNight: number; roomCount: number; amenities: string; description: string; merchantId: number;
}

export const getHomestayList = (params?: any) => request.get('/homestay/list', { params });
export const getHomestayDetail = (id: number) => request.get('/homestay/detail', { params: { id } });
