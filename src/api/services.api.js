import apiClient from './client';

export const getWellbeing = async (category) =>
  (await apiClient.get('/services/wellbeing', { params: category ? { category } : undefined })).data.data;

export const getDepartments = async (search) =>
  (await apiClient.get('/services/departments', { params: search ? { search } : undefined })).data.data;

export const getFaq = async (filters = {}) => {
  const params = {};
  if (filters.category) {
    params.category = filters.category;
  }
  if (filters.search) {
    params.search = filters.search;
  }
  return (await apiClient.get('/services/faq', { params })).data.data;
};
