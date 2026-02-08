/** @format */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { AssetRentalFeatureDemoShell } from "@/modules/asset/components/stitch/AssetRentalFeatureDemoShell";

export function RentalActiveDetailFeature() {
  return (
    <AssetRentalFeatureDemoShell
      title="Detail Transaksi"
      description="Informasi transaksi penyewaan aktif."
      activeItem="Penyewaan"
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="border-slate-200 bg-white text-slate-700">
            Unduh Bukti
          </Button>
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">Kembalikan Aset</Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
          <span>ID: TR-00921</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>Dibuat pada 1 Nov 2023</span>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Informasi Aset</h3>
              <Badge className="mt-2 rounded-full border border-slate-200 bg-slate-100 text-slate-700">
                Elektronik
              </Badge>
            </div>
            <div className="flex gap-4">
              <div className="h-24 w-24 rounded-lg bg-slate-100" />
              <div className="space-y-2">
                <h4 className="text-xl font-bold text-slate-900">MacBook Pro M2</h4>
                <p className="text-sm text-slate-500">Space Grey, 16GB/512GB</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <p className="text-xs text-slate-500">Nomor Tag</p>
                    <p className="font-medium text-slate-900">TAG-00921</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Serial Number</p>
                    <p className="font-medium text-slate-900">FVF-992-KL</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
            <h3 className="text-lg font-semibold text-slate-900">Status Transaksi</h3>
            <Badge className="rounded-full border border-blue-200 bg-blue-100 text-blue-800">Berjalan</Badge>

            <div className="space-y-4 border-l border-slate-200 pl-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tanggal Mulai</p>
                <p className="text-lg font-bold text-slate-900">1 Nov 2023</p>
                <p className="text-sm text-slate-500">Pukul 09:00 WIB</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Target Pengembalian
                </p>
                <p className="text-lg font-bold text-slate-900">15 Nov 2023</p>
                <p className="text-sm text-slate-500">Pukul 17:00 WIB</p>
              </div>
            </div>

            <div className="rounded-lg bg-slate-50 p-4">
              <h5 className="text-sm font-bold text-slate-900">Catatan</h5>
              <p className="mt-1 text-sm text-slate-600">
                Aset diserahkan dalam kondisi baru. Termasuk charger original dan sleeve case. Harap dikembalikan lengkap.
              </p>
            </div>
          </section>
        </div>
      </div>
    </AssetRentalFeatureDemoShell>
  );
}
