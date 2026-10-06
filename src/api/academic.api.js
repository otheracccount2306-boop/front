import apiClient from './client';

export const getSchedule = async (day) =>
  (await apiClient.get('/academic/schedule', { params: day ? { day } : undefined })).data.data;

export const getCalendar = async (category) =>
  (await apiClient.get('/academic/calendar', { params: category ? { category } : undefined })).data.data;
