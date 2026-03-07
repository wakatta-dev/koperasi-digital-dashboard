/** @format */

import { describe, expect, it } from "vitest";
import { toFormOptionGroups } from "./use-asset-master-data";

describe("toFormOptionGroups", () => {
  it("filters inactive asset master data from form options", () => {
    expect(
      toFormOptionGroups({
        categories: [
          { id: 1, kind: "CATEGORY", value: "Aset Harian", sort_order: 1, is_active: true },
          { id: 2, kind: "CATEGORY", value: "Aset Lama", sort_order: 2, is_active: false },
        ],
        locations: [
          { id: 3, kind: "LOCATION", value: "Gudang A", sort_order: 1, is_active: true },
          { id: 4, kind: "LOCATION", value: "Gudang Lama", sort_order: 2, is_active: false },
        ],
        statuses: [
          { id: 5, kind: "STATUS", value: "Tersedia", sort_order: 1, is_active: true },
          { id: 6, kind: "STATUS", value: "Legacy", sort_order: 2, is_active: false },
        ],
      })
    ).toEqual({
      categories: ["Aset Harian"],
      locations: ["Gudang A"],
      statuses: ["Tersedia"],
    });
  });
});
