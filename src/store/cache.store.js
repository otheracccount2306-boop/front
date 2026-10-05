import { create } from 'zustand';
import { loadCache, saveCache } from '../utils/storage.utils';

const EMPTY = { schedule: [], spaces: [], faq: [], calendar: [] };

/**
 * @description Store Zustand de la caché de datos (horario, espacios, preguntas frecuentes y
 *              calendario). Cada escritura se persiste en AsyncStorage y se puede rehidratar al
 *              abrir la aplicación. También guarda si la app está sin conexión.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
const useCacheStore = create((set) => ({
  ...EMPTY,
  isOffline: false,
  setCacheData: (name, data) => {
    saveCache(name, data);
    set({ [name]: data });
  },
  setSchedule: (data) => useCacheStore.getState().setCacheData('schedule', data),
  setSpaces: (data) => useCacheStore.getState().setCacheData('spaces', data),
  setFaq: (data) => useCacheStore.getState().setCacheData('faq', data),
  setCalendar: (data) => useCacheStore.getState().setCacheData('calendar', data),
  setOffline: (isOffline) => set({ isOffline }),
  hydrate: async () => {
    const [schedule, spaces, faq, calendar] = await Promise.all([
      loadCache('schedule'),
      loadCache('spaces'),
      loadCache('faq'),
      loadCache('calendar'),
    ]);
    set({ schedule, spaces, faq, calendar });
  },
  reset: () => set({ ...EMPTY, isOffline: false }),
}));

export default useCacheStore;
