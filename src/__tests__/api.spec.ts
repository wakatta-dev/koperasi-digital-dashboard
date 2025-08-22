/** @format */

// @vitest-environment node
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { apiFetch } from "@/actions/api";

vi.mock("next-auth", () => ({
  getServerSession: vi.fn().mockResolvedValue({ user: {} }),
}));

const originalFetch = global.fetch;

describe("apiFetch", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_URL = "http://example.com";
  });

  afterEach(() => {
    vi.clearAllMocks();
    global.fetch = originalFetch;
  });

  it.each([
    [404, "Not Found"],
    [500, "Server Error"],
  ])("throws error for status %s", async (status, message) => {
    global.fetch = vi
      .fn()
      .mockResolvedValue({
        ok: false,
        status,
        json: async () => ({ message }),
      }) as any;

    const promise = apiFetch("/test");
    await expect(promise).rejects.toThrow(message);
    await promise.catch((err) => {
      expect((err as any).status).toBe(status);
    });
  });
});

