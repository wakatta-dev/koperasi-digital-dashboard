/** @format */

// @vitest-environment node
vi.mock("next-auth/jwt", () => ({
  getToken: vi.fn(),
}));

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { middleware } from "@/middleware";
import { getToken } from "next-auth/jwt";

function createRequest(
  path: string,
  opts: { tenantId?: string; host?: string } = {}
) {
  const url = `http://${opts.host ?? "example.com"}${path}`;
  const cookies = {
    get: (name: string) =>
      name === "tenantId" && opts.tenantId
        ? { value: opts.tenantId }
        : undefined,
  };
  return {
    nextUrl: new URL(url),
    headers: new Headers({ host: opts.host ?? "example.com" }),
    cookies,
    url,
  } as any;
}

const originalFetch = global.fetch;

describe("middleware", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_API_URL = "http://api.local";
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("injects tenant id from cookie", async () => {
    (getToken as any).mockResolvedValue(null);
    const req = createRequest("/dashboard", { tenantId: "123" });
    const res = await middleware(req);
    expect(res.headers.get("X-Tenant-ID")).toBe("123");
    expect(res.cookies.get("tenantId")?.value).toBe("123");
  });

  it("looks up tenant by domain when cookie missing", async () => {
    (getToken as any).mockResolvedValue(null);
    global.fetch = vi
      .fn()
      .mockResolvedValue({
        ok: true,
        json: async () => ({ data: { tenant_id: 42 } }),
      }) as any;
    const req = createRequest("/dashboard", { host: "foo.com" });
    const res = await middleware(req);
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      "http://api.local/api/tenant/by-domain?domain=foo.com",
      { headers: { "Content-Type": "application/json" } }
    );
    expect(res.headers.get("X-Tenant-ID")).toBe("42");
    expect(res.cookies.get("tenantId")?.value).toBe("42");
  });

  it("redirects to tenant-not-found when lookup fails", async () => {
    (getToken as any).mockResolvedValue(null);
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as any;
    const req = createRequest("/dashboard", { host: "foo.com" });
    const res = await middleware(req);
    expect(res.headers.get("location")).toContain("/tenant-not-found");
  });

  it("redirects to login when accessing protected route without token", async () => {
    (getToken as any).mockResolvedValue(null);
    const req = createRequest("/umkm/dashboard", { tenantId: "1" });
    const res = await middleware(req);
    expect(res.headers.get("location")).toBe(
      "http://example.com/login?redirect=%2Fumkm%2Fdashboard"
    );
  });
});

