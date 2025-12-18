/** @format */

import Link from "next/link";

type StatusBreadcrumbProps = {
  currentLabel: string;
};

export function StatusBreadcrumb({ currentLabel }: StatusBreadcrumbProps) {
  return (
    <div className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex text-sm text-gray-500 dark:text-gray-400">
          <Link href="/" className="hover:text-[#4338ca] dark:hover:text-white transition">
            Beranda
          </Link>
          <span className="mx-2">/</span>
          <Link href="/penyewaan-aset" className="hover:text-[#4338ca] dark:hover:text-white transition">
            Penyewaan Aset
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/penyewaan-aset/status"
            className="hover:text-[#4338ca] dark:hover:text-white transition"
          >
            Permintaan Saya
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 dark:text-white font-medium">{currentLabel}</span>
        </nav>
      </div>
    </div>
  );
}
