/** @format */

import { describe, expect, it } from "vitest";

import {
  computeAssetPublicActivationReadiness,
  mapApiAssetToListItem,
} from "./stitch-contract-mappers";

describe("asset public activation readiness", () => {
  it("reports missing requirements for draft internal asset", () => {
    const readiness = computeAssetPublicActivationReadiness({
      id: 1,
      name: "Balai Desa",
      status: "ACTIVE",
      availability_status: "Draft Internal",
      category: "Bangunan",
      rate_type: "DAILY",
      rate_amount: 0,
      location: "",
      description: "",
      photo_url: "",
    });

    expect(readiness.ready).toBe(false);
    expect(readiness.reasons).toContain("Pilih lokasi aset");
    expect(readiness.reasons).toContain("Lengkapi deskripsi aset");
    expect(readiness.reasons).toContain("Unggah gambar aset");
    expect(readiness.reasons).toContain("Isi tarif sewa aset");
  });

  it("maps active asset without public availability to draft internal list item", () => {
    const item = mapApiAssetToListItem({
      id: 2,
      name: "Proyektor",
      status: "ACTIVE",
      availability_status: "Draft Internal",
      category: "Aset Per Jam",
      rate_type: "HOURLY",
      rate_amount: 100000,
      location: "Gudang Utama",
      description: "Siap dipakai untuk kegiatan warga",
      photo_url: "https://cdn.example.com/proyektor.jpg",
    });

    expect(item.status).toBe("Draft Internal");
    expect(item.internalLifecycle).toBe("Aktif");
    expect(item.publicReady).toBe(true);
  });
});
