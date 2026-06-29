import request from './request';

export interface Ticket {
  id: number; name: string; type: string; coverImage: string;
  price: number; stock: number; rating: number; description: string; merchantId: number; status?: number;
}

export const getTicketList = (params?: any) => request.get('/ticket/list', { params });
export const getAdminTicketList = (params?: any) => request.get('/ticket/admin/list', { params });
export const getTicketDetail = (id: number) => request.get('/ticket/detail', { params: { id } });
export const createTicket = (data: Partial<Ticket>) => request.post('/ticket/create', data);
export const updateTicket = (data: Partial<Ticket> & { id: number }) => request.put('/ticket/update', data);
export const deleteTicket = (id: number) => request.delete('/ticket/delete', { params: { id } });
export const updateTicketStatus = (id: number, status: number) => request.put('/ticket/status', { id, status });
