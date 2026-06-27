import request from './request';

export interface TravelNote {
  id: number;
  title: string;
  content: string;
  coverImage: string;
  images: string[];
  authorName: string;
  authorId: number;
  location: string;
  viewCount: number;
  likeCount: number;
  status: number;
  rejectReason: string;
  createdAt: string;
}

export const getTravelNoteList = (params?: {
  page?: number;
  pageSize?: number;
  keyword?: string;
  status?: number;
  location?: string;
}) => {
  return request.get<{ list: TravelNote[]; total: number }>('/travel-note/list', { params });
};

export const getTravelNoteDetail = (id: number) => {
  return request.get('/travel-note/detail', { params: { id } });
};

export const approveTravelNote = (data: { id: number; reviewerId: number }) => {
  return request.put('/travel-note/approve', data);
};

export const rejectTravelNote = (data: { id: number; reviewerId: number; reason: string }) => {
  return request.put('/travel-note/reject', data);
};

export const takeDownTravelNote = (id: number) => {
  return request.put('/travel-note/take-down', { id });
};

export const deleteTravelNote = (id: number) => {
  return request.delete('/travel-note/delete', { params: { id } });
};
