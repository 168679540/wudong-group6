import request from './request';

export interface Admin {
  id: number;
  username: string;
  realName: string;
  phone: string;
  email: string;
  roleId: number;
  status: number;
  createdAt: string;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
  admin: Admin;
}

// 登录
export const login = (params: LoginParams) => {
  return request.post<LoginResult>('/admin/login', params);
};

// 获取管理员列表
export const getAdminList = (params?: { page?: number; pageSize?: number; keyword?: string }) => {
  return request.get<{ list: Admin[]; total: number }>('/admin/list', { params });
};

// 创建管理员
export const createAdmin = (data: Partial<Admin>) => {
  return request.post('/admin/create', data);
};

// 更新管理员
export const updateAdmin = (id: number, data: Partial<Admin>) => {
  return request.put('/admin/update', { id, ...data });
};

// 删除管理员
export const deleteAdmin = (id: number) => {
  return request.delete('/admin/delete', { params: { id } });
};