/** @format */

import { bumdesTitleMap } from "./navigation";

export function resolveBumdesTitle(pathname: string) {
  return (
    bumdesTitleMap[pathname] ??
    (pathname.startsWith("/bumdes/asset/manajemen/")
      ? "Asset & Rental - Detail Aset"
      : pathname.startsWith("/bumdes/asset/penyewaan/")
        ? "Asset & Rental - Detail Penyewaan"
      : pathname.startsWith("/bumdes/asset/pengajuan-sewa/")
        ? "Asset & Rental - Detail Pengajuan Sewa"
      : pathname.startsWith("/bumdes/asset/pengembalian/")
        ? "Asset & Rental - Detail Pengembalian"
      : pathname.startsWith("/bumdes/accounting/vendor-bills-ap/")
        ? "Accounting - Vendor Bills (AP) - Bill Detail"
      : pathname.startsWith("/bumdes/accounting/journal/")
        ? "Accounting - Journal - Entry Detail"
      : "BUMDes")
  );
}
