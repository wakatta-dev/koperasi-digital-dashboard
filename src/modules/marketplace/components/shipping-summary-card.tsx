/** @format */

import Link from "next/link";

import {
  CheckoutSummaryBase,
  type SummaryRow,
} from "@/components/shared/data-display/CheckoutSummaryBase";
import { SHIPPING_SUMMARY } from "../constants";

export function ShippingSummaryCard() {
  const rows: SummaryRow[] = [
    { label: SHIPPING_SUMMARY.totalItemsLabel, value: SHIPPING_SUMMARY.totalItemsValue },
    { label: SHIPPING_SUMMARY.shippingLabel, value: SHIPPING_SUMMARY.shippingValue },
    { label: SHIPPING_SUMMARY.serviceFeeLabel, value: SHIPPING_SUMMARY.serviceFeeValue },
    {
      label: SHIPPING_SUMMARY.discountLabel,
      value: SHIPPING_SUMMARY.discountValue,
      valueClassName: "text-green-600 dark:text-green-400",
    },
  ];

  const headerSlot = (
    <div className="flex -space-x-3 overflow-hidden py-2">
      {SHIPPING_SUMMARY.avatarImages.map((src, idx) => (
        <img
          key={src + idx}
          alt=""
          src={src}
          className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
        />
      ))}
      <div className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-bold text-muted-foreground">
        {SHIPPING_SUMMARY.extraCountLabel}
      </div>
    </div>
  );

  const footerSlot = (
    <>
      <Link
        href="/marketplace/pembayaran"
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-center font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
      >
        Lanjutkan ke Pembayaran
        <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </Link>
      <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        <span className="material-icons-outlined text-base text-green-600">verified_user</span>
        {SHIPPING_SUMMARY.secureNote}
      </div>
    </>
  );

  return (
    <CheckoutSummaryBase
      title="Ringkasan Pesanan"
      headerSlot={headerSlot}
      rows={rows}
      total={{ label: SHIPPING_SUMMARY.totalLabel, value: SHIPPING_SUMMARY.totalValue }}
      footerSlot={footerSlot}
      stickyTop={112}
    />
  );
}
