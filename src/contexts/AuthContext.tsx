import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { User, AuthState, LoginCredentials } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const ADMIN_EMAIL = 'admin@tsclean.fr';
const ADMIN_PASSWORD = 'admin123';
const AUTH_STORAGE_KEY = 'ts-clean-auth';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      return JSON.parse(savedAuth);
    }
    return {
      user: null,
      isAuthenticated: false,
      isLoading: false,
    };
  });

  // Persister l'état d'authentification
  useEffect(() => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authState));
  }, [authState]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (credentials.email === ADMIN_EMAIL && credentials.password === ADMIN_PASSWORD) {
        const user: User = {
          id: '1',
          email: credentials.email,
          role: 'admin',
        };
        
        setAuthState({
          user,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}