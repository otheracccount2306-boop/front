import AsyncStorage from '@react-native-async-storage/async-storage';
import useAuthStore from '../auth.store';
import useCacheStore from '../cache.store';
import { STORAGE_KEYS, clearAll, loadCache, setString } from '../../utils/storage.utils';

describe('auth.store', () => {
  test('setUser autentica y limpia el aviso de sesión expirada; clearAuth cierra la sesión', () => {
    useAuthStore.setState({ user: null, isAuthenticated: false, sessionExpired: true });

    useAuthStore.getState().setUser({ id: '1', nombre: 'Juan' });
    expect(useAuthStore.getState()).toMatchObject({ isAuthenticated: true, sessionExpired: false });

    useAuthStore.getState().clearAuth();
    expect(useAuthStore.getState()).toMatchObject({ user: null, isAuthenticated: false });
  });

  test('el store nunca guarda tokens', () => {
    expect(Object.keys(useAuthStore.getState()).join(',')).not.toMatch(/token|jwt|refresh/i);
  });
});

describe('cache.store', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    useCacheStore.getState().reset();
  });

  test('setSchedule guarda en el store y en AsyncStorage con marca de tiempo', async () => {
    useCacheStore.getState().setSchedule([{ id: 'a' }]);

    expect(useCacheStore.getState().schedule).toEqual([{ id: 'a' }]);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(await loadCache('schedule')).toEqual([{ id: 'a' }]);
    expect(JSON.parse(await AsyncStorage.getItem(STORAGE_KEYS.cacheTs)).schedule).toEqual(expect.any(Number));
  });

  test('hydrate rehidrata las cuatro cachés desde AsyncStorage', async () => {
    await AsyncStorage.setItem(STORAGE_KEYS.cacheSpaces, JSON.stringify([{ id: 's' }]));
    await AsyncStorage.setItem(STORAGE_KEYS.cacheFaq, JSON.stringify([{ id: 'f' }]));

    await useCacheStore.getState().hydrate();

    expect(useCacheStore.getState()).toMatchObject({ spaces: [{ id: 's' }], faq: [{ id: 'f' }], schedule: [], calendar: [] });
  });

  test('loadCache ignora datos corruptos', async () => {
    await setString(STORAGE_KEYS.cacheFaq, '{no es json');
    expect(await loadCache('faq')).toEqual([]);
  });
});

describe('storage', () => {
  test('clearAll elimina tokens, perfil y cachés pero conserva el registro de bloqueo de login', async () => {
    await AsyncStorage.multiSet([
      [STORAGE_KEYS.jwt, 'a'],
      [STORAGE_KEYS.refresh, 'b'],
      [STORAGE_KEYS.user, '{}'],
      [STORAGE_KEYS.cacheSchedule, '[]'],
      [STORAGE_KEYS.loginLock, '{"count":2}'],
    ]);

    await clearAll();

    expect(await AsyncStorage.getAllKeys()).toEqual([STORAGE_KEYS.loginLock]);
  });
});
