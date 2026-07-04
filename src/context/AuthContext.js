import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('dms_token'));
  const [mobileNumber, setMobileNumber] = useState(() => localStorage.getItem('dms_user') || '');

  const login = useCallback((newToken, mobile) => {
    localStorage.setItem('dms_token', newToken);
    localStorage.setItem('dms_user', mobile);
    setToken(newToken);
    setMobileNumber(mobile);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('dms_token');
    localStorage.removeItem('dms_user');
    setToken(null);
    setMobileNumber('');
  }, []);

  const value = {
    token,
    mobileNumber,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
