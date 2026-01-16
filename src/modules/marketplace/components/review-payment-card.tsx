/** @format */

import Image from "next/image";
import { REVIEW_PAYMENT } from "../constants";

export function ReviewPaymentCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="material-icons-outlined text-muted-foreground">payments</span>
            Metode Pembayaran
          </h2>
          <button className="text-sm font-bold text-primary hover:underline transition">
            Ubah
          </button>
        </div>
        <div className="ml-2 border-l-2 border-border pl-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-16 items-center justify-center rounded border border-border bg-background p-1">
              <Image
                alt="Bank BRI"
                src={REVIEW_PAYMENT.logo}
                width={64}
                height={40}
                className="h-full object-contain"
              />
            </div>
            <div>
              <p className="font-bold text-foreground">{REVIEW_PAYMENT.bankName}</p>
              <p className="text-sm text-muted-foreground">{REVIEW_PAYMENT.note}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
