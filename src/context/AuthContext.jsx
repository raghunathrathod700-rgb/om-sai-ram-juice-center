import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => authService.getCurrentUser());

  // Backend mode: confirm the saved login with the server once when the site opens.
  useEffect(() => {
    let active = true;
    authService.refreshUser().then((fresh) => {
      if (active) setUser(fresh);
    });
    return () => {
      active = false;
    };
  }, []);

  // Keep several browser tabs in sync, and log out when the server says the token expired.
  useEffect(() => {
    const onStorage = () => setUser(authService.getCurrentUser());
    const onUnauthorized = () => {
      authService.logout();
      setUser(null);
    };
    window.addEventListener('storage', onStorage);
    window.addEventListener('osrjc:unauthorized', onUnauthorized);
    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('osrjc:unauthorized', onUnauthorized);
    };
  }, []);

  const login = useCallback(async (credentials) => {
    const loggedIn = await authService.login(credentials);
    setUser(loggedIn);
    return loggedIn;
  }, []);

  const register = useCallback(async (data) => {
    const created = await authService.register(data);
    setUser(created);
    return created;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  const updateUser = useCallback(async (updates) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: !!user, isAdmin: user?.role === 'ADMIN', login, register, logout, updateUser }),
    [user, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
