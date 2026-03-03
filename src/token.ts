// Centralized token manager.
// Access token: kept in memory only (never touches storage).
// Refresh token: stored in an httpOnly cookie by the API (not readable by JS).

let accessToken: string | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function clearAllTokens(): void {
  accessToken = null;
}
