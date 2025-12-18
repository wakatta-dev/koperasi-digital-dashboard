/** @format */

export const PAYMENT_BREADCRUMB = {
  backLabel: "Kembali ke Detail Permintaan",
  backHref: "/penyewaan-aset/status/asset-1",
  confirmationHref: "/penyewaan-aset/status-reservasi?state=done&sig=secure-token",
};

export const PAYMENT_SUMMARY = {
  assetName: "Gedung Serbaguna Kartika Runa Wijaya",
  assetAddress: "Jl. Persaudaraan no. 2 RT 004/002, Desa Sukamaju",
  startDate: "Senin, 13 Nov 2023",
  startTime: "08:00 WIB",
  endDate: "Rabu, 15 Nov 2023",
  endTime: "17:00 WIB",
  totalCost: "Rp1.100.000",
  dpLabel: "Pembayaran DP (30%)",
  dpAmount: "Rp330.000",
  dpNote:
    "*Pembayaran DP wajib dilakukan untuk konfirmasi booking. Sisa pembayaran dapat dilunasi H-3 acara.",
};

export const PAYMENT_METHOD_GROUPS = [
  {
    title: "Virtual Account",
    icon: "account_balance",
    options: [
      { value: "va_bca", label: "BCA Virtual Account", badge: "Otomatis" },
      { value: "va_mandiri", label: "Mandiri Virtual Account", badge: "Otomatis" },
      { value: "va_bri", label: "BRI Virtual Account", badge: "Otomatis" },
    ],
  },
  {
    title: "E-Wallet / QRIS",
    icon: "account_balance_wallet",
    options: [
      { value: "gopay", label: "GoPay", icon: "qr_code_scanner" },
      { value: "ovo", label: "OVO", icon: "qr_code_scanner" },
      { value: "qris", label: "QRIS (Semua Pembayaran)", icon: "qr_code_scanner" },
    ],
  },
  {
    title: "Transfer Bank Manual",
    icon: "payments",
    options: [
      {
        value: "bank_bsi",
        label: "Bank Syariah Indonesia",
        account: "No. Rek: 1122-3344-55",
        holder: "a.n BUMDes Sukamaju",
        badge: "Verifikasi Manual",
      },
      {
        value: "bank_jatim",
        label: "Bank Jatim",
        account: "No. Rek: 0011-2233-44",
        holder: "a.n BUMDes Sukamaju",
        badge: "Verifikasi Manual",
      },
    ],
  },
] as const;

export const PAYMENT_SIDEBAR = {
  invoiceId: "#INV-REQ-2310-001",
  totalCost: "Rp1.100.000",
  fee: "Rp2.500",
  dpDue: "Rp332.500",
  remaining: "Rp770.000",
};
