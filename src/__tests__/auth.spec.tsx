// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest';

const push = vi.fn();

vi.mock('next-auth/react', () => ({
  getSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push }),
}));

vi.mock('@/services/auth', async () => {
  const actual = await vi.importActual<any>('@/services/auth');
  return {
    ...actual,
    login: vi.fn(),
  };
});

import { render, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '@/components/shared/login-form';
import { LanguageProvider } from '@/contexts/language-context';
import { refreshAccessToken } from '@/lib/authOptions';
import { logout, login } from '@/services/auth';
import { getSession, signOut } from 'next-auth/react';
import React from 'react';

// fixtures based on docs/frontend/auth_flow.md
const loginFixture = {
  access_token: '<jwt>',
  refresh_token: '<token>'
};

const logoutFixture = { message: 'logged out' };

describe('auth flow', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to dashboard based on role after successful login', async () => {
    (login as any).mockResolvedValue(loginFixture);
    // session should provide jenis_tenant to match LoginForm logic
    (getSession as any).mockResolvedValue({ user: { jenis_tenant: 'umkm' } });

    const { getByLabelText, getByRole } = render(
      <LanguageProvider>
        <LoginForm />
      </LanguageProvider>
    );

    fireEvent.change(getByLabelText(/email/i), { target: { value: 'user@example.com' } });
    fireEvent.change(getByLabelText(/password/i), { target: { value: 'secret' } });
    fireEvent.click(getByRole('button'));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith('/umkm/dashboard');
    });
  });

  it('refreshAccessToken updates expired token', async () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const fakeJwt = `aaa.${Buffer.from(JSON.stringify({ exp })).toString('base64')}.bbb`;
    const token = { accessToken: 'old', refreshToken: 'old_refresh' } as any;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ data: { access_token: fakeJwt, refresh_token: 'new_refresh' } })
    }) as any;

    const refreshed = await refreshAccessToken(token);
    expect(refreshed.accessToken).toBe(fakeJwt);
    expect(refreshed.refreshToken).toBe('new_refresh');
    expect(refreshed.accessTokenExpires).toBe(exp * 1000);
  });

  it('logout clears refresh_token cookie and redirects to /login', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => logoutFixture }) as any;
    document.cookie = 'refresh_token=token';
    await logout();
    expect(document.cookie).not.toContain('refresh_token');
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: '/login' });
  });
});
