import request from './request';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  type: string;
  isTop: number;
  status: number;
  publishTime: string;
  createdAt: string;
  updatedAt: string;
}

export const getAnnouncementList = () => {
  return request.get('/announcement/list');
};

export const createAnnouncement = (data: Partial<Announcement>) => {
  return request.post('/announcement/create', data);
};

export const updateAnnouncement = (id: number, data: Partial<Announcement>) => {
  return request.put('/announcement/update', { id, ...data });
};

export const deleteAnnouncement = (id: number) => {
  return request.delete('/announcement/delete', { params: { id } });
};
