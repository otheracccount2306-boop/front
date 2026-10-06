import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@ucc_orientacion/';

export const STORAGE_KEYS = {
  jwt: `${PREFIX}jwt`,
  refresh: `${PREFIX}refresh`,
  user: `${PREFIX}user`,
  cacheSchedule: `${PREFIX}cache_schedule`,
  cacheSpaces: `${PREFIX}cache_spaces`,
  cacheFaq: `${PREFIX}cache_faq`,
  cacheCalendar: `${PREFIX}cache_calendar`,
  cachePlans: `${PREFIX}cache_plans`,
  cacheTs: `${PREFIX}cache_ts`,
  loginLock: `${PREFIX}login_lock`,
};

const CACHE_KEYS = {
  schedule: STORAGE_KEYS.cacheSchedule,
  spaces: STORAGE_KEYS.cacheSpaces,
  faq: STORAGE_KEYS.cacheFaq,
  calendar: STORAGE_KEYS.cacheCalendar,
  plans: STORAGE_KEYS.cachePlans,
};

const PLAN_DETAIL_PREFIX = `${PREFIX}cache_plan_`;

export const getString = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
};

export const setString = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    return;
  }
};

export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    return;
  }
};

export const getJson = async (key) => {
  const raw = await getString(key);
  if (raw === null) {
    return null;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setJson = async (key, value) => {
  await setString(key, JSON.stringify(value));
};

export const saveCache = async (name, data) => {
  await setJson(CACHE_KEYS[name], data);
  const timestamps = (await getJson(STORAGE_KEYS.cacheTs)) || {};
  await setJson(STORAGE_KEYS.cacheTs, { ...timestamps, [name]: Date.now() });
};

export const loadCache = async (name) => {
  const data = await getJson(CACHE_KEYS[name]);
  return Array.isArray(data) ? data : [];
};

export const savePlanDetail = async (plan) => {
  await setJson(`${PLAN_DETAIL_PREFIX}${plan.id}`, plan);
};

export const loadPlanDetail = async (id) => {
  const plan = await getJson(`${PLAN_DETAIL_PREFIX}${id}`);
  return plan && plan.id === id ? plan : null;
};

export const clearAll = async () => {
  const keys = Object.values(STORAGE_KEYS).filter((key) => key !== STORAGE_KEYS.loginLock);
  try {
    const stored = await AsyncStorage.getAllKeys();
    const planKeys = (stored || []).filter((key) => key.startsWith(PLAN_DETAIL_PREFIX));
    await AsyncStorage.multiRemove([...keys, ...planKeys]);
  } catch {
    return;
  }
};
