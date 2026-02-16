/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PaymentMethods } from "@/modules/asset-reservation/payment/components/payment-methods";

const createPaymentSessionMock = vi.fn();
const finalizePaymentMock = vi.fn();
const uploadPaymentProofMock = vi.fn();

vi.mock("@/services/api/reservations", () => ({
  createPaymentSession: (...args: unknown[]) => createPaymentSessionMock(...args),
  finalizePayment: (...args: unknown[]) => finalizePaymentMock(...args),
  uploadPaymentProof: (...args: unknown[]) => uploadPaymentProofMock(...args),
}));

const methodGroups = [
  {
    title: "Virtual Account",
    icon: "account_balance",
    options: [{ value: "va_bca", label: "BCA Virtual Account", badge: "Otomatis" }],
  },
] as const;

beforeEach(() => {
  createPaymentSessionMock.mockReset();
  finalizePaymentMock.mockReset();
  uploadPaymentProofMock.mockReset();

  createPaymentSessionMock.mockResolvedValue({
    success: true,
    data: {
      payment_id: "pay-123",
      reservation_id: 11,
      amount: 30000,
      type: "dp",
      method: "va_bca",
      pay_by: "2026-02-20T10:00:00Z",
      status: "initiated",
    },
  });
});

describe("asset-rental payment integrity", () => {
  it("does not switch to success state when finalize response is not successful", async () => {
    finalizePaymentMock.mockResolvedValue({
      success: false,
      message: "Backend gagal memproses pembayaran",
    });

    render(
      <PaymentMethods
        mode="dp"
        reservationId={11}
        ownershipToken="v1.2000000000.signature"
        methodGroups={methodGroups}
      />
    );

    await waitFor(() => {
      expect(createPaymentSessionMock).toHaveBeenCalled();
    });

    const payNowButton = await screen.findByRole("button", { name: /bayar sekarang/i });
    fireEvent.click(payNowButton);

    await waitFor(() => {
      expect(finalizePaymentMock).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText(/Backend gagal memproses pembayaran/i)).toBeTruthy();
    expect(screen.getByText("Menunggu tindakan")).toBeTruthy();
  });
});
