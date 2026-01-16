/** @format */

import Link from "next/link";
import Image from "next/image";

import {
  CheckoutSummaryBase,
  type SummaryRow,
} from "@/components/shared/data-display/CheckoutSummaryBase";
import { PAYMENT_SUMMARY } from "../constants";

export function PaymentSummaryCard() {
  const rows: SummaryRow[] = [
    { label: PAYMENT_SUMMARY.totalItemsLabel, value: PAYMENT_SUMMARY.totalItemsValue },
    { label: PAYMENT_SUMMARY.shippingLabel, value: PAYMENT_SUMMARY.shippingValue },
    { label: PAYMENT_SUMMARY.serviceFeeLabel, value: PAYMENT_SUMMARY.serviceFeeValue },
    {
      label: PAYMENT_SUMMARY.discountLabel,
      value: PAYMENT_SUMMARY.discountValue,
      valueClassName: "text-green-600 dark:text-green-400",
    },
  ];

  const headerSlot = (
    <div className="flex -space-x-3 overflow-hidden py-2">
      {PAYMENT_SUMMARY.avatarImages.map((src, idx) => (
        <Image
          key={src + idx}
          alt=""
          src={src}
          width={40}
          height={40}
          className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
        />
      ))}
      <div className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-bold text-muted-foreground">
        {PAYMENT_SUMMARY.extraCountLabel}
      </div>
    </div>
  );

  const footerSlot = (
    <>
      <Link
        href="/marketplace/ulasan"
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-center font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
      >
        Lanjutkan ke Ulasan Pesanan
        <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </Link>
      <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        <span className="material-icons-outlined text-base text-green-600">verified_user</span>
        {PAYMENT_SUMMARY.secureNote}
      </div>
    </>
  );

  return (
    <CheckoutSummaryBase
      title="Ringkasan Pesanan"
      headerSlot={headerSlot}
      rows={rows}
      total={{ label: PAYMENT_SUMMARY.totalLabel, value: PAYMENT_SUMMARY.totalValue }}
      footerSlot={footerSlot}
      stickyTop={112}
    />
  );
}
