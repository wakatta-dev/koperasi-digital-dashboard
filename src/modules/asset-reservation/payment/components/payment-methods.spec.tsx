/** @format */
// @vitest-environment jsdom

import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PaymentMethods } from "./payment-methods";

const createPaymentSessionMock = vi.fn();
const uploadPaymentProofMock = vi.fn();

vi.mock("@/services/api/reservations", () => ({
  createPaymentSession: (...args: unknown[]) => createPaymentSessionMock(...args),
  uploadPaymentProof: (...args: unknown[]) => uploadPaymentProofMock(...args),
}));

const METHOD_GROUPS = [
  {
    title: "Transfer Bank",
    icon: "account_balance",
    options: [
      {
        value: "va_bca",
        label: "BCA Virtual Account",
      },
    ],
  },
] as const;

function successResponse(data: Record<string, unknown>) {
  return {
    success: true,
    message: "ok",
    data,
    meta: {
      request_id: "req-1",
      timestamp: new Date().toISOString(),
    },
    errors: null,
  };
}

describe("PaymentMethods", () => {
  beforeEach(() => {
    createPaymentSessionMock.mockReset();
    uploadPaymentProofMock.mockReset();
  });

  it("creates payment intent and shows instructions when flow is valid", async () => {
    createPaymentSessionMock.mockResolvedValue(
      successResponse({
        payment_id: "pay-1",
        reservation_id: 99,
        type: "dp",
        method: "va_bca",
        amount: 30000,
        pay_by: "2026-03-10T10:00:00Z",
        status: "initiated",
      })
    );

    render(
      <PaymentMethods
        mode="dp"
        methodGroups={METHOD_GROUPS}
        reservationId={99}
        ownershipToken="token-99"
      />
    );

    await waitFor(() => {
      expect(createPaymentSessionMock).toHaveBeenCalledWith({
        reservation_id: 99,
        type: "dp",
        method: "va_bca",
        ownership_token: "token-99",
      });
    });

    expect(screen.getByText("Jumlah yang harus dibayar")).toBeTruthy();
    expect(screen.getByText("Rp30.000")).toBeTruthy();
  });

  it("maps invalid raw session error to public-friendly text", async () => {
    createPaymentSessionMock.mockResolvedValue({
      success: false,
      message: "invalid input",
      data: null,
      meta: {
        request_id: "req-2",
        timestamp: new Date().toISOString(),
      },
      errors: {
        error: ["invalid input"],
      },
    });

    render(
      <PaymentMethods
        mode="dp"
        methodGroups={METHOD_GROUPS}
        reservationId={100}
        ownershipToken="token-100"
      />
    );

    expect(
      await screen.findByText(
        "Reservasi ini belum berada pada tahap pembayaran yang sesuai."
      )
    ).toBeTruthy();
  });
});
