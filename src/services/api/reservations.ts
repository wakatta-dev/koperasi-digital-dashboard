/** @format */

import { API_PREFIX, api } from "./base";
import { API_ENDPOINTS } from "@/constants/api";
import type {
  AvailabilityCheckApiResponse,
  AvailabilityCheckResponse,
  AvailabilityCheckRequest,
  CreateReservationApiResponse,
  CreateReservationResponse,
  CreateReservationRequest,
  GuestLinkVerifyApiResponse,
  GuestLinkVerifyResponse,
  PaymentSessionApiResponse,
  PaymentSessionResponse,
  PaymentSessionRequest,
  ReservationDetailApiResponse,
  ReservationDetailResponse,
} from "@/types/api/reservation";

const E = API_ENDPOINTS.assetReservation;

export function checkAvailability(
  payload: AvailabilityCheckRequest
): Promise<AvailabilityCheckApiResponse> {
  return api.post<AvailabilityCheckResponse>(`${API_PREFIX}${E.availability}`, payload);
}

export function createReservation(
  payload: CreateReservationRequest
): Promise<CreateReservationApiResponse> {
  return api.post<CreateReservationResponse>(`${API_PREFIX}${E.reservations}`, payload);
}

export function getReservation(
  reservationId: string | number,
  ownershipToken?: string
): Promise<ReservationDetailApiResponse> {
  const search = new URLSearchParams();
  if (ownershipToken) search.set("token", ownershipToken);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<ReservationDetailResponse>(
    `${API_PREFIX}${E.reservation(String(reservationId))}${query}`
  );
}

export function createPaymentSession(
  payload: PaymentSessionRequest
): Promise<PaymentSessionApiResponse> {
  return api.post<PaymentSessionResponse>(`${API_PREFIX}${E.payments}`, payload);
}

export function uploadPaymentProof(
  paymentId: string,
  file: File,
  note?: string,
  ownership?: { reservationId?: number; ownershipToken?: string }
): Promise<PaymentSessionApiResponse> {
  const formData = new FormData();
  formData.append("file", file);
  if (note && note.trim()) formData.append("note", note.trim());
  if (ownership?.reservationId) {
    formData.append("reservation_id", String(ownership.reservationId));
  }
  if (ownership?.ownershipToken) {
    formData.append("ownership_token", ownership.ownershipToken);
  }
  return api.post<PaymentSessionResponse>(`${API_PREFIX}${E.paymentProof(paymentId)}`, formData);
}

export function finalizePayment(
  paymentId: string,
  result: "succeeded" | "failed",
  ownership?: { reservationId?: number; ownershipToken?: string }
): Promise<PaymentSessionApiResponse> {
  return api.post<PaymentSessionResponse>(`${API_PREFIX}${E.paymentFinalize(paymentId)}`, {
    status: result,
    reservation_id: ownership?.reservationId,
    ownership_token: ownership?.ownershipToken,
  });
}

export function verifyGuestLink(params: {
  reservationId?: number;
  token?: string;
}): Promise<GuestLinkVerifyApiResponse> {
  const search = new URLSearchParams();
  if (params.reservationId) search.set("reservationId", String(params.reservationId));
  if (params.token) search.set("token", params.token);
  const query = search.toString() ? `?${search.toString()}` : "";
  return api.get<GuestLinkVerifyResponse>(`${API_PREFIX}${E.guestVerify}${query}`);
}

export function lookupReservationByTicket(
  ticket: string,
  contact: string
): Promise<ReservationDetailApiResponse> {
  const search = new URLSearchParams();
  search.set("ticket", ticket);
  search.set("contact", contact);
  return api.get<ReservationDetailResponse>(
    `${API_PREFIX}${E.reservationLookup}?${search.toString()}`
  );
}
