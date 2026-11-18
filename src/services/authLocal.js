/**
 * AUTH SERVICE — FRONTEND DEMO ONLY
 * ---------------------------------------------------------------------
 * ⚠️ Browser storage is NOT secure. This only lets the demo shop work
 * without a server. Passwords are salted + SHA-256 hashed (Web Crypto) so
 * they are never stored as plain text, but real security needs a backend:
 *   • bcrypt/argon2 hashing on the server, JWT / HttpOnly cookie sessions
 *   • rate limiting, OTP verification, HTTPS
 * Every component uses ONLY the functions exported here, so replacing this
 * file with real API calls (fetch('/api/auth/login') …) needs no other change.
 * ---------------------------------------------------------------------
 */
import { KEYS, readJSON, removeKey, writeJSON } from './storage';

const toHex = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');

const randomSalt = () => {
  const bytes = new Uint8Array(16);
  if (globalThis.crypto?.getRandomValues) globalThis.crypto.getRandomValues(bytes);
  else for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
  return toHex(bytes);
};

const hashPassword = async (password, salt) => {
  const data = new TextEncoder().encode(`${salt}:${password}`);
  if (globalThis.crypto?.subtle) {
    const digest = await globalThis.crypto.subtle.digest('SHA-256', data);
    return toHex(new Uint8Array(digest));
  }
  // Very old / insecure-context fallback (http on a LAN IP): weak, demo only.
  let h = 5381;
  data.forEach((byte) => {
    h = ((h << 5) + h + byte) >>> 0;
  });
  return `weak-${h.toString(16)}`;
};

const readUsers = () => readJSON(KEYS.users, []);
const writeUsers = (users) => writeJSON(KEYS.users, users);

// eslint-disable-next-line no-unused-vars
const toSafeUser = ({ passwordHash, salt, ...user }) => user;

const findByIdentifier = (users, identifier = '') => {
  const id = identifier.trim().toLowerCase();
  return users.find((u) => u.email.toLowerCase() === id || u.mobile === id);
};

const setSession = (userId, persistent) => {
  removeKey(KEYS.session, 'local');
  removeKey(KEYS.session, 'session');
  writeJSON(KEYS.session, { userId }, persistent ? 'local' : 'session');
};

export const register = async ({ fullName, mobile, email, password, address }) => {
  const users = readUsers();
  if (users.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }
  if (users.some((u) => u.mobile === mobile.trim())) {
    throw new Error('An account with this mobile number already exists.');
  }
  const salt = randomSalt();
  const user = {
    id: `USR-${Date.now().toString(36)}${Math.floor(Math.random() * 1000)}`,
    fullName: fullName.trim(),
    mobile: mobile.trim(),
    email: email.trim(),
    address: address.trim(),
    salt,
    passwordHash: await hashPassword(password, salt),
    createdAt: new Date().toISOString(),
  };
  writeUsers([...users, user]);
  setSession(user.id, true);
  return toSafeUser(user);
};

export const login = async ({ identifier, password, rememberMe }) => {
  const user = findByIdentifier(readUsers(), identifier);
  if (!user || (await hashPassword(password, user.salt)) !== user.passwordHash) {
    throw new Error('Invalid email/mobile or password.');
  }
  setSession(user.id, !!rememberMe);
  if (rememberMe) writeJSON(KEYS.remember, identifier.trim());
  else removeKey(KEYS.remember);
  return toSafeUser(user);
};

export const logout = () => {
  removeKey(KEYS.session, 'local');
  removeKey(KEYS.session, 'session');
};

export const getCurrentUser = () => {
  const session = readJSON(KEYS.session, null, 'session') || readJSON(KEYS.session, null, 'local');
  if (!session?.userId) return null;
  const user = readUsers().find((u) => u.id === session.userId);
  return user ? toSafeUser(user) : null;
};

export const updateProfile = ({ fullName, email, mobile, address }) => {
  const current = getCurrentUser();
  if (!current) throw new Error('Please login again.');
  const users = readUsers();
  if (users.some((u) => u.id !== current.id && u.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error('This email is already used by another account.');
  }
  if (users.some((u) => u.id !== current.id && u.mobile === mobile.trim())) {
    throw new Error('This mobile number is already used by another account.');
  }
  const idx = users.findIndex((u) => u.id === current.id);
  users[idx] = {
    ...users[idx],
    fullName: fullName.trim(),
    email: email.trim(),
    mobile: mobile.trim(),
    address: address.trim(),
  };
  writeUsers(users);
  return toSafeUser(users[idx]);
};

/** DEMO "forgot password": there is no email/SMS server, so the reset happens on the spot. */
export const accountExists = (identifier) => !!findByIdentifier(readUsers(), identifier);

export const resetPassword = async ({ identifier, newPassword }) => {
  const users = readUsers();
  const user = findByIdentifier(users, identifier);
  if (!user) throw new Error('No account found with this email / mobile number.');
  const salt = randomSalt();
  user.salt = salt;
  user.passwordHash = await hashPassword(newPassword, salt);
  writeUsers(users);
};

export const getRememberedIdentifier = () => readJSON(KEYS.remember, '');
