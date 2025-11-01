/** @format */

// @vitest-environment node

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";

vi.mock("@/services/auth", () => ({
  getAccessToken: vi.fn().mockResolvedValue(null),
  refreshToken: vi.fn().mockResolvedValue(null),
  logout: vi.fn().mockResolvedValue(undefined),
}));

const originalFetch = global.fetch;

describe("api base client", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://example.com";
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.fetch = originalFetch;
  });

  it("returns failure response when fetch fails", async () => {
    const { api } = await import("@/services/api/base");
    const message = "Server Error";
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: message,
      json: async () => ({ message }),
      headers: new Headers(),
    }) as any;

    const res = await api.get("/test");
    expect(res.success).toBe(false);
    expect(res.message).toBe(message);
    expect(res.data).toBeNull();
  });
});
