/** @format */

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Marketplace - BUMDes Sukamaju",
  description: "Halaman marketplace BUMDes (coming soon).",
};

export default function MarketplacePage() {
  return (
    <div className="min-h-[70vh] w-full bg-background text-foreground">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-6 px-4 py-24 text-center">
        <div className="rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase text-primary">
          Marketplace
        </div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ruang marketplace akan segera hadir
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
          Kami sedang menyiapkan katalog produk desa terbaik. Silakan kembali lagi nanti.
        </p>
      </div>
    </div>
  );
}
