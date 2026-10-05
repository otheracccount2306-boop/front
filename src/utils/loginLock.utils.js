import { STORAGE_KEYS, getJson, removeItem, setJson } from './storage.utils';

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

/**
 * @description Lee el registro local de intentos de inicio de sesión fallidos. El backend no
 *              informa el bloqueo de una cuenta, así que la app lo aproxima contando los fallos.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {Promise<{ correo: string, count: number, lockedUntil: number|null }|null>} Registro guardado o null
 */
export const getLoginLock = async () => getJson(STORAGE_KEYS.loginLock);

/**
 * @description Registra un intento fallido de inicio de sesión. Al llegar a 5 intentos seguidos
 *              con el mismo correo marca el bloqueo por 15 minutos.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {string} correo - Correo con el que falló el inicio de sesión
 * @param {number} now - Marca de tiempo actual en milisegundos
 * @returns {Promise<{ correo: string, count: number, lockedUntil: number|null }>} Registro actualizado
 */
export const registerFailedAttempt = async (correo, now = Date.now()) => {
  const email = correo.trim().toLowerCase();
  const previous = await getLoginLock();
  const sameAccount = previous && previous.correo === email;
  const count = (sameAccount ? previous.count : 0) + 1;
  const record =
    count >= MAX_LOGIN_ATTEMPTS
      ? { correo: email, count: 0, lockedUntil: now + LOCK_MINUTES * 60 * 1000 }
      : { correo: email, count, lockedUntil: null };
  await setJson(STORAGE_KEYS.loginLock, record);
  return record;
};

/**
 * @description Elimina el registro local de intentos fallidos tras un inicio de sesión exitoso.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @returns {Promise<void>} Promesa resuelta al eliminar el registro
 */
export const clearLoginLock = async () => removeItem(STORAGE_KEYS.loginLock);

/**
 * @description Formatea los milisegundos restantes como mm:ss.
 * @author Doris Arzuaga <doris.arzuaga@campusucc.edu.co>
 * @param {number} milliseconds - Tiempo restante en milisegundos
 * @returns {string} Tiempo con formato mm:ss
 */
export const formatRemaining = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};
