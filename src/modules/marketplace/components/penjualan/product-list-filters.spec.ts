import { describe, expect, it } from "vitest";

import { parseOptionalPriceFilter } from "./product-list-filters";

describe("parseOptionalPriceFilter", () => {
  it("returns undefined for empty values", () => {
    expect(parseOptionalPriceFilter("")).toBeUndefined();
    expect(parseOptionalPriceFilter("   ")).toBeUndefined();
  });

  it("returns parsed numbers for filled values", () => {
    expect(parseOptionalPriceFilter("0")).toBe(0);
    expect(parseOptionalPriceFilter("15000")).toBe(15000);
    expect(parseOptionalPriceFilter(" 2500 ")).toBe(2500);
  });

  it("returns undefined for invalid numeric values", () => {
    expect(parseOptionalPriceFilter("abc")).toBeUndefined();
  });
});
