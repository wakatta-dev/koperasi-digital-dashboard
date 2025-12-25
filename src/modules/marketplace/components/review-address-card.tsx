/** @format */

import { REVIEW_ADDRESS } from "../constants";

export function ReviewAddressCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <span className="material-icons-outlined text-muted-foreground">
              local_shipping
            </span>
            Alamat Pengiriman
          </h2>
          <button className="text-sm font-bold text-primary hover:underline transition">
            Ubah
          </button>
        </div>
        <div className="ml-2 border-l-2 border-border pl-8">
          <p className="font-bold text-foreground">
            {REVIEW_ADDRESS.name}{" "}
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              ({REVIEW_ADDRESS.label})
            </span>
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {REVIEW_ADDRESS.addressLine1}
          </p>
          <p className="text-sm text-muted-foreground">{REVIEW_ADDRESS.addressLine2}</p>
          <p className="mt-2 text-sm font-medium text-muted-foreground">
            {REVIEW_ADDRESS.phone}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="rounded-lg border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary">
              {REVIEW_ADDRESS.courierTag}
            </span>
            <span className="text-xs text-muted-foreground">
              {REVIEW_ADDRESS.courierEta}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
