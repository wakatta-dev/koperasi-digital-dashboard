/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { api, getTenantId } from "@/services/api";
import { getAccessToken, refreshToken, logout } from "@/services/auth";

vi.mock("@/services/auth", () => ({
  getAccessToken: vi.fn(),
  refreshToken: vi.fn(),
  logout: vi.fn(),
}));

const originalFetch = global.fetch;

describe("api service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "http://api.local";
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("retries with new token on 401", async () => {
    (getAccessToken as any).mockResolvedValue("old");
    (refreshToken as any).mockResolvedValue("new");

    global.fetch = vi
      .fn()
      .mockResolvedValueOnce({
        status: 401,
        ok: false,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ message: "unauthorized" }),
      })
      .mockResolvedValueOnce({
        status: 200,
        ok: true,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ success: true }),
      }) as any;

    const result = await api.get("/test");
    expect(global.fetch).toHaveBeenCalledTimes(2);
    const secondCall = (global.fetch as any).mock.calls[1];
    expect(secondCall[1].headers.get("Authorization")).toBe("Bearer new");
    expect(result).toEqual({ success: true });
  });

  it("calls logout when refreshToken fails", async () => {
    (getAccessToken as any).mockResolvedValue("old");
    (refreshToken as any).mockResolvedValue(null);

    global.fetch = vi
      .fn()
      .mockResolvedValue({
        status: 401,
        ok: false,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ error: "unauthorized" }),
      }) as any;

    const result = await api.get("/test");
    expect(result.success).toBe(false);
    expect(logout).toHaveBeenCalled();
  });

  it("returns error response for non-ok status", async () => {
    (getAccessToken as any).mockResolvedValue(null);

    global.fetch = vi
      .fn()
      .mockResolvedValue({
        status: 500,
        ok: false,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({ message: "boom" }),
      }) as any;

    const result = await api.get("/err");
    expect(result.success).toBe(false);
    expect(result.message).toBe("boom");
  });

  it("getTenantId reads from cookie", async () => {
    document.cookie = "tenantId=abc";
    const id = await getTenantId();
    expect(id).toBe("abc");
  });
});

