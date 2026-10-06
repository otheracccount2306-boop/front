import apiClient from './client';

export const getNews = async ({ category, page = 1 } = {}) => {
  const params = { page };
  if (category) {
    params.category = category;
  }
  return (await apiClient.get('/news', { params })).data.data;
};

export const getNewsById = async (id) => (await apiClient.get(`/news/${id}`)).data.data;

export const getEvents = async ({ category, from, to, page = 1 } = {}) => {
  const params = { page };
  if (category) {
    params.category = category;
  }
  if (from) {
    params.from = from;
  }
  if (to) {
    params.to = to;
  }
  return (await apiClient.get('/events', { params })).data.data;
};
