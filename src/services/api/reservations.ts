/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  AvailabilityCheckApiResponse,
  AvailabilityCheckRequest,
  CreateReservationApiResponse,
  CreateReservationRequest,
  GuestLinkVerifyApiResponse,
  PaymentSessionApiResponse,
  PaymentSessionRequest,
  ReservationDetailApiResponse,
} from "@/types/api/reservation";

const E = API_ENDPOINTS.assetReservation;

export function checkAvailability(
  payload: AvailabilityCheckRequest
): Promise<AvailabilityCheckApiResponse> {
  return api.post<AvailabilityCheckApiResponse["data"]>(`${API_PREFIX}${E.availability}`, payload);
}

export function createReservation(
  payload: CreateReservationRequest
): Promise<CreateReservationApiResponse> {
  return api.post<CreateReservationApiResponse["data"]>(`${API_PREFIX}${E.reservations}`, payload);
}

export function getReservation(reservationId: string): Promise<ReservationDetailApiResponse> {
  return api.get<ReservationDetailApiResponse["data"]>(`${API_PREFIX}${E.reservation(reservationId)}`);
}

export function createPaymentSession(
  payload: PaymentSessionRequest
): Promise<PaymentSessionApiResponse> {
  return api.post<PaymentSessionApiResponse["data"]>(`${API_PREFIX}${E.payments}`, payload);
}

export function uploadPaymentProof(paymentId: string, file: File): Promise<PaymentSessionApiResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return api.post<PaymentSessionApiResponse["data"]>(`${API_PREFIX}${E.paymentProof(paymentId)}`, formData);
}

export function finalizePayment(
  paymentId: string,
  result: "succeeded" | "failed"
): Promise<PaymentSessionApiResponse> {
  return api.post<PaymentSessionApiResponse["data"]>(`${API_PREFIX}${E.paymentFinalize(paymentId)}`, {
    status: result,
  });
}

export function verifyGuestLink(params: {
  reservationId?: string;
  token?: string;
}): Promise<GuestLinkVerifyApiResponse> {
  const search = new URLSearchParams();
  if (params.reservationId) search.set("reservationId", params.reservationId);
  if (params.token) search.set("token", params.token);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<GuestLinkVerifyApiResponse["data"]>(`${API_PREFIX}${E.guestVerify}${query}`);
}
