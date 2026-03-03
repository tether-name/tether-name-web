/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { api, refreshTokens } from './api';
import type { User } from './api';
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
  hasRefreshToken,
  clearAllTokens,
} from './token';

interface AuthContextType {
  user: User | null;
  token: string | null;
  sendCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  exchangeMagicToken: (token: string) => Promise<void>;
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
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(() => hasRefreshToken());

  useEffect(() => {
    if (!hasRefreshToken()) {
      return;
    }

    // Silently restore session: refresh token → new access token → profile
    refreshTokens()
      .then((ok) => {
        if (!ok) throw new Error('refresh failed');
        setToken(getAccessToken());
        return api.getProfile();
      })
      .then((profile) => {
        setUser({ email: profile.email, verified: true });
      })
      .catch(() => {
        clearAllTokens();
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const sendCode = async (email: string) => {
    await api.sendCode(email);
  };

  const applyAuthResponse = (response: { accessToken: string; refreshToken: string; email: string }) => {
    const user: User = {
      email: response.email,
      verified: true,
    };
    setUser(user);
    setAccessToken(response.accessToken);
    setRefreshToken(response.refreshToken);
    setToken(response.accessToken);
  };

  const verifyCode = async (email: string, code: string) => {
    const response = await api.verifyCode(email, code);
    applyAuthResponse(response);
  };

  const exchangeMagicToken = async (token: string) => {
    const response = await api.exchangeCode(token);
    applyAuthResponse(response);
  };

  const logout = async () => {
    const refreshToken = getRefreshToken();

    if (refreshToken) {
      try {
        await api.logout(refreshToken);
      } catch {
        // Best-effort revoke. Always clear local session even if network fails.
      }
    }

    setUser(null);
    setToken(null);
    clearAllTokens();
  };

  return (
    <AuthContext.Provider value={{ user, token, sendCode, verifyCode, exchangeMagicToken, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
