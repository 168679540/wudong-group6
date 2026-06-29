import request from './request';
export interface TrafficGuide { id:number;title:string;origin:string;destination:string;transportType:string;duration:string;cost:string;coverImage:string;content:string;viewCount:number;status?:number }
export const getTrafficList = (params?:any) => request.get('/traffic-guide/list', { params });
export const getAdminTrafficList = (params?:any) => request.get('/traffic-guide/admin/list', { params });
export const getTrafficDetail = (id:number) => request.get('/traffic-guide/detail', { params: { id } });
export const createTraffic = (data:Partial<TrafficGuide>) => request.post('/traffic-guide/create', data);
export const updateTraffic = (data:Partial<TrafficGuide>&{id:number}) => request.put('/traffic-guide/update', data);
export const deleteTraffic = (id:number) => request.delete('/traffic-guide/delete', { params: { id } });
