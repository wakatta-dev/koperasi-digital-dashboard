/** @format */

import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { LandingPage } from "@/modules/landing";

export const metadata: Metadata = {
  title: "BUMDes Sukamaju - Bangun Ekonomi Desa",
  description:
    "Landing page BUMDes Sukamaju untuk menampilkan program, layanan, dan produk unggulan desa.",
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export default function HomePage() {
  return (
    <div className={plusJakarta.className}>
      <LandingPage />
    </div>
  );
}
