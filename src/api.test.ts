import { beforeEach, describe, expect, it, vi } from 'vitest';

const tokenState = {
  accessToken: null as string | null,
};

vi.mock('./token', () => ({
  getAccessToken: () => tokenState.accessToken,
  setAccessToken: (token: string | null) => {
    tokenState.accessToken = token;
  },
}));

import { api, refreshTokens } from './api';

describe('api auth smoke', () => {
  beforeEach(() => {
    tokenState.accessToken = null;
    vi.restoreAllMocks();
  });

  it('verifyCode sends JSON content-type plus cookie-session header', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ accessToken: 'a', refreshToken: '', email: 'owner@example.com' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await api.verifyCode('owner@example.com', '123456');

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, init] = fetchMock.mock.calls[0];
    const headers = new Headers(init?.headers);

    expect(init?.method).toBe('POST');
    expect(init?.credentials).toBe('include');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('X-Tether-Session-Mode')).toBe('cookie');
  });

  it('exchangeCode sends JSON content-type plus cookie-session header', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(JSON.stringify({ accessToken: 'a', refreshToken: '', email: 'owner@example.com' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    await api.exchangeCode('magic-token');

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, init] = fetchMock.mock.calls[0];
    const headers = new Headers(init?.headers);

    expect(init?.method).toBe('POST');
    expect(init?.credentials).toBe('include');
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('X-Tether-Session-Mode')).toBe('cookie');
  });

  it('retries authenticated request once after refresh succeeds', async () => {
    tokenState.accessToken = 'expired-token';

    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      // first protected call -> 401
      .mockResolvedValueOnce(new Response('unauthorized', { status: 401 }))
      // refresh call -> success with new access token
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ accessToken: 'new-token' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      )
      // retried protected call -> success
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ email: 'owner@example.com', createdAt: 123 }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    const profile = await api.getProfile();

    expect(profile.email).toBe('owner@example.com');
    expect(fetchMock).toHaveBeenCalledTimes(3);

    const [firstUrl, firstInit] = fetchMock.mock.calls[0];
    const [refreshUrl] = fetchMock.mock.calls[1];
    const [retryUrl, retryInit] = fetchMock.mock.calls[2];

    expect(String(firstUrl)).toContain('/auth/me');
    expect(String(refreshUrl)).toContain('/auth/refresh');
    expect(String(retryUrl)).toContain('/auth/me');

    const firstHeaders = new Headers(firstInit?.headers);
    const retryHeaders = new Headers(retryInit?.headers);

    expect(firstHeaders.get('Authorization')).toBe('Bearer expired-token');
    expect(retryHeaders.get('Authorization')).toBe('Bearer new-token');
  });

  it('refreshTokens returns false on 401 and does not throw', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(new Response('unauthorized', { status: 401 }));

    await expect(refreshTokens()).resolves.toBe(false);
  });
});
