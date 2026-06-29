import request from './request';

export interface Product {
  id: number; name: string; category: string; price: number;
  freight: number; stock: number; coverImage: string; description: string;
  sales: number; merchantId: number; specs?: any; status?: number;
}

export const getProductList = (params?: any) => request.get('/product/list', { params });

export const getAdminProductList = (params?: any) => request.get('/product/admin/list', { params });

export const getProductDetail = (id: number) => request.get('/product/detail', { params: { id } });

export const createProduct = (data: Partial<Product>) => request.post('/product/create', data);

export const updateProduct = (data: Partial<Product> & { id: number }) => request.put('/product/update', data);

export const deleteProduct = (id: number) => request.delete('/product/delete', { params: { id } });

export const updateProductStatus = (id: number, status: number) => request.put('/product/status', { id, status });

export const getProductStats = () => request.get('/product/stats');
