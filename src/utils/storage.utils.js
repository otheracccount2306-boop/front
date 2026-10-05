import AsyncStorage from '@react-native-async-storage/async-storage';

const PREFIX = '@ucc_orientacion/';

/**
 * @description Claves de AsyncStorage usadas por la aplicación, todas con el prefijo @ucc_orientacion/.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 */
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

/** Prefijo de las claves con el detalle de cada plano (imagen y polígonos), una por plano. */
const PLAN_DETAIL_PREFIX = `${PREFIX}cache_plan_`;

/**
 * @description Lee un texto de AsyncStorage sin lanzar errores.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} key - Clave de almacenamiento
 * @returns {Promise<string|null>} Valor guardado o null si no existe o falla la lectura
 */
export const getString = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch {
    return null;
  }
};

/**
 * @description Guarda un texto en AsyncStorage sin lanzar errores.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} key - Clave de almacenamiento
 * @param {string} value - Texto a guardar
 * @returns {Promise<void>} Promesa resuelta al terminar la escritura
 */
export const setString = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch {
    return;
  }
};

/**
 * @description Elimina una clave de AsyncStorage sin lanzar errores.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} key - Clave de almacenamiento
 * @returns {Promise<void>} Promesa resuelta al terminar la eliminación
 */
export const removeItem = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
    return;
  }
};

/**
 * @description Lee y deserializa un valor JSON de AsyncStorage.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} key - Clave de almacenamiento
 * @returns {Promise<any|null>} Valor deserializado o null si no existe o es inválido
 */
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

/**
 * @description Serializa y guarda un valor JSON en AsyncStorage.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {string} key - Clave de almacenamiento
 * @param {any} value - Valor serializable a guardar
 * @returns {Promise<void>} Promesa resuelta al terminar la escritura
 */
export const setJson = async (key, value) => {
  await setString(key, JSON.stringify(value));
};

/**
 * @description Guarda los datos de una caché y registra la marca de tiempo de la escritura
 *              en la clave cache_ts.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {'schedule'|'spaces'|'faq'|'calendar'|'plans'} name - Nombre de la caché
 * @param {Array} data - Datos a guardar
 * @returns {Promise<void>} Promesa resuelta al terminar la escritura
 */
export const saveCache = async (name, data) => {
  await setJson(CACHE_KEYS[name], data);
  const timestamps = (await getJson(STORAGE_KEYS.cacheTs)) || {};
  await setJson(STORAGE_KEYS.cacheTs, { ...timestamps, [name]: Date.now() });
};

/**
 * @description Lee los datos guardados de una caché.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @param {'schedule'|'spaces'|'faq'|'calendar'|'plans'} name - Nombre de la caché
 * @returns {Promise<Array>} Datos guardados o un arreglo vacío
 */
export const loadCache = async (name) => {
  const data = await getJson(CACHE_KEYS[name]);
  return Array.isArray(data) ? data : [];
};

/**
 * @description Guarda el detalle de un plano (imagen y polígonos) para mostrar el mapa sin
 *              conexión. Cada plano va en su propia clave para no superar el límite por registro
 *              de AsyncStorage en Android.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {Object} plan - Plano completo devuelto por GET /campus/plans/{id}
 * @returns {Promise<void>} Promesa resuelta al terminar la escritura
 */
export const savePlanDetail = async (plan) => {
  await setJson(`${PLAN_DETAIL_PREFIX}${plan.id}`, plan);
};

/**
 * @description Lee el detalle guardado de un plano.
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @param {string} id - Identificador del plano
 * @returns {Promise<Object|null>} Plano guardado, o null si no hay copia
 */
export const loadPlanDetail = async (id) => {
  const plan = await getJson(`${PLAN_DETAIL_PREFIX}${id}`);
  return plan && plan.id === id ? plan : null;
};

/**
 * @description Elimina todas las claves de la aplicación, incluidos los tokens JWT, el
 *              perfil y las cachés. Se usa al cerrar sesión o cuando la sesión expira.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @author Diego Luna <diego.luna@campusucc.edu.co>
 * @author Gabriela Zabaleta <gabriela.zabaleta@campusucc.edu.co>
 * @returns {Promise<void>} Promesa resuelta al terminar la limpieza
 */
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
