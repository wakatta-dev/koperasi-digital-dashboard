/** @format */

import { Cpu, History, Copy, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { AssetDetailModel } from "../../types/stitch";
import { AssetRentalFeatureDemoShell } from "./AssetRentalFeatureDemoShell";

type AssetDetailFeatureProps = Readonly<{
  detail: AssetDetailModel;
}>;

export function AssetDetailFeature({ detail }: AssetDetailFeatureProps) {
  return (
    <AssetRentalFeatureDemoShell
      title="Detail Aset"
      description="Struktur informasi aset utama dari desain Stitch."
      activeItem="Daftar Aset"
    >
      <div className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {detail.summaryCards.map((card) => (
          <section
            key={card.id}
            className="rounded-xl border border-slate-200 bg-white p-4"
          >
            <p className="text-sm font-medium text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {card.value}
            </p>
            {card.trendLabel ? (
              <p className="mt-1 text-xs text-indigo-600">{card.trendLabel}</p>
            ) : null}
          </section>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-5">
          {detail.photoUrl ? (
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <img
                src={detail.photoUrl}
                alt={detail.name || "Gambar aset"}
                className="h-32 w-full object-cover sm:h-36"
              />
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center rounded-lg bg-slate-100 text-center text-sm font-medium text-slate-500 sm:h-36">
              {detail.name || "Aset"}
            </div>
          )}
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Asset Tag
            </div>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-lg font-medium text-slate-900">
                {detail.assetTag}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-slate-500 hover:text-indigo-600"
              >
                <Copy className="h-4 w-4" />
                <span className="sr-only">Salin Asset Tag</span>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Status
              </div>
              <Badge className="mt-1 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                {detail.status}
              </Badge>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Kategori
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {detail.category}
              </div>
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Lokasi Sekarang
            </div>
            <div className="mt-1 flex items-start gap-2 text-sm text-slate-700">
              <MapPin className="mt-0.5 h-4 w-4 text-indigo-600" />
              <span>{detail.location}</span>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-xl border border-slate-200 bg-white p-5">
            <div className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <span>Spesifikasi</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <Table>
                <TableBody>
                  {detail.specifications.map((item) => (
                    <TableRow key={item.key} className="bg-white">
                      <TableCell className="w-1/3 bg-slate-50 px-4 text-sm font-medium text-slate-500">
                        {item.key}
                      </TableCell>
                      <TableCell className="px-4 text-sm text-slate-900">
                        {item.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <History className="h-4 w-4 text-indigo-600" />
                <span>Riwayat Penyewaan</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="px-0 text-indigo-600 hover:text-indigo-700"
              >
                Lihat Semua
              </Button>
            </div>
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead className="px-4">Peminjam</TableHead>
                  <TableHead className="px-4">Tanggal Pinjam</TableHead>
                  <TableHead className="px-4">Tanggal Kembali</TableHead>
                  <TableHead className="px-4">Durasi</TableHead>
                  <TableHead className="px-4 text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {detail.activityRows.length === 0 ? (
                  <TableRow className="bg-white">
                    <TableCell
                      colSpan={5}
                      className="px-4 py-8 text-center text-sm text-slate-500"
                    >
                      Belum ada riwayat penyewaan untuk aset ini.
                    </TableCell>
                  </TableRow>
                ) : null}
                {detail.activityRows.map((row) => (
                  <TableRow key={row.id} className="bg-white">
                    <TableCell className="px-4">
                      <div className="text-sm font-medium text-slate-900">
                        {row.renterName}
                      </div>
                      <div className="text-xs text-slate-500">
                        {row.renterContact}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 text-sm text-slate-600">
                      {row.startDate}
                    </TableCell>
                    <TableCell className="px-4 text-sm text-slate-600">
                      {row.endDate}
                    </TableCell>
                    <TableCell className="px-4 text-sm text-slate-600">
                      {row.duration}
                    </TableCell>
                    <TableCell className="px-4 text-right">
                      <Badge
                        className={
                          row.status === "Selesai"
                            ? "rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700"
                            : row.status === "Menunggu"
                              ? "rounded-full border border-amber-200 bg-amber-50 text-amber-700"
                              : "rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700"
                        }
                      >
                        {row.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </section>
        </div>
      </div>
    </AssetRentalFeatureDemoShell>
  );
}
