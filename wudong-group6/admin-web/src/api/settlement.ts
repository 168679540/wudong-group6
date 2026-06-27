import request from './request';

export interface SettlementSummary {
  type: string;
  totalOrders: number;
  totalAmount: number;
  serviceFee: number;
  settlementAmount: number;
  paidCount: number;
  unpaidCount: number;
}

export const getSettlementList = (params?: {
  page?: number;
  pageSize?: number;
  type?: string;
}) => {
  return request.get<{ list: SettlementSummary[]; total: number }>('/settlement/list', { params });
};

export const getSettlementStats = () => {
  return request.get('/settlement/stats');
};

export const executeSettle = (id: number) => {
  return request.post('/settlement/settle', { id });
};
