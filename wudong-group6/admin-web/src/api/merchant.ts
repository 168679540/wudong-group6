import request from './request';

export interface Merchant {
  id: number;
  username: string;
  shopName: string;
  module: string;
  contactName: string;
  contactPhone: string;
  address: string;
  logo: string;
  status: number;
  settlementCycle: string;
  createdAt: string;
  updatedAt: string;
}

export const getMerchantList = () => {
  return request.get('/merchant/list');
};

export const createMerchant = (data: Partial<Merchant>) => {
  return request.post('/merchant/create', data);
};

export const updateMerchant = (id: number, data: Partial<Merchant>) => {
  return request.put('/merchant/update', { id, ...data });
};

export const deleteMerchant = (id: number) => {
  return request.delete('/merchant/delete', { params: { id } });
};
