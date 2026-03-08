import React, { createContext, useContext, useState, useEffect } from 'react';
import * as db from '../services/localStorageDB';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed demo data on first visit
    db.seedIfNeeded();

    // Restore session
    const storedUser = db.getCurrentUser();
    if (storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const u = db.loginUser(email, password);
      const { password: _, ...safeUser } = u;
      setUser(safeUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, fullName) => {
    try {
      const u = db.createUser(email, password, fullName);
      db.setCurrentUser(u);
      const { password: _, ...safeUser } = u;
      setUser(safeUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    db.logoutUser();
    setUser(null);
    return { success: true };
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isConfigured: true,   // always configured — no backend needed
    demoMode: false,
    setDemoMode: () => { },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
