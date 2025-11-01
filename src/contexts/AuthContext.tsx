import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, User } from '@/lib/api';
import { useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const authRoutes = ["/login", "/signup"]

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const location = useLocation()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);


  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      setUser(response.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(authRoutes.includes(location.pathname)) return
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await authAPI.login({ email, password });
    setUser(response.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await authAPI.signup({ name, email, password });
    setUser(response.user);
  };

  const logout = async () => {
    await authAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, signup, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};