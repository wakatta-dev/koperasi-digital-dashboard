/** @format */

import Link from "next/link";

type ConfirmationBreadcrumbProps = {
  detailHref?: string;
  paymentHref?: string;
};

export function ConfirmationBreadcrumb({
  detailHref,
  paymentHref,
}: ConfirmationBreadcrumbProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-500 dark:text-gray-400">
          {detailHref ? (
            <Link
              href={detailHref}
              className="hover:text-[#4338ca] dark:hover:text-white transition"
            >
              Detail Permintaan
            </Link>
          ) : (
            <span>Detail Permintaan</span>
          )}
          <span className="mx-2">/</span>
          {paymentHref ? (
            <Link
              href={paymentHref}
              className="hover:text-[#4338ca] dark:hover:text-white transition"
            >
              Pembayaran
            </Link>
          ) : (
            <span>Pembayaran</span>
          )}
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium">Konfirmasi</span>
        </nav>
      </div>
    </div>
  );
}
