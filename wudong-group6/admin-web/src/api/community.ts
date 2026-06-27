import request from './request';

export const getNoteList = (params?: any) => request.get('/community/note/list', { params });
export const getNoteDetail = (id: number) => request.get('/community/note/detail', { params: { id } });
