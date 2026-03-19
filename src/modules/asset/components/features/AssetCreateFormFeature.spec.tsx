/** @format */

import { describe, expect, it } from "vitest";

import { resolveCreateAssetStatusOption } from "./AssetCreateFormFeature";

describe("resolveCreateAssetStatusOption", () => {
  it("prefers Draft Internal when available", () => {
    expect(
      resolveCreateAssetStatusOption(["Tersedia", "Draft Internal", "Maintenance"])
    ).toBe("Draft Internal");
  });

  it("returns empty string when Draft Internal is unavailable", () => {
    expect(resolveCreateAssetStatusOption(["Tersedia", "Maintenance"])).toBe("");
  });
});
