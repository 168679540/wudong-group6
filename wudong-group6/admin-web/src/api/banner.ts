import request from './request';

export interface Banner {
  id: number;
  title: string;
  imageUrl: string;
  linkUrl: string;
  sortOrder: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export const getBannerList = () => {
  return request.get('/banner/list');
};

export const createBanner = (data: Partial<Banner>) => {
  return request.post('/banner/create', data);
};

export const updateBanner = (id: number, data: Partial<Banner>) => {
  return request.put('/banner/update', { id, ...data });
};

export const deleteBanner = (id: number) => {
  return request.delete('/banner/delete', { params: { id } });
};
