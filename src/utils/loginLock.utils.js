import { STORAGE_KEYS, getJson, removeItem, setJson } from './storage.utils';

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_MINUTES = 15;

export const getLoginLock = async () => getJson(STORAGE_KEYS.loginLock);

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

export const clearLoginLock = async () => removeItem(STORAGE_KEYS.loginLock);

export const formatRemaining = (milliseconds) => {
  const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};
