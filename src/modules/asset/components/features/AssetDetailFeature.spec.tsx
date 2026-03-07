/** @format */

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AssetDetailFeature } from "./AssetDetailFeature";

describe("AssetDetailFeature", () => {
  it("renders public readiness guidance for incomplete assets", () => {
    render(
      <AssetDetailFeature
        detail={{
          assetId: "1",
          name: "Balai Desa",
          photoUrl: "",
          assetTag: "AST-001",
          status: "Draft Internal",
          internalLifecycle: "Aktif",
          publicReady: false,
          publicReadinessIssues: ["Unggah gambar aset", "Lengkapi deskripsi aset"],
          category: "Bangunan",
          location: "Gudang Utama",
          summaryCards: [],
          specifications: [],
          activityRows: [],
        }}
      />,
    );

    expect(screen.getByText("Belum siap untuk publik")).toBeTruthy();
    expect(screen.getByText("Unggah gambar aset")).toBeTruthy();
    expect(screen.getByText("Lengkapi deskripsi aset")).toBeTruthy();
  });
});
