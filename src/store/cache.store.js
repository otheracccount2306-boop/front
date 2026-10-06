import { create } from 'zustand';
import { loadCache, saveCache } from '../utils/storage.utils';

const EMPTY = { schedule: [], spaces: [], faq: [], calendar: [], plans: [] };

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
    const [schedule, spaces, faq, calendar, plans] = await Promise.all([
      loadCache('schedule'),
      loadCache('spaces'),
      loadCache('faq'),
      loadCache('calendar'),
      loadCache('plans'),
    ]);
    set({ schedule, spaces, faq, calendar, plans });
  },
  reset: () => set({ ...EMPTY, isOffline: false }),
}));

export default useCacheStore;
