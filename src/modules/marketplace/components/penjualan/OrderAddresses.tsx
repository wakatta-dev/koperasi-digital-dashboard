/** @format */

"use client";

import { CheckCircle } from "lucide-react";

export type OrderAddressesProps = Readonly<{
  shippingAddress: string;
  billingAddress?: string | null;
  billingSameAsShipping?: boolean;
}>;

export function OrderAddresses({
  shippingAddress,
  billingAddress,
  billingSameAsShipping = false,
}: OrderAddressesProps) {
  return (
    <>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Alamat Pengiriman
        </h4>
        <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
          {shippingAddress}
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
          Alamat Penagihan
        </h4>
        {billingSameAsShipping ? (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span>Sama dengan alamat pengiriman</span>
          </div>
        ) : (
          <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {billingAddress}
          </div>
        )}
      </div>
    </>
  );
}
