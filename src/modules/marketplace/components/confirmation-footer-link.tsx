/** @format */

import Link from "next/link";

export function ConfirmationFooterLink() {
  return (
    <div className="mt-8">
      <Link
        href="/"
        className="text-sm font-semibold text-gray-500 hover:text-[#4338ca] dark:text-gray-400 dark:hover:text-white transition inline-flex items-center gap-1 group"
      >
        <span className="material-icons-outlined text-base group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        Kembali ke Beranda
      </Link>
    </div>
  );
}
