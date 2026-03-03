// Centralized token manager.
// Access token: kept in memory only (never touches storage).
// Refresh token: sessionStorage (survives page refresh, scoped to tab).

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getRefreshToken(): string | null {
  return sessionStorage.getItem('refresh_token');
}

export function setRefreshToken(token: string | null): void {
  if (token) {
    sessionStorage.setItem('refresh_token', token);
  } else {
    sessionStorage.removeItem('refresh_token');
  }
}

export function hasRefreshToken(): boolean {
  return sessionStorage.getItem('refresh_token') !== null;
}

export function clearAllTokens(): void {
  accessToken = null;
  sessionStorage.removeItem('refresh_token');
}
