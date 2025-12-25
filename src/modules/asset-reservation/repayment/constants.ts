/** @format */

export const REPAYMENT_BREADCRUMB = {
  backHref: "/penyewaan-aset/status-reservasi?state=dp&sig=secure-token",
  confirmationHref: "/penyewaan-aset/status-reservasi?state=done&sig=secure-token",
};

export const REPAYMENT_SUMMARY = {
  reservationId: "#RES-ASSET-20230815-001",
  assetName: "Gedung Serbaguna Kartika Runa Wijaya",
  assetAddress: "Jl. Raya Sukamaju No. 45, Desa Sukamaju",
  assetImage: "",
  dateRange: "13 Nov - 15 Nov 2023",
  duration: "3 Hari Sewa",
  totalCost: "Rp3.500.000",
  dpPaid: "Rp1.050.000",
  remaining: "Rp2.450.000",
};

export const REPAYMENT_METHOD_GROUPS = [
  {
    title: "Virtual Account",
    badge: "Otomatis",
    options: [
      { value: "va_bca", label: "BCA Virtual Account", sub: "Verifikasi instan", logo: "BCA" },
      { value: "va_bri", label: "BRIVA", sub: "Verifikasi instan", logo: "BRI" },
      { value: "va_mandiri", label: "Mandiri Bill", sub: "Verifikasi instan", logo: "MDR" },
    ],
  },
  {
    title: "E-Wallet / QRIS",
    options: [{ value: "qris", label: "QRIS", sub: "Gopay, OVO, Dana, LinkAja", icon: "qr_code_2" }],
  },
  {
    title: "Transfer Bank Manual",
    options: [
      {
        value: "bank_jatim",
        label: "Bank Jatim - Rekening BUMDes",
        account: "0012-3456-7890-1234",
        holder: "BUMDes Sukamaju Sejahtera",
        note: "Wajib unggah bukti transfer setelah pembayaran",
      },
    ],
  },
] as const;

export const REPAYMENT_SIDEBAR = {
  invoiceId: "INV-LNS-2311001",
  totalCost: "Rp3.500.000",
  fee: "Rp0",
  dpPaid: "Rp1.050.000",
  remaining: "Rp2.450.000",
  dueText: "14 Nov 2023 14:00",
  proofNote: "Unggah bukti untuk verifikasi manual jika diperlukan.",
};
