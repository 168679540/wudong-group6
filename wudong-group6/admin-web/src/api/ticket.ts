import request from './request';

export interface Ticket {
  id: number; name: string; type: string; coverImage: string;
  price: number; stock: number; description: string; merchantId: number;
}

export const getTicketList = (params?: any) => request.get('/ticket/list', { params });
export const getTicketDetail = (id: number) => request.get('/ticket/detail', { params: { id } });
