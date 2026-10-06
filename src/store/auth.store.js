import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  sessionExpired: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user), sessionExpired: false }),
  clearAuth: () => set({ user: null, isAuthenticated: false }),
  setSessionExpired: (sessionExpired) => set({ sessionExpired }),
}));

export default useAuthStore;
