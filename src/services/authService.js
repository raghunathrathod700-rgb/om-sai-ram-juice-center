/**
 * AUTH SERVICE — one interface, two engines:
 *   USE_API false -> authLocal.js (browser demo)      USE_API true -> authApi.js (Spring Boot + JWT)
 * Components only import from this file.
 */
import { USE_API } from '../config/shop';
import * as api from './authApi';
import * as local from './authLocal';

const impl = USE_API ? api : local;

export const passwordResetAvailable = !USE_API;
export const register = (data) => impl.register(data);
export const login = (credentials) => impl.login(credentials);
export const logout = () => impl.logout();
export const getCurrentUser = () => impl.getCurrentUser();
export const refreshUser = () => (USE_API ? api.refreshUser() : Promise.resolve(local.getCurrentUser()));
export const updateProfile = async (updates) => impl.updateProfile(updates);
export const accountExists = (identifier) => impl.accountExists(identifier);
export const resetPassword = (data) => impl.resetPassword(data);
export const getRememberedIdentifier = () => impl.getRememberedIdentifier();
