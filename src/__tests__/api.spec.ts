/** @format */

// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

let apiFetch: typeof import("@/actions/api").apiFetch;

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: {} }),
}));

const originalFetch = global.fetch;

describe("apiFetch", () => {
  beforeEach(async () => {
    process.env.NEXT_PUBLIC_API_URL = "http://example.com";
    process.env.NEXTAUTH_URL = "http://localhost:3000";
    process.env.NEXTAUTH_SECRET = "secret";
    process.env.NEXTAUTH_URL_INTERNAL = "http://localhost:3000";
    vi.resetModules();
    ({ apiFetch } = await import("@/actions/api"));
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.fetch = originalFetch;
  });

  it.each([
    [404, "Not Found"],
    [500, "Server Error"],
  ])("returns null for status %s", async (status, message) => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status,
      statusText: message,
      json: async () => ({ message }),
    }) as any;

    const result = await apiFetch("/test");
    expect(result).toBeNull();
  });
});
