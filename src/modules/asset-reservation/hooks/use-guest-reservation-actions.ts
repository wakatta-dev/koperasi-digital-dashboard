/** @format */

import { useMutation } from "@tanstack/react-query";

import {
  createPaymentSession,
  createReservation,
  finalizePayment,
  lookupReservationByTicket,
  uploadPaymentProof,
} from "@/services/api/reservations";
import type {
  CreateReservationRequest,
  PaymentSessionRequest,
  ReservationDetailResponse,
} from "@/types/api/reservation";

export function useLookupReservationByTicket() {
  return useMutation({
    mutationFn: async (args: {
      ticket: string;
      contact: string;
    }): Promise<ReservationDetailResponse> => {
      const res = await lookupReservationByTicket(args.ticket, args.contact);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memuat status pengajuan");
      }
      return res.data;
    },
  });
}

export function useCreateGuestReservation() {
  return useMutation({
    mutationFn: async (payload: CreateReservationRequest) => {
      const res = await createReservation(payload);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal membuat pengajuan");
      }
      return res.data;
    },
  });
}

export function useCreateGuestPaymentSession() {
  return useMutation({
    mutationFn: async (payload: PaymentSessionRequest) => {
      const res = await createPaymentSession(payload);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal membuat sesi pembayaran");
      }
      return res.data;
    },
  });
}

export function useUploadGuestPaymentProof() {
  return useMutation({
    mutationFn: async (args: {
      paymentId: string;
      file: File;
      note?: string;
      reservationId?: number;
      ownershipToken?: string;
    }) => {
      const res = await uploadPaymentProof(args.paymentId, args.file, args.note, {
        reservationId: args.reservationId,
        ownershipToken: args.ownershipToken,
      });
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal mengunggah bukti pembayaran");
      }
      return res.data;
    },
  });
}

export function useFinalizeGuestPayment() {
  return useMutation({
    mutationFn: async (args: {
      paymentId: string;
      status: "succeeded" | "failed";
      reservationId?: number;
      ownershipToken?: string;
    }) => {
      const res = await finalizePayment(args.paymentId, args.status, {
        reservationId: args.reservationId,
        ownershipToken: args.ownershipToken,
      });
      if (!res.success || !res.data) {
        throw new Error(res.message || "Gagal memproses pembayaran");
      }
      return res.data;
    },
  });
}
