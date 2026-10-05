import { create } from 'zustand';

/**
 * @description Store Zustand de la sesión. Guarda únicamente el perfil básico del usuario y
 *              el estado de autenticación; los tokens viven solo en AsyncStorage.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  sessionExpired: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user), sessionExpired: false }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
  setSessionExpired: (sessionExpired) => set({ sessionExpired }),
}));

export default useAuthStore;
