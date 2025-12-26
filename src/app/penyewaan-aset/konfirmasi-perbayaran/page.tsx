/** @format */

import type { Metadata } from "next";

import { AssetConfirmationPage } from "@/modules/asset-reservation/confirmation";

export const metadata: Metadata = {
  title: "Konfirmasi Pembayaran Sewa - BUMDes Sukamaju",
  description:
    "Reservasi aset Anda telah aktif. Lihat detail konfirmasi pembayaran dan reservasi.",
};

type ConfirmationPageProps = {
  searchParams?: Promise<{ reservationId?: string }>;
};

export default async function PenyewaanAsetConfirmationPage({
  searchParams,
}: ConfirmationPageProps) {
  const params = await searchParams;
  const reservationId = params?.reservationId;
  return <AssetConfirmationPage reservationId={reservationId} />;
}
