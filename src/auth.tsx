import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from './api';
import type { User } from './api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  sendCode: (email: string) => Promise<void>;
  verifyCode: (email: string, code: string) => Promise<void>;
  logout: () => void;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Using sessionStorage (not localStorage) — tokens are scoped to this tab and
    // cleared on close. httpOnly cookies via a BFF proxy would be ideal but adds
    // significant infrastructure complexity for marginal gain at current scale.
    const storedToken = sessionStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
      // Try to get user profile
      api.getProfile()
        .then((profile) => {
          // Map MeResponse to User interface
          const user: User = {
            id: profile.userId,
            email: profile.email,
            verified: true, // All users are verified now
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
    } else {
      setLoading(false);
    }
  }, []);

  const sendCode = async (email: string) => {
    await api.sendCode(email);
  };

  const verifyCode = async (email: string, code: string) => {
    const response = await api.verifyCode(email, code);
    // Create a user object from the response
    const user: User = {
      id: response.userId,
      email: response.email,
      verified: true, // All users are verified now with magic code auth
    };
    setUser(user);
    setToken(response.accessToken);
    // Using sessionStorage instead of localStorage for better security
    sessionStorage.setItem('access_token', response.accessToken);
    sessionStorage.setItem('refresh_token', response.refreshToken);
  };

  const logout = () => {
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