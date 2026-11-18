/** USER SERVICE — favourites + profile (swap for /api/users later). */
import { getCurrentUser, updateProfile } from './authService';
import { KEYS, readJSON, writeJSON } from './storage';

export const getProfile = () => getCurrentUser();
export const saveProfile = (updates) => updateProfile(updates);

export const loadFavourites = () => readJSON(KEYS.favourites, []);
export const saveFavourites = (ids) => writeJSON(KEYS.favourites, ids);
