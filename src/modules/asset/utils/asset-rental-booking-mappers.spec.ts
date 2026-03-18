/** @format */

import { describe, expect, it } from "vitest";

import { splitAssetRentalBookings } from "./asset-rental-booking-mappers";

describe("splitAssetRentalBookings", () => {
  it("includes confirmed_dp bookings in rental rows", () => {
    const collections = splitAssetRentalBookings([
      {
        id: 1,
        asset_id: 9,
        asset_name: "Mobil Desa",
        renter_name: "Budi",
        renter_contact: "08123",
        start_time: 1742342400,
        end_time: 1742428800,
        status: "CONFIRMED_DP",
        total_amount: 500000,
      },
    ]);

    expect(collections.rentalRows).toHaveLength(1);
    expect(collections.rentalRows[0]?.status).toBe(
      "Menunggu Hari Pakai/Pengambilan"
    );
  });
});
