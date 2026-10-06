import apiClient from './client';

export const register = async (payload) => (await apiClient.post('/auth/register', payload)).data.data;

export const login = async (correo, contrasena) =>
  (await apiClient.post('/auth/login', { correo, contrasena })).data.data;

export const logout = async () => {
  await apiClient.post('/auth/logout');
};

export const requestPasswordRecovery = async (correo) => {
  await apiClient.post('/auth/password-recovery', { correo });
};

export const resetPassword = async (token, nuevaContrasena) => {
  await apiClient.post('/auth/password-reset', { token, nuevaContrasena });
};

export const getProfile = async () => (await apiClient.get('/users/profile')).data.data;

export const updateProfile = async (payload) => (await apiClient.put('/users/profile', payload)).data.data;
