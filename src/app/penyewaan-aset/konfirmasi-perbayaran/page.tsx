/** @format */

import type { Metadata } from "next";

import { AssetConfirmationPage } from "@/modules/asset-reservation/confirmation";

export const metadata: Metadata = {
  title: "Konfirmasi Pembayaran Sewa - BUMDes Sukamaju",
  description:
    "Reservasi aset Anda telah aktif. Lihat detail konfirmasi pembayaran dan reservasi.",
};

export default function PenyewaanAsetConfirmationPage() {
  return <AssetConfirmationPage />;
}
