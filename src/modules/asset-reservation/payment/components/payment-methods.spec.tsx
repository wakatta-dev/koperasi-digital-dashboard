/** @format */
// @vitest-environment jsdom

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
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

  it("uploads valid proof and switches status to pending verification", async () => {
    createPaymentSessionMock.mockResolvedValue(
      successResponse({
        payment_id: "pay-2",
        reservation_id: 101,
        type: "dp",
        method: "va_bca",
        amount: 30000,
        pay_by: "2026-03-10T10:00:00Z",
        status: "initiated",
      })
    );
    uploadPaymentProofMock.mockResolvedValue(
      successResponse({
        payment_id: "pay-2",
        reservation_id: 101,
        type: "dp",
        method: "va_bca",
        amount: 30000,
        pay_by: "2026-03-10T10:00:00Z",
        status: "pending_verification",
      })
    );

    const { container } = render(
      <PaymentMethods
        mode="dp"
        methodGroups={METHOD_GROUPS}
        reservationId={101}
        ownershipToken="token-101"
      />
    );

    await waitFor(() => {
      expect(createPaymentSessionMock).toHaveBeenCalled();
    });

    const fileInput = container.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File([new Uint8Array([1, 2, 3])], "proof.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Kirim Bukti Pembayaran" })
    );

    await waitFor(() => {
      expect(uploadPaymentProofMock).toHaveBeenCalledWith(
        "pay-2",
        file,
        undefined,
        { reservationId: 101, ownershipToken: "token-101" }
      );
    });

    expect(screen.getByText("Menunggu Verifikasi Pembayaran")).toBeTruthy();
    expect(
      screen.getByText(
        "Setelah tombol ini diklik, bukti akan dikirim ke admin untuk diverifikasi. Tombol di sidebar hanya digunakan untuk melihat status pengajuan."
      )
    ).toBeTruthy();
  });

  it("rejects invalid proof file before upload request is sent", async () => {
    createPaymentSessionMock.mockResolvedValue(
      successResponse({
        payment_id: "pay-3",
        reservation_id: 102,
        type: "dp",
        method: "va_bca",
        amount: 30000,
        pay_by: "2026-03-10T10:00:00Z",
        status: "initiated",
      })
    );

    const { container } = render(
      <PaymentMethods
        mode="dp"
        methodGroups={METHOD_GROUPS}
        reservationId={102}
        ownershipToken="token-102"
      />
    );

    await waitFor(() => {
      expect(createPaymentSessionMock).toHaveBeenCalled();
    });

    const fileInput = container.querySelector("input[type='file']") as HTMLInputElement;
    const invalidFile = new File([new Uint8Array([1, 2, 3])], "proof.txt", {
      type: "text/plain",
    });
    fireEvent.change(fileInput, {
      target: {
        files: [invalidFile],
      },
    });

    expect(
      await screen.findByText("Format file belum didukung. Gunakan JPG, PNG, atau PDF.")
    ).toBeTruthy();
    expect(uploadPaymentProofMock).not.toHaveBeenCalled();
  });

  it("reuses existing initiated payment session instead of creating a new one", async () => {
    uploadPaymentProofMock.mockResolvedValue(
      successResponse({
        payment_id: "pay-existing",
        reservation_id: 8,
        type: "settlement",
        method: "va_bca",
        amount: 520000,
        pay_by: "2026-03-20T10:00:00Z",
        status: "pending_verification",
      })
    );

    const { container } = render(
      <PaymentMethods
        mode="settlement"
        methodGroups={METHOD_GROUPS}
        reservationId={8}
        ownershipToken="token-8"
        existingPayment={{
          id: "pay-existing",
          type: "settlement",
          method: "va_bca",
          amount: 520000,
          status: "initiated",
          payBy: 1773960000,
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByText("Rp520.000")).toBeTruthy();
    });

    expect(createPaymentSessionMock).not.toHaveBeenCalled();

    const fileInput = container.querySelector("input[type='file']") as HTMLInputElement;
    const file = new File([new Uint8Array([1, 2, 3])], "proof.png", {
      type: "image/png",
    });
    fireEvent.change(fileInput, {
      target: {
        files: [file],
      },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Kirim Bukti Pembayaran" })
    );

    await waitFor(() => {
      expect(uploadPaymentProofMock).toHaveBeenCalledWith(
        "pay-existing",
        file,
        undefined,
        { reservationId: 8, ownershipToken: "token-8" }
      );
    });
  });
});
