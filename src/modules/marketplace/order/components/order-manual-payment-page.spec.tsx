/** @format */

import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { OrderManualPaymentPage } from "./order-manual-payment-page";

const decideManualPaymentMock = vi.fn(async () => ({}));
let orderDetailMock: any = null;

vi.mock("next/image", () => ({
  default: (props: any) => <img {...props} alt={props.alt} />,
}));

vi.mock("@/components/ui/select", () => ({
  Select: ({
    value,
    onValueChange,
    children,
  }: {
    value?: string;
    onValueChange?: (value: string) => void;
    children: ReactNode;
  }) => {
    const items: Array<{ value: string; label: string }> = [];
    const walk = (node: ReactNode): void => {
      if (!node) return;
      if (Array.isArray(node)) {
        node.forEach(walk);
        return;
      }
      if (typeof node !== "object") return;
      const element = node as any;
      if (element?.props?.value && typeof element.props.children === "string") {
        items.push({
          value: element.props.value,
          label: element.props.children,
        });
      }
      walk(element?.props?.children);
    };
    walk(children);

    return (
      <select
        aria-label="Ubah Status Pembayaran"
        value={value}
        onChange={(event) => onValueChange?.(event.target.value)}
      >
        {items.map((item) => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  },
  SelectTrigger: ({ children }: { children: ReactNode }) => children,
  SelectValue: ({ placeholder }: { placeholder?: string }) => placeholder ?? null,
  SelectContent: ({ children }: { children: ReactNode }) => children,
  SelectItem: ({
    children,
    value,
  }: {
    children: ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
}));

vi.mock("@/hooks/queries/marketplace-orders", () => ({
  useMarketplaceOrder: () => ({
    data: orderDetailMock,
    isLoading: false,
    isError: false,
    error: null,
  }),
  useMarketplaceOrderActions: () => ({
    decideManualPayment: {
      mutateAsync: decideManualPaymentMock,
      isPending: false,
    },
  }),
}));

function makeOrderDetail() {
  return {
    id: 101,
    order_number: "INV-2026-0101",
    status: "PAYMENT_VERIFICATION",
    customer_name: "Budi",
    customer_phone: "08123456789",
    customer_email: "budi@email.com",
    total: 250000,
    created_at: 1739491200,
    manual_payment: {
      status: "MANUAL_PAYMENT_SUBMITTED",
      proof_url: "https://example.com/proof.jpg",
      proof_filename: "proof.jpg",
      bank_name: "BCA",
      transfer_amount: 250000,
      transfer_date: "2026-02-14",
      created_at: 1739492100,
    },
  };
}

describe("OrderManualPaymentPage", () => {
  beforeEach(() => {
    decideManualPaymentMock.mockClear();
    orderDetailMock = makeOrderDetail();
  });

  it("requires admin note when marking payment for follow-up", async () => {
    orderDetailMock = {
      ...makeOrderDetail(),
      manual_payment: {
        ...makeOrderDetail().manual_payment,
        status: "CONFIRMED",
      },
    };

    render(<OrderManualPaymentPage id="101" />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "WAITING_MANUAL_CONFIRMATION" },
    });

    await waitFor(() => {
      expect(decideManualPaymentMock).not.toHaveBeenCalled();
      expect(
        screen.getByRole("button", { name: "Simpan Perubahan & Konfirmasi" }),
      ).toHaveProperty("disabled", true);
      expect(screen.getByText("Catatan Admin")).toBeTruthy();
      expect(screen.getByText("(Wajib)")).toBeTruthy();
    });
  });

  it("submits manual payment decision when payment is confirmed", async () => {
    render(<OrderManualPaymentPage id="101" />);

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "CONFIRMED" },
    });
    fireEvent.click(
      screen.getByRole("button", { name: "Simpan Perubahan & Konfirmasi" }),
    );

    await waitFor(() => {
      expect(decideManualPaymentMock).toHaveBeenCalledWith({
        id: 101,
        payload: {
          status: "CONFIRMED",
        },
      });
    });
  });
});
