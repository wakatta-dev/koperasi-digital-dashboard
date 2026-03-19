/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type { ApiResponse } from "@/types/api";
import type {
  AssetRentalBooking,
  AssetRentalFinancialResolutionRequest,
  AssetRentalPaymentClassificationRequest,
} from "@/types/api/asset-rental";
import type { ReservationDetailResponse } from "@/types/api/reservation";

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
  bookingId: string | number,
  payload?: {
    return_condition?: string;
    return_condition_notes?: string;
  }
): Promise<ApiResponse<AssetRentalBooking>> {
  const body: Record<string, string> = {};
  if (payload?.return_condition?.trim()) {
    body.return_condition = payload.return_condition.trim();
  }
  if (payload?.return_condition_notes?.trim()) {
    body.return_condition_notes = payload.return_condition_notes.trim();
  }
  return api.patch<AssetRentalBooking>(
    `${API_PREFIX}${API_ENDPOINTS.assetReservation.bookingComplete(bookingId)}`,
    Object.keys(body).length > 0 ? body : undefined
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

export function classifyAssetRentalPayment(
  bookingId: string | number,
  payload: AssetRentalPaymentClassificationRequest
): Promise<ApiResponse<ReservationDetailResponse>> {
  return api.patch<ReservationDetailResponse>(
    `${API_PREFIX}${API_ENDPOINTS.assetReservation.bookingPaymentClassification(
      bookingId
    )}`,
    payload
  );
}

export function resolveAssetRentalFinancialOutcome(
  bookingId: string | number,
  payload: AssetRentalFinancialResolutionRequest
): Promise<ApiResponse<ReservationDetailResponse>> {
  return api.patch<ReservationDetailResponse>(
    `${API_PREFIX}${API_ENDPOINTS.assetReservation.bookingFinancialResolution(
      bookingId
    )}`,
    payload
  );
}
