import request from './request';
export interface MealSlot { id: number; restaurantId: number; name: string; startTime: string; endTime: string; maxBookings: number; status: number; }
export const getMealSlots = (restaurantId: number) => request.get('/meal-slot/list', { params: { restaurantId } });
export const getAdminMealSlots = (restaurantId?: number) => request.get('/meal-slot/admin/list', { params: { restaurantId } });
export const createMealSlot = (data: Partial<MealSlot>) => request.post('/meal-slot/create', data);
export const updateMealSlot = (data: Partial<MealSlot> & { id: number }) => request.put('/meal-slot/update', data);
export const deleteMealSlot = (id: number) => request.delete('/meal-slot/delete', { params: { id } });
