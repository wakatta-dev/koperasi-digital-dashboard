/** @format */

export type UserSession = {
  user: {
    id: number;
    email: string;
    name: string;
    role:
      | "super_admin_vendor"
      | "admin_vendor"
      | "support_agent"
      | "operator"
      | "super_admin"
      | "admin_keanggotaan"
      | "admin_keuangan"
      | "bendahara"
      | "auditor_viewer"
      | "anggota"
      | "pemilik_toko"
      | "admin_umkm"
      | "kasir"
      | "pelanggan"
      | "manajer_bumdes"
      | "admin_unit"
      | "kasir_unit"
      | "penyewa_pelanggan";
    jenis_tenant: "vendor" | "koperasi" | "umkm" | "bumdes";
  };
  accessToken: string;
  error?: string;
};
