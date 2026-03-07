/** @format */

import { describe, expect, it } from "vitest";

import {
  resolvePublicAssetErrorMessage,
  resolvePublicAssetStatusPresentation,
} from "./public-catalog";

describe("public asset catalog helpers", () => {
  it("does not leak internal draft labels into public catalog status", () => {
    expect(
      resolvePublicAssetStatusPresentation({
        status: "ACTIVE",
        availability_status: "Draft Internal",
      }),
    ).toEqual({
      label: "Tidak tersedia",
      tone: "busy",
    });
  });

  it("maps public availability to public-safe labels", () => {
    expect(
      resolvePublicAssetStatusPresentation({
        status: "ACTIVE",
        availability_status: "Tersedia",
      }),
    ).toEqual({
      label: "Tersedia",
      tone: "available",
    });

    expect(
      resolvePublicAssetStatusPresentation({
        status: "ACTIVE",
        availability_status: "Maintenance",
      }),
    ).toEqual({
      label: "Maintenance",
      tone: "maintenance",
    });
  });

  it("maps not found style errors to a public-safe message", () => {
    expect(resolvePublicAssetErrorMessage("asset not found")).toBe(
      "Aset tidak tersedia untuk katalog publik.",
    );
  });

  it("returns no error message when detail load is healthy", () => {
    expect(resolvePublicAssetErrorMessage(null)).toBeNull();
    expect(resolvePublicAssetErrorMessage("")).toBeNull();
  });
});
