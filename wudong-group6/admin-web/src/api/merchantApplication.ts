import request from './request';

export interface Application {
  id: number;
  userId: number;
  shopName: string;
  module: string;
  contactName: string;
  contactPhone: string;
  status: number;
  rejectReason: string;
  createdAt: string;
}

// 获取入驻申请列表
export const getApplicationList = (params?: { 
  page?: number; 
  pageSize?: number; 
  status?: number;
  keyword?: string;
}) => {
  return request.get<{ list: Application[]; total: number }>('/merchant-application/list', { params });
};

// 审核入驻申请
export const reviewApplication = (data: {
  id: number;
  status: number;
  rejectReason?: string;
}) => {
  return request.post('/merchant-application/review', data);
};