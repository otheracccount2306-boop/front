import apiClient from './client';

export const getSpaces = async (category) =>
  (await apiClient.get('/campus/spaces', { params: category ? { category } : undefined })).data.data;

export const searchSpaces = async (query) =>
  (await apiClient.get('/campus/spaces/search', { params: { q: query } })).data.data;

export const getPlans = async () => (await apiClient.get('/campus/plans')).data.data;

export const getPlan = async (id) => (await apiClient.get(`/campus/plans/${id}`)).data.data;
