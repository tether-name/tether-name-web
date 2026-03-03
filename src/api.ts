import { getAccessToken, setAccessToken } from './token';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const COOKIE_SESSION_HEADERS = {
  'X-Tether-Session-Mode': 'cookie',
};

export interface User {
  email: string;
  verified: boolean;
}

export interface Agent {
  id: string;
  agentName: string;
  description: string;
  domainId?: string;
  domain?: string | null;
  createdAt: number;
  lastVerifiedAt: number;
}

export interface Domain {
  id: string;
  domain: string;
  verified: boolean;
  verifiedAt: number;
  lastCheckedAt: number;
  createdAt: number;
}

export interface ClaimDomainResponse {
  id: string;
  domain: string;
  txtRecord: string;
  txtHost: string;
  instructions: string;
}

export interface ApiKeyCreateResponse {
  id: string;
  key: string;
  name: string;
  keyPrefix: string;
  expiresAt: string | null;
  createdAt: string;
}

export interface ApiKeyListItem {
  id: string;
  name: string;
  keyPrefix: string;
  expiresAt: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  revoked: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
}

export interface MeResponse {
  email: string;
  createdAt: number;
}

export class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export async function refreshTokens(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...COOKIE_SESSION_HEADERS,
      },
    });

    if (!response.ok) {
      return false;
    }

    const data = await response.json();
    setAccessToken(data.accessToken ?? null);
    return true;
  } catch {
    return false;
  }
}

async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const makeRequest = async (): Promise<Response> => {
    const token = getAccessToken();

    const headers = new Headers(options.headers ?? undefined);

    // If we're sending a body and caller didn't specify content-type, default to JSON.
    if (options.body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    if (token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    const config: RequestInit = {
      ...options,
      credentials: 'include',
      headers,
    };

    return fetch(`${API_BASE_URL}${endpoint}`, config);
  };

  let response = await makeRequest();
  
  if (response.status === 401 && endpoint !== '/auth/refresh') {
    const refreshSuccess = await refreshTokens();
    if (refreshSuccess) {
      response = await makeRequest();
    }
  }
  
  if (!response.ok) {
    let errorMessage = 'Request failed';
    try {
      const body = await response.text();
      const parsed = JSON.parse(body);
      errorMessage = parsed.message || parsed.error || body || errorMessage;
    } catch {
      // If not JSON, keep default
    }
    throw new ApiError(response.status, errorMessage);
  }
  
  return response.json();
}

export const api = {
  // Auth endpoints
  sendCode: (email: string) =>
    apiRequest<{ message: string }>('/auth/send-code', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  verifyCode: (email: string, code: string) =>
    apiRequest<AuthResponse>('/auth/verify-code', {
      method: 'POST',
      headers: {
        ...COOKIE_SESSION_HEADERS,
      },
      body: JSON.stringify({ email, code }),
    }),

  exchangeCode: (token: string) =>
    apiRequest<AuthResponse>('/auth/exchange-code', {
      method: 'POST',
      headers: {
        ...COOKIE_SESSION_HEADERS,
      },
      body: JSON.stringify({ token }),
    }),

  refreshToken: () =>
    apiRequest<{accessToken: string, refreshToken: string}>('/auth/refresh', {
      method: 'POST',
      headers: {
        ...COOKIE_SESSION_HEADERS,
      },
    }),

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        ...COOKIE_SESSION_HEADERS,
      },
    });

    if (!response.ok) {
      throw new ApiError(response.status, 'Logout failed');
    }

    return response.json() as Promise<{ message: string }>;
  },

  // User endpoints
  getProfile: () =>
    apiRequest<MeResponse>('/auth/me'),

  // Agent endpoints
  issueAgent: (agentName: string, description: string, domainId?: string) =>
    apiRequest<{ id: string; agentName: string; description: string; domainId?: string; createdAt: number; registrationToken: string }>('/agents/issue', {
      method: 'POST',
      body: JSON.stringify({ agentName, description, ...(domainId ? { domainId } : {}) }),
    }),

  getAgentStatus: (id: string) =>
    apiRequest<{ id: string; agentName: string; registered: boolean }>(`/agents/${id}/status`),

  registerKey: async (id: string, registrationToken: string, publicKey: string) => {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const response = await fetch(`${API_BASE_URL}/agents/${id}/register-key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ registrationToken, publicKey }),
    });
    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new ApiError(response.status, body.error || 'Key registration failed');
    }
    return response.json() as Promise<{ id: string; agentName: string; registered: boolean }>;
  },

  getAgents: () =>
    apiRequest<Agent[]>('/agents'),

  deleteAgent: (id: string) =>
    apiRequest<{ message: string }>(`/agents/${id}`, {
      method: 'DELETE',
    }),

  // Challenge endpoints
  generateChallenge: () =>
    apiRequest<{ code: string }>('/challenge', { method: 'POST' }),

  verifyChallenge: (challenge: string, proof: string, agentId: string) =>
    apiRequest<{ valid: boolean; verifyUrl?: string; email?: string; registeredSince?: number; agentName?: string }>('/challenge/verify', {
      method: 'POST',
      body: JSON.stringify({ challenge, proof, agentId }),
    }),

  // API Key endpoints
  createApiKey: (name: string, expiresInDays?: number) =>
    apiRequest<ApiKeyCreateResponse>('/api-keys', {
      method: 'POST',
      body: JSON.stringify({ name, ...(expiresInDays !== undefined && { expiresInDays }) }),
    }),

  getApiKeys: () =>
    apiRequest<ApiKeyListItem[]>('/api-keys'),

  revokeApiKey: (id: string) =>
    apiRequest<{ message: string }>(`/api-keys/${id}`, {
      method: 'DELETE',
    }),

  // Domain endpoints
  claimDomain: (domain: string) =>
    apiRequest<ClaimDomainResponse>('/domains/claim', {
      method: 'POST',
      body: JSON.stringify({ domain }),
    }),

  verifyDomain: (id: string) =>
    apiRequest<{ verified: boolean; domain: string; message: string; txtHost?: string; txtRecord?: string }>(`/domains/${id}/verify`, {
      method: 'POST',
    }),

  getDomains: () =>
    apiRequest<Domain[]>('/domains'),

  deleteDomain: (id: string) =>
    apiRequest<{ message: string }>(`/domains/${id}`, {
      method: 'DELETE',
    }),

  getStats: () =>
    apiRequest<{ totalVerifications: number; totalAgentsRegistered: number; totalDomainsVerified: number }>('/stats'),

  getChallengeStatus: (code: string) =>
    apiRequest<{
      challenge: string;
      status: 'pending' | 'verified' | 'invalid' | 'not_found';
      createdAt?: number;
      agentName?: string;
      email?: string;
      domain?: string;
      registeredSince?: number;
      verifiedAt?: number;
      poll?: { intervalMs: number; maxAttempts: number };
    }>(`/challenge/${encodeURIComponent(code)}`),
};
