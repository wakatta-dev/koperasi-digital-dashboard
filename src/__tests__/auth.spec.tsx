/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";

const push = vi.fn();

vi.mock("next-auth/react", () => ({
  getSession: vi.fn(),
  signOut: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
  // emulate Next.js useSearchParams hook
  useSearchParams: () => new URLSearchParams(""),
}));

vi.mock("@/services/auth", async () => {
  const actual = await vi.importActual<any>("@/services/auth");
  return {
    ...actual,
    login: vi.fn(),
  };
});

let LoginForm: typeof import("@/components/shared/login-form").LoginForm;
let LanguageProvider: typeof import("@/contexts/language-context").LanguageProvider;
let refreshAccessToken: typeof import("@/lib/authOptions").refreshAccessToken;
let logout: typeof import("@/services/auth").logout;
let login: typeof import("@/services/auth").login;
let refreshToken: typeof import("@/services/auth").refreshToken;
let getSession: typeof import("next-auth/react").getSession;
let signOut: typeof import("next-auth/react").signOut;

beforeEach(async () => {
  process.env.NEXT_PUBLIC_API_URL = "http://example.com";
  process.env.NEXTAUTH_URL = "http://localhost:3000";
  process.env.NEXTAUTH_SECRET = "secret";
  process.env.NEXTAUTH_URL_INTERNAL = "http://localhost:3000";
  vi.resetModules();
  LoginForm = (await import("@/components/shared/login-form")).LoginForm;
  LanguageProvider = (await import("@/contexts/language-context"))
    .LanguageProvider;
  refreshAccessToken = (await import("@/lib/authOptions")).refreshAccessToken;
  ({ logout, login, refreshToken } = await import("@/services/auth"));
  ({ getSession, signOut } = await import("next-auth/react"));
});

// fixtures based on docs/frontend/auth_flow.md
const loginFixture = {
  access_token: "<jwt>",
  refresh_token: "<token>",
};

const logoutFixture = { message: "logged out" };

describe("auth flow", () => {
  afterEach(() => {
    vi.clearAllMocks();
    document.cookie =
      "refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  });

  it("redirects to dashboard based on role after successful login", async () => {
    (login as any).mockResolvedValue(loginFixture);
    (getSession as any).mockResolvedValue({ user: { jenis_tenant: "umkm" } });

    const { getByLabelText, getByRole } = render(
      <LanguageProvider>
        <LoginForm />
      </LanguageProvider>
    );

    fireEvent.change(getByLabelText(/email/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(getByLabelText(/password/i), {
      target: { value: "secret" },
    });
    fireEvent.click(getByRole("button"));

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/umkm/account");
    });
  });

  it("refreshAccessToken updates expired token", async () => {
    const exp = Math.floor(Date.now() / 1000) + 3600;
    const fakeJwt = `aaa.${Buffer.from(JSON.stringify({ exp })).toString(
      "base64"
    )}.bbb`;
    const token = { accessToken: "old", refreshToken: "old_refresh" } as any;

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { access_token: fakeJwt, refresh_token: "new_refresh" },
      }),
    }) as any;

    const refreshed = await refreshAccessToken(token);
    expect(refreshed.accessToken).toBe(fakeJwt);
    expect(refreshed.refreshToken).toBe("new_refresh");
  });

  it("refreshToken returns new access token and updates cookie", async () => {
    document.cookie = "refresh_token=old";

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        data: { access_token: "new_access", refresh_token: "new_refresh" },
      }),
    }) as any;

    const token = await refreshToken();
    expect(token).toBe("new_access");
    expect(document.cookie).toContain("refresh_token=new_refresh");
    const call = (fetch as any).mock.calls[0];
    expect(call[0]).toContain("/api/auth/refresh");
    expect(call[1].body).toBe(JSON.stringify({ refresh_token: "old" }));
  });

  it("refreshToken returns null on failure", async () => {
    document.cookie = "refresh_token=old";

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({}),
    }) as any;

    const token = await refreshToken();
    expect(token).toBeNull();
    expect(document.cookie).toContain("refresh_token=old");
  });

  it("logout clears refresh_token cookie and redirects to /login", async () => {
    global.fetch = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => logoutFixture }) as any;
    document.cookie = "refresh_token=token";
    await logout();
    expect(document.cookie).not.toContain("refresh_token");
    expect(signOut).toHaveBeenCalledWith({ callbackUrl: "/login" });
  });
});
