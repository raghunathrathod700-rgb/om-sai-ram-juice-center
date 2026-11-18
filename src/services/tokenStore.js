/** Where the login token + cached user live (localStorage when "Remember me", else sessionStorage). */
import { KEYS, readJSON, removeKey, writeJSON } from './storage';

const TOKEN = 'osrjc:v3:token';
const USER = 'osrjc:v3:user';

const area = (persistent) => (persistent ? 'local' : 'session');

export const saveSession = (token, user, persistent) => {
  clearSession();
  writeJSON(TOKEN, token, area(persistent));
  writeJSON(USER, user, area(persistent));
};

export const updateCachedUser = (user) => {
  const persistent = readJSON(TOKEN, null, 'local') !== null;
  writeJSON(USER, user, area(persistent));
};

export const clearSession = () => {
  ['local', 'session'].forEach((a) => {
    removeKey(TOKEN, a);
    removeKey(USER, a);
  });
};

export const getToken = () => readJSON(TOKEN, null, 'session') || readJSON(TOKEN, null, 'local');
export const getCachedUser = () => readJSON(USER, null, 'session') || readJSON(USER, null, 'local');
export const REMEMBER_KEY = KEYS.remember;
