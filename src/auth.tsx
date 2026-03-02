/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import type { User } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  sendCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => sessionStorage.getItem('access_token'));
  const [loading, setLoading] = useState<boolean>(() => !!sessionStorage.getItem('access_token'));

  useEffect(() => {
    // Using sessionStorage (not localStorage) — tokens are scoped to this tab and
    // cleared on close. httpOnly cookies via a BFF proxy would be ideal but adds
    // significant infrastructure complexity for marginal gain at current scale.
    if (!token) {
      return;
    }

    // Try to get user profile
    api.getProfile()
      .then((profile) => {
        // Map MeResponse to User interface
        const user: User = {
          email: profile.email,
          verified: true,
        };
        setUser(user);
      })
      .catch(() => {
        // Token is invalid, clear both tokens
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const sendCode = async (email: string) => {
    await api.sendCode(email);
  };

  const verifyCode = async (email: string, code: string) => {
    const response = await api.verifyCode(email, code);
    // Create a user object from the response
    const user: User = {
      email: response.email,
      verified: true,
    };
    setUser(user);
    setToken(response.accessToken);
    // Using sessionStorage instead of localStorage for better security
    sessionStorage.setItem('access_token', response.accessToken);
    sessionStorage.setItem('refresh_token', response.refreshToken);
  };

  const logout = async () => {
    const refreshToken = sessionStorage.getItem('refresh_token');

    if (refreshToken) {
      try {
        await api.logout(refreshToken);
      } catch {
        // Best-effort revoke. Always clear local session even if network fails.
      }
    }

    setUser(null);
    setToken(null);
    // Clear tokens from sessionStorage
    sessionStorage.removeItem('access_token');
    sessionStorage.removeItem('refresh_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, sendCode, verifyCode, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}