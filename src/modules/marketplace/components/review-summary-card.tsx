/** @format */

import Link from "next/link";

import {
  CheckoutSummaryBase,
  type SummaryRow,
} from "@/components/shared/data-display/CheckoutSummaryBase";
import { REVIEW_SUMMARY } from "../constants";

export function ReviewSummaryCard() {
  const rows: SummaryRow[] = [
    { label: REVIEW_SUMMARY.totalItemsLabel, value: REVIEW_SUMMARY.totalItemsValue },
    { label: REVIEW_SUMMARY.shippingLabel, value: REVIEW_SUMMARY.shippingValue },
    { label: REVIEW_SUMMARY.serviceFeeLabel, value: REVIEW_SUMMARY.serviceFeeValue },
    {
      label: REVIEW_SUMMARY.discountLabel,
      value: REVIEW_SUMMARY.discountValue,
      valueClassName: "text-green-600 dark:text-green-400",
    },
  ];

  const headerSlot = (
    <div className="flex -space-x-3 overflow-hidden py-2">
      {REVIEW_SUMMARY.avatarImages.map((src, idx) => (
        <img
          key={src + idx}
          alt=""
          src={src}
          className="inline-block h-10 w-10 rounded-full ring-2 ring-background object-cover"
        />
      ))}
      <div className="flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-background bg-muted text-xs font-bold text-muted-foreground">
        {REVIEW_SUMMARY.extraCountLabel}
      </div>
    </div>
  );

  const footerSlot = (
    <>
      <Link
        href="/marketplace/konfirmasi"
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-center font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90"
      >
        Konfirmasi Pesanan
        <span className="material-icons-outlined text-lg group-hover:translate-x-1 transition-transform">
          arrow_forward
        </span>
      </Link>
      <div className="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 p-3 text-xs text-muted-foreground">
        <span className="material-icons-outlined text-base text-green-600">verified_user</span>
        {REVIEW_SUMMARY.secureNote}
      </div>
    </>
  );

  return (
    <CheckoutSummaryBase
      title="Ringkasan Pesanan"
      headerSlot={headerSlot}
      rows={rows}
      total={{ label: REVIEW_SUMMARY.totalLabel, value: REVIEW_SUMMARY.totalValue }}
      footerSlot={footerSlot}
      stickyTop={112}
    />
  );
}
