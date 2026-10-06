import apiClient from './client';

const SERVICE_PATHS = { wellbeing: 'wellbeing', department: 'departments', departments: 'departments', faq: 'faq' };

const pickParams = (params) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== null && value !== ''));

const servicePath = (type) => SERVICE_PATHS[type] || type;

export const listUsers = async ({ search, active, page = 1 } = {}) =>
  (await apiClient.get('/admin/users', { params: pickParams({ page, search, active }) })).data.data;

export const updateUserStatus = async (id, activo) =>
  (await apiClient.put(`/admin/users/${id}/status`, { activo })).data.data;

export const updateUserRole = async (id, rol) => (await apiClient.put(`/admin/users/${id}/role`, { rol })).data.data;

export const deleteUser = async (id) => {
  await apiClient.delete(`/admin/users/${id}`);
};

export const listRoles = async () => (await apiClient.get('/admin/roles')).data.data;

export const listAllNews = async ({ category, status, page = 1 } = {}) =>
  (await apiClient.get('/admin/news', { params: pickParams({ category, status, page }) })).data.data;

export const createNews = async (data) => (await apiClient.post('/admin/news', data)).data.data;

export const updateNews = async (id, data) => (await apiClient.put(`/admin/news/${id}`, data)).data.data;

export const deleteNews = async (id) => {
  await apiClient.delete(`/admin/news/${id}`);
};

export const listAllEvents = async ({ category, status, page = 1 } = {}) =>
  (await apiClient.get('/admin/events', { params: pickParams({ category, status, page }) })).data.data;

export const createEvent = async (data) => (await apiClient.post('/admin/events', data)).data.data;

export const updateEvent = async (id, data) => (await apiClient.put(`/admin/events/${id}`, data)).data.data;

export const deleteEvent = async (id) => {
  await apiClient.delete(`/admin/events/${id}`);
};

export const listAllServices = async (type, { category } = {}) =>
  (await apiClient.get(`/admin/services/${servicePath(type)}`, { params: pickParams({ category }) })).data.data;

export const createService = async (type, data) =>
  (await apiClient.post(`/admin/services/${servicePath(type)}`, data)).data.data;

export const updateService = async (type, id, data) =>
  (await apiClient.put(`/admin/services/${servicePath(type)}/${id}`, data)).data.data;

export const deleteService = async (type, id) => {
  await apiClient.delete(`/admin/services/${servicePath(type)}/${id}`);
};

export const listAllSpaces = async ({ category } = {}) =>
  (await apiClient.get('/admin/campus/spaces', { params: pickParams({ category }) })).data.data;

export const createSpace = async (data) => (await apiClient.post('/admin/campus/spaces', data)).data.data;

export const updateSpace = async (id, data) => (await apiClient.put(`/admin/campus/spaces/${id}`, data)).data.data;

export const deleteSpace = async (id) => {
  await apiClient.delete(`/admin/campus/spaces/${id}`);
};

export const listAllPlans = async () => (await apiClient.get('/admin/campus/plans')).data.data;

export const getAdminPlan = async (id) => (await apiClient.get(`/admin/campus/plans/${id}`)).data.data;

export const createPlan = async (data) => (await apiClient.post('/admin/campus/plans', data, { timeout: 60000 })).data.data;

export const updatePlan = async (id, data) =>
  (await apiClient.put(`/admin/campus/plans/${id}`, data, { timeout: 60000 })).data.data;

export const deletePlan = async (id, confirmacion) =>
  (await apiClient.delete(`/admin/campus/plans/${id}/permanent`, { params: { confirmacion } })).data.message;

export const saveSpaceGeometry = async (spaceId, planoId, geometria) =>
  (await apiClient.put(`/admin/campus/spaces/${spaceId}/geometry`, { planoId, geometria })).data.data;

export const clearSpaceGeometry = async (spaceId) =>
  (await apiClient.delete(`/admin/campus/spaces/${spaceId}/geometry`)).data.data;

export const listSubjects = async ({ period } = {}) =>
  (await apiClient.get('/admin/academic/subjects', { params: pickParams({ period }) })).data.data;

export const createSubject = async (data) => (await apiClient.post('/admin/academic/subjects', data)).data.data;

export const updateSubject = async (id, data) =>
  (await apiClient.put(`/admin/academic/subjects/${id}`, data)).data.data;

export const deleteSubject = async (id) => {
  await apiClient.delete(`/admin/academic/subjects/${id}`);
};

export const listCalendarEvents = async ({ category } = {}) =>
  (await apiClient.get('/academic/calendar', { params: pickParams({ category }) })).data.data;

export const createCalendarEvent = async (data) => (await apiClient.post('/admin/academic/calendar', data)).data.data;

export const updateCalendarEvent = async (id, data) =>
  (await apiClient.put(`/admin/academic/calendar/${id}`, data)).data.data;

export const deleteCalendarEvent = async (id) => {
  await apiClient.delete(`/admin/academic/calendar/${id}`);
};
