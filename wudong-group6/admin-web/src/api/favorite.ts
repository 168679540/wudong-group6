import request from './request';

export const checkFavorite = (type: string, targetId: number) => request.get('/favorite/check', { params: { type, targetId } });
export const toggleFavorite = (type: string, targetId: number) => request.post('/favorite/toggle', { type, targetId });
export const getFavorites = (type?: string) => request.get('/favorite/list', { params: { type: type || 'product' } });
