import request from './request';

export interface User {
  id: number;
  nickname: string;
  phone: string;
  avatar: string;
  gender: number;
  status: number;
  lastLoginTime: string;
  createdAt: string;
}

export const getUserList = (params?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: number;
}) => {
  return request.get<{ list: User[]; total: number }>('/user/list', { params });
};

export const updateUserStatus = (id: number, status: number) => {
  return request.put('/user/status', { id, status });
};

export const deleteUser = (id: number) => {
  return request.delete('/user/delete', { params: { id } });
};
