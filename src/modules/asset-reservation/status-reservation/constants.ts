/** @format */

export type ReservationState = "dp" | "done";

export const RESERVATION_SHARED = {
  reservationId: "#RES-ASSET-20230815-001",
  assetName: "Gedung Serbaguna Kartika Runa Wijaya",
  assetLocation: "Jl. Persaudaraan no. 2 RT 004/002, Desa Sukamaju",
  assetImage:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBmUoYd87NraZXqDoAyBE4uZo8NHjBclUYtagfwsTLxYjBqyeD0VacXFHScBS14NwGjMD0Jph1DBE5aFXTnTYKpKlX7rQP2ApJC9letgK3AcnB557OWOXxXcBGxMUbo6RZV5Vt3lfbvh5BTERchP37jMxiHUYGH9owtUZx4i59prR6ky4mq6DNinLab4GZrW1S1YsKbRUeGwpcWFA0J8x3mWW2dv4Qm5aotXuj026pi5S0D6xXpv4LNFUWMdlwgS1lORSUYGNzU1zw",
  checkIn: "13 Nov 2023, 08:00",
  checkOut: "15 Nov 2023, 17:00",
  renter: {
    name: "Budi Santoso",
    phone: "+62 812-3456-7890",
    email: "budi.s@example.com",
    organization: "Karang Taruna RW 05",
  },
  tags: [
    { icon: "ac_unit", label: "Air Conditioner" },
    { icon: "wifi", label: "Free WiFi" },
    { icon: "speaker", label: "Sound System" },
    { icon: "local_parking", label: "Area Parkir Luas" },
    { icon: "chair", label: "500 Kursi" },
  ],
  managerNote: {
    title: "Instruksi Check-in:",
    body: "Harap menunjukkan kartu identitas (KTP) asli kepada petugas jaga saat pengambilan kunci. Kunci dapat diambil 30 menit sebelum jadwal sewa dimulai.",
  },
  description:
    "Gedung serbaguna modern yang terletak di pusat desa. Ideal untuk acara pernikahan, pertemuan komunitas, dan seminar. Dilengkapi dengan sistem pencahayaan yang baik dan ventilasi udara alami yang optimal. Kebersihan terjamin oleh tim BUMDes.",
};

export const RESERVATION_STATES: Record<
  ReservationState,
  {
    bannerText: string;
    bannerSubtext: string;
    statusLabel: string;
    statusBadgeClasses: string;
    payment: {
      total: string;
      dp: string;
      settlement?: string;
      remaining?: string;
      statusText: string;
      statusColor: string;
    };
    cta?: { label: string; href: string };
    showDownloadButtons?: boolean;
  }
> = {
  dp: {
    bannerText: "Reservasi Aset Anda Telah Dikonfirmasi!",
    bannerSubtext: "Pembayaran DP telah diterima. Silakan selesaikan pelunasan sesuai jadwal.",
    statusLabel: "Aktif & Terjadwal (DP)",
    statusBadgeClasses:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300",
    payment: {
      total: "Rp3.500.000",
      dp: "Rp1.050.000",
      remaining: "Rp2.450.000",
      statusText: "Sisa Pembayaran",
      statusColor: "text-amber-600 dark:text-amber-400",
    },
    cta: { label: "Lanjutkan Pelunasan", href: "/penyewaan-aset/repayment?sig=secure-token" },
    showDownloadButtons: false,
  },
  done: {
    bannerText: "Reservasi Aset Anda Telah Dikonfirmasi!",
    bannerSubtext: "Pembayaran sewa aset Anda telah lunas dan reservasi Anda siap!",
    statusLabel: "Aktif & Terjadwal (Lunas)",
    statusBadgeClasses:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
    payment: {
      total: "Rp3.500.000",
      dp: "Rp1.050.000",
      settlement: "Rp2.450.000",
      statusText: "LUNAS",
      statusColor: "text-green-600 dark:text-green-400",
    },
    showDownloadButtons: true,
  },
};

export const SECURE_LINK = {
  expectedSignature: "secure-token",
};

export function verifySignature(signature?: string) {
  return Boolean(signature && signature === SECURE_LINK.expectedSignature);
}
