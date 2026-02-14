/** @format */

import { describe, expect, it } from "vitest";

import { resolveApiBaseUrl } from "@/services/api/base";

describe("resolveApiBaseUrl", () => {
  it("normalizes trailing /api suffix", () => {
    expect(
      resolveApiBaseUrl("http://localhost:8080/api", { isBrowser: false })
    ).toBe("http://localhost:8080");
  });

  it("aligns API host with browser host in local non-production runtime", () => {
    expect(
      resolveApiBaseUrl("http://192.168.1.4:8080", {
        isBrowser: true,
        origin: "http://localhost:3004",
        nodeEnv: "development",
      })
    ).toBe("http://localhost:8080");
  });

  it("keeps original API host in production runtime", () => {
    expect(
      resolveApiBaseUrl("http://192.168.1.4:8080", {
        isBrowser: true,
        origin: "http://localhost:3004",
        nodeEnv: "production",
      })
    ).toBe("http://192.168.1.4:8080");
  });
});
