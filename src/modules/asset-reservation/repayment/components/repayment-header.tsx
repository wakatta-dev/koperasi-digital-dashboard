/** @format */

import Link from "next/link";

type RepaymentHeaderProps = {
  backHref: string;
};

export function RepaymentHeader({ backHref }: RepaymentHeaderProps) {
  return (
    <div className="mb-8">
      <Link
        href={backHref}
        className="inline-flex items-center text-sm text-gray-500 hover:text-brand-primary dark:text-gray-400 dark:hover:text-white transition gap-1 mb-2"
      >
        <span className="material-icons-outlined text-lg">arrow_back</span>
        Kembali ke Detail Permintaan
      </Link>
      <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        Pembayaran Pelunasan Sewa Aset
      </h1>
      <p className="mt-2 text-gray-600 dark:text-gray-400 max-w-3xl">
        Mohon selesaikan pembayaran pelunasan Anda untuk menyelesaikan proses sewa aset. Pastikan data
        pemesanan sudah sesuai sebelum melanjutkan pembayaran.
      </p>
    </div>
  );
}
