import request from './request';
export interface AgroProduct { id: number; name: string; category: string; price: number; freight: number; rating: number; stock: number; coverImage: string; description: string; sales: number; merchantId: number; specs?: any; status?: number; }
export const getAgroProductList = (params?: any) => request.get('/agro-product/list', { params });
export const getAdminAgroProductList = (params?: any) => request.get('/agro-product/admin/list', { params });
export const getAgroProductDetail = (id: number) => request.get('/agro-product/detail', { params: { id } });
export const createAgroProduct = (data: Partial<AgroProduct>) => request.post('/agro-product/create', data);
export const updateAgroProduct = (data: Partial<AgroProduct> & { id: number }) => request.put('/agro-product/update', data);
export const deleteAgroProduct = (id: number) => request.delete('/agro-product/delete', { params: { id } });
export const updateAgroProductStatus = (id: number, status: number) => request.put('/agro-product/status', { id, status });
