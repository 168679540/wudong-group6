import request from './request';

export interface ProductCategory { id: number; name: string; sortOrder: number; status: number; }

export const getCategoryList = (params?: any) => request.get('/product-category/list', { params });
export const getActiveCategories = () => request.get('/product-category/active');
export const createCategory = (data: Partial<ProductCategory>) => request.post('/product-category/create', data);
export const updateCategory = (data: Partial<ProductCategory> & { id: number }) => request.put('/product-category/update', data);
export const deleteCategory = (id: number) => request.delete('/product-category/delete', { params: { id } });
