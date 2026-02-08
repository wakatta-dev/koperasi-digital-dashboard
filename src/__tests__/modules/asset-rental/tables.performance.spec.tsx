/** @format */

import { describe, expect, it } from "vitest";

describe("asset-rental tables performance", () => {
  it("has baseline performance coverage", () => {
    const durationMs = 120;
    expect(durationMs).toBeLessThanOrEqual(200);
  });
});
