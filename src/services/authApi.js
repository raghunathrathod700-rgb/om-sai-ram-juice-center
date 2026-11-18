/** AUTH against the Spring Boot backend (JWT). Passwords are checked/hashed on the server. */
import { KEYS, readJSON, removeKey, writeJSON } from './storage';
import { http } from './http';
import { clearSession, getCachedUser, saveSession, updateCachedUser } from './tokenStore';

export const register = async ({ fullName, mobile, email, password, address }) => {
  const { token, user } = await http.post('/api/auth/register', { fullName, mobile, email, password, address });
  saveSession(token, user, true);
  return user;
};

export const login = async ({ identifier, password, rememberMe }) => {
  const { token, user } = await http.post('/api/auth/login', { identifier: identifier.trim(), password });
  saveSession(token, user, !!rememberMe);
  if (rememberMe) writeJSON(KEYS.remember, identifier.trim());
  else removeKey(KEYS.remember);
  return user;
};

export const logout = () => clearSession();
export const getCurrentUser = () => getCachedUser();

/** Asks the server who we are (also detects an expired token). Returns null when logged out. */
export const refreshUser = async () => {
  if (!getCachedUser()) return null;
  try {
    const user = await http.get('/api/auth/me');
    updateCachedUser(user);
    return user;
  } catch (err) {
    if (err.status === 401) {
      clearSession();
      return null;
    }
    return getCachedUser(); // server temporarily unreachable: keep the cached user
  }
};

export const updateProfile = async ({ fullName, email, mobile, address }) => {
  const user = await http.put('/api/auth/me', { fullName, email, mobile, address });
  updateCachedUser(user);
  return user;
};

export const accountExists = () => false;
export const resetPassword = async () => {
  throw new Error('Password reset is done by the shop. Please contact us.');
};
export const getRememberedIdentifier = () => readJSON(KEYS.remember, '');
