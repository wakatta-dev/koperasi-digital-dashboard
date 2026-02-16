/** @format */

import { describe, expect, it, vi } from "vitest";

const patchMock = vi.fn();

vi.mock("@/services/api/base", () => ({
  API_PREFIX: "/api",
  api: {
    patch: (...args: unknown[]) => patchMock(...args),
  },
}));

import { updateAssetBookingStatus } from "@/services/api/asset-rental";

describe("asset-rental reject payload parity", () => {
  it("sends rejection_reason when rejecting booking", async () => {
    patchMock.mockResolvedValueOnce({ success: true, data: null });

    await updateAssetBookingStatus(123, "REJECTED", "Tanggal bentrok");

    expect(patchMock).toHaveBeenCalledTimes(1);
    const [, payload] = patchMock.mock.calls[0] as [string, Record<string, string>];
    expect(payload).toMatchObject({
      status: "REJECTED",
      rejection_reason: "Tanggal bentrok",
    });
  });
});
