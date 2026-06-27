import request from './request';

export interface Role {
  id: number;
  roleName: string;
  permissions: string;
  description: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export const getRoleList = () => {
  return request.get('/role/list');
};

export const createRole = (data: Partial<Role>) => {
  return request.post('/role/create', data);
};

export const updateRole = (id: number, data: Partial<Role>) => {
  return request.put('/role/update', { id, ...data });
};

export const deleteRole = (id: number) => {
  return request.delete('/role/delete', { params: { id } });
};
