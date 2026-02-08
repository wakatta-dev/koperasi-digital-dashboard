/** @format */

import type { Metadata } from "next";
import { Suspense } from "react";

import { GuestStatusLookupPage } from "@/modules/asset-reservation/status";

export const metadata: Metadata = {
  title: "Cek Status Pengajuan - BUMDes Sukamaju",
  description:
    "Pantau status pengajuan sewa aset Anda menggunakan nomor pengajuan (contoh: #SQ-99210).",
};

export default function PenyewaanAsetStatusLookupRoute() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-muted-foreground">
          Memuat…
        </div>
      }
    >
      <GuestStatusLookupPage />
    </Suspense>
  );
}

