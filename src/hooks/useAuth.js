import { useCallback } from 'react';
import * as authApi from '../api/auth.api';
import useAuthStore from '../store/auth.store';
import useCacheStore from '../store/cache.store';
import { toFriendlyError } from '../utils/error.utils';
import { STORAGE_KEYS, clearAll, getJson, getString, setJson, setString } from '../utils/storage.utils';

/**
 * @description Restaura la sesión guardada en AsyncStorage al abrir la aplicación. Si existen el
 *              token y el perfil, rehidrata la caché y marca al usuario como autenticado.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {Promise<void>} Promesa resuelta cuando el estado de sesión quedó definido
 */
export const bootstrapSession = async () => {
  const [token, user] = await Promise.all([getString(STORAGE_KEYS.jwt), getJson(STORAGE_KEYS.user)]);
  if (token && user) {
    await useCacheStore.getState().hydrate();
    useAuthStore.getState().setUser(user);
  }
};

/**
 * @description Hook con las operaciones de autenticación y perfil. Guarda los tokens en
 *              AsyncStorage, mantiene el perfil en el store y traduce los errores del backend a
 *              mensajes amigables en español.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {{ user: Object|null, isAuthenticated: boolean, sessionExpired: boolean, login: Function, register: Function, logout: Function, requestRecovery: Function, loadProfile: Function, saveProfile: Function }} Estado de sesión y operaciones
 */
const useAuth = () => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const sessionExpired = useAuthStore((state) => state.sessionExpired);

  const login = useCallback(async (correo, contrasena) => {
    try {
      const data = await authApi.login(correo.trim().toLowerCase(), contrasena);
      await setString(STORAGE_KEYS.jwt, data.accessToken);
      await setString(STORAGE_KEYS.refresh, data.refreshToken);
      await setJson(STORAGE_KEYS.user, data.usuario);
      useAuthStore.getState().setUser(data.usuario);
      return data.usuario;
    } catch (error) {
      throw toFriendlyError(error, { 401: 'Credenciales incorrectas' });
    }
  }, []);

  const register = useCallback(async (values) => {
    try {
      return await authApi.register({
        nombre: values.nombre.trim(),
        apellido: values.apellido.trim(),
        correo: values.correo.trim().toLowerCase(),
        contrasena: values.contrasena,
        programaAcademico: values.programaAcademico.trim(),
        consentimientoDatos: true,
      });
    } catch (error) {
      throw toFriendlyError(error, { 409: 'El correo ya está registrado' });
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => null);
    await clearAll();
    useCacheStore.getState().reset();
    useAuthStore.getState().clearAuth();
  }, []);

  const requestRecovery = useCallback(async (correo) => {
    try {
      await authApi.requestPasswordRecovery(correo.trim().toLowerCase());
    } catch (error) {
      throw toFriendlyError(error);
    }
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      await setJson(STORAGE_KEYS.user, profile);
      useAuthStore.getState().setUser(profile);
      return profile;
    } catch (error) {
      throw toFriendlyError(error);
    }
  }, []);

  const saveProfile = useCallback(async (values) => {
    try {
      const profile = await authApi.updateProfile({
        nombre: values.nombre.trim(),
        apellido: values.apellido.trim(),
        programaAcademico: values.programaAcademico.trim(),
        telefono: values.telefono.trim(),
      });
      await setJson(STORAGE_KEYS.user, profile);
      useAuthStore.getState().setUser(profile);
      return profile;
    } catch (error) {
      throw toFriendlyError(error);
    }
  }, []);

  return { user, isAuthenticated, sessionExpired, login, register, logout, requestRecovery, loadProfile, saveProfile };
};

export default useAuth;
