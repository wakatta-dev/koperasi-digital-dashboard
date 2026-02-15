/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type { AssetRentalBooking } from "@/types/api/asset-rental";

const BOOKINGS_ENDPOINT = `${API_PREFIX}${API_ENDPOINTS.assetReservation.bookings}`;

export function getAssetRentalBookings(params?: {
  status?: string;
}): Promise<ApiResponse<AssetRentalBooking[]>> {
  const search = new URLSearchParams();
  if (params?.status) {
    search.set("status", params.status);
  }
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<AssetRentalBooking[]>(`${BOOKINGS_ENDPOINT}${query}`);
}

export function completeAssetBooking(
  bookingId: string | number
): Promise<ApiResponse<AssetRentalBooking>> {
  return api.patch<AssetRentalBooking>(
    `${API_PREFIX}${API_ENDPOINTS.assetReservation.bookingComplete(bookingId)}`
  );
}

export function updateAssetBookingStatus(
  bookingId: string | number,
  status: string,
  rejectionReason?: string
): Promise<ApiResponse<AssetRentalBooking>> {
  const payload: Record<string, string> = { status };
  if (rejectionReason && rejectionReason.trim()) {
    payload.rejection_reason = rejectionReason.trim();
  }
  return api.patch<AssetRentalBooking>(
    `${API_PREFIX}${API_ENDPOINTS.assetReservation.bookingStatus(bookingId)}`,
    payload
  );
}
