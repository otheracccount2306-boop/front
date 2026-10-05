import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import apiClient from '../client';
import { API_BASE_URL } from '../config';
import useAuthStore from '../../store/auth.store';
import useCacheStore from '../../store/cache.store';
import { STORAGE_KEYS } from '../../utils/storage.utils';

const REFRESH_URL = `${API_BASE_URL}/auth/refresh`;

describe('interceptor JWT', () => {
  let api;
  let refreshApi;

  beforeEach(async () => {
    api = new MockAdapter(apiClient);
    refreshApi = new MockAdapter(axios);
    await AsyncStorage.clear();
    await AsyncStorage.setItem(STORAGE_KEYS.jwt, 'viejo');
    await AsyncStorage.setItem(STORAGE_KEYS.refresh, 'refresh-valido');
    useAuthStore.setState({ user: { id: '1' }, isAuthenticated: true, sessionExpired: false });
    useCacheStore.getState().reset();
  });

  afterEach(() => {
    api.restore();
    refreshApi.restore();
  });

  test('adjunta el access token guardado como Bearer', async () => {
    api.onGet('/users/profile').reply((config) => [200, { data: config.headers.Authorization }]);

    const response = await apiClient.get('/users/profile');

    expect(response.data.data).toBe('Bearer viejo');
  });

  test('ante un 401 renueva el token y reintenta la solicitud original', async () => {
    api.onGet('/users/profile').reply((config) =>
      config.headers.Authorization === 'Bearer nuevo' ? [200, { data: 'ok' }] : [401, {}],
    );
    refreshApi.onPost(REFRESH_URL).reply(200, { success: true, data: { accessToken: 'nuevo' } });

    const response = await apiClient.get('/users/profile');

    expect(response.data.data).toBe('ok');
    expect(await AsyncStorage.getItem(STORAGE_KEYS.jwt)).toBe('nuevo');
    expect(JSON.parse(refreshApi.history.post[0].data)).toEqual({ refreshToken: 'refresh-valido' });
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  test('varios 401 simultáneos generan una sola renovación y todos se reintentan', async () => {
    api.onGet(/\/academic\/.*/).reply((config) =>
      config.headers.Authorization === 'Bearer nuevo' ? [200, { data: config.url }] : [401, {}],
    );
    refreshApi.onPost(REFRESH_URL).reply(() => new Promise((resolve) => setTimeout(() => resolve([200, { data: { accessToken: 'nuevo' } }]), 50)));

    const responses = await Promise.all([
      apiClient.get('/academic/schedule'),
      apiClient.get('/academic/calendar'),
      apiClient.get('/academic/other'),
    ]);

    expect(responses.map((response) => response.data.data)).toEqual([
      '/academic/schedule',
      '/academic/calendar',
      '/academic/other',
    ]);
    expect(refreshApi.history.post).toHaveLength(1);
  });

  test('si el refresh falla cierra la sesión: limpia el almacenamiento y marca sesión expirada', async () => {
    api.onGet('/users/profile').reply(401, {});
    refreshApi.onPost(REFRESH_URL).reply(401, { success: false });

    await expect(apiClient.get('/users/profile')).rejects.toBeDefined();

    expect(await AsyncStorage.getItem(STORAGE_KEYS.jwt)).toBeNull();
    expect(await AsyncStorage.getItem(STORAGE_KEYS.refresh)).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().sessionExpired).toBe(true);
  });

  test('sin refresh token guardado cierra la sesión sin llamar al servidor', async () => {
    await AsyncStorage.removeItem(STORAGE_KEYS.refresh);
    api.onGet('/users/profile').reply(401, {});

    await expect(apiClient.get('/users/profile')).rejects.toBeDefined();

    expect(refreshApi.history.post).toHaveLength(0);
    expect(useAuthStore.getState().sessionExpired).toBe(true);
  });

  test('el 401 de los endpoints /auth no intenta renovar el token', async () => {
    api.onPost('/auth/login').reply(401, { success: false, message: 'Credenciales inválidas' });

    await expect(apiClient.post('/auth/login', {})).rejects.toMatchObject({ response: { status: 401 } });

    expect(refreshApi.history.post).toHaveLength(0);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  test('los errores distintos de 401 se propagan sin tocar la sesión', async () => {
    api.onGet('/news').reply(500, {});

    await expect(apiClient.get('/news')).rejects.toMatchObject({ response: { status: 500 } });

    expect(refreshApi.history.post).toHaveLength(0);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
  });

  test('sin conexión responde con los datos de la caché y marca la app sin conexión', async () => {
    useCacheStore.setState({ schedule: [{ id: 'a', nombre: 'Cálculo' }] });
    api.onGet('/academic/schedule').networkError();

    const response = await apiClient.get('/academic/schedule');

    expect(response.data.data).toEqual([{ id: 'a', nombre: 'Cálculo' }]);
    expect(response.fromCache).toBe(true);
    expect(useCacheStore.getState().isOffline).toBe(true);
  });

  test('sin conexión y sin caché rechaza el error', async () => {
    api.onGet('/academic/schedule').networkError();

    await expect(apiClient.get('/academic/schedule')).rejects.toBeDefined();

    expect(useCacheStore.getState().isOffline).toBe(true);
  });

  test('una respuesta exitosa quita el estado sin conexión', async () => {
    useCacheStore.setState({ isOffline: true });
    api.onGet('/news').reply(200, { data: [] });

    await apiClient.get('/news');

    expect(useCacheStore.getState().isOffline).toBe(false);
  });

  test('si se pierde la conexión durante la renovación no cierra la sesión', async () => {
    api.onGet('/users/profile').reply(401, {});
    refreshApi.onPost(REFRESH_URL).networkError();

    await expect(apiClient.get('/users/profile')).rejects.toBeDefined();

    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    expect(await AsyncStorage.getItem(STORAGE_KEYS.refresh)).toBe('refresh-valido');
  });
});
