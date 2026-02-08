/** @format */

import { Badge } from "@/components/ui/badge";

import { AssetRentalFeatureDemoShell } from "@/modules/asset/components/stitch/AssetRentalFeatureDemoShell";

export function RentalCompletedDetailFeature() {
  return (
    <AssetRentalFeatureDemoShell
      title="Detail Penyewaan"
      description="Informasi transaksi penyewaan selesai (arsip)."
      activeItem="Penyewaan"
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-2xl font-bold text-slate-900">Detail Penyewaan</h3>
          <Badge className="rounded-full border border-emerald-200 bg-emerald-100 text-emerald-800">
            Selesai
          </Badge>
        </div>
        <p className="text-sm text-slate-500">
          ID Referensi: <span className="font-mono">RNT-00921</span> • 1 Nov 2023
        </p>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="text-base font-semibold text-slate-900">Informasi Aset</h4>
              <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                <div className="h-32 w-32 rounded-lg bg-slate-100" />
                <div className="space-y-3">
                  <h5 className="text-xl font-bold text-slate-900">MacBook Pro M2</h5>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <span className="rounded border border-slate-200 bg-slate-100 px-2 py-0.5 font-mono text-xs">TAG-00921</span>
                    <span>•</span>
                    <span>Elektronik</span>
                  </div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Serial Number</p>
                      <p className="font-medium text-slate-900">FVFDX123M2</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-slate-500">Lokasi Penyimpanan</p>
                      <p className="font-medium text-slate-900">Gudang A - Rak 2</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="text-base font-semibold text-slate-900">Informasi Pengembalian</h4>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Tanggal Pengembalian Aktual</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-lg font-semibold text-slate-900">15 Nov 2023</span>
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                      Tepat Waktu
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Kondisi Aset</p>
                  <Badge className="mt-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700">Baik</Badge>
                </div>
                <div className="md:col-span-2">
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Catatan Admin</p>
                  <div className="mt-2 rounded-lg border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-700">
                      Aset dikembalikan dalam kondisi lengkap beserta charger dan tas laptop. Tidak ada kerusakan fisik yang ditemukan pada saat pemeriksaan. Sudah dibersihkan dan siap untuk disewakan kembali.
                    </p>
                    <p className="mt-3 text-xs text-slate-400">Diperiksa oleh: Admin Gudang (Sari)</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="space-y-4">
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Peminjam</h4>
              <div className="mt-4 flex items-center gap-3 border-b border-slate-100 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-indigo-600">BS</div>
                <div>
                  <p className="font-medium text-slate-900">Budi Santoso</p>
                  <p className="text-xs text-slate-500">IT Development</p>
                </div>
              </div>
              <div className="space-y-2 pt-4 text-sm text-slate-600">
                <p>budi.s@example.com</p>
                <p>+62 812 3456 7890</p>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Jadwal Sewa</h4>
              <div className="mt-4 space-y-4 border-l-2 border-slate-200 pl-4 text-sm">
                <div>
                  <p className="text-xs text-slate-500">Tanggal Mulai</p>
                  <p className="font-medium text-slate-900">1 Nov 2023</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Rencana Kembali</p>
                  <p className="font-medium text-slate-900">15 Nov 2023</p>
                </div>
              </div>
              <div className="mt-4 border-t border-slate-100 pt-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Total Durasi</span>
                  <span className="font-semibold text-slate-900">14 Hari</span>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </AssetRentalFeatureDemoShell>
  );
}
