/**
 * Tiny safe wrapper around Web Storage. Services use this instead of touching
 * localStorage directly, so swapping to a real backend later is easy.
 */
const pick = (area) => (area === 'session' ? globalThis.sessionStorage : globalThis.localStorage);

export const readJSON = (key, fallback, area = 'local') => {
  try {
    const raw = pick(area)?.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJSON = (key, value, area = 'local') => {
  try {
    pick(area)?.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};

export const removeKey = (key, area = 'local') => {
  try {
    pick(area)?.removeItem(key);
  } catch {
    /* ignore */
  }
};

export const KEYS = {
  users: 'osrjc:v2:users',
  session: 'osrjc:v2:session',
  remember: 'osrjc:v2:remember',
  cart: 'osrjc:v2:cart',
  orders: 'osrjc:v2:orders',
  favourites: 'osrjc:v2:favourites',
};
