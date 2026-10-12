import apiClient from './client';

export const getSchedule = async (day) =>
  (await apiClient.get('/academic/schedule', { params: day ? { day } : undefined })).data.data;

export const getCalendar = async (category) =>
  (await apiClient.get('/academic/calendar', { params: category ? { category } : undefined })).data.data;

export const createPersonalClass = async (data) => (await apiClient.post('/academic/personal-classes', data)).data.data;

export const updatePersonalClass = async (id, data) =>
  (await apiClient.put(`/academic/personal-classes/${id}`, data)).data.data;

export const deletePersonalClass = async (id) => {
  await apiClient.delete(`/academic/personal-classes/${id}`);
};
