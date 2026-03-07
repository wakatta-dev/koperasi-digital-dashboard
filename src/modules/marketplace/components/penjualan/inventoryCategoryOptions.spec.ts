/** @format */

import { describe, expect, it } from "vitest";
import { selectableInventoryCategoryNames } from "./inventoryCategoryOptions";

describe("selectableInventoryCategoryNames", () => {
  it("returns only active categories for create flow", () => {
    expect(
      selectableInventoryCategoryNames([
        { id: 1, name: "Pangan", count: 4, is_active: true },
        { id: 2, name: "Kerajinan", count: 2, is_active: false },
      ])
    ).toEqual(["Pangan"]);
  });

  it("keeps the current category available for edit flow even when inactive", () => {
    expect(
      selectableInventoryCategoryNames(
        [
          { id: 1, name: "Pangan", count: 4, is_active: true },
          { id: 2, name: "Kerajinan", count: 2, is_active: false },
        ],
        "Kerajinan"
      )
    ).toEqual(["Pangan", "Kerajinan"]);
  });
});
