/** @format */
"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Cpu, History, Copy, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableShell } from "@/components/shared/data-display/TableShell";
import { AssetRentalFeatureShell } from "@/modules/asset/components/asset-rental/AssetRentalFeatureShell";

import type { AssetDetailModel } from "../../types/stitch";

type AssetDetailFeatureProps = Readonly<{
  detail: AssetDetailModel;
}>;

export function AssetDetailFeature({ detail }: AssetDetailFeatureProps) {
  const specificationColumns: ColumnDef<
    (typeof detail.specifications)[number],
    unknown
  >[] = [
    {
      id: "key",
      header: "",
      meta: {
        cellClassName:
          "w-1/3 bg-slate-50 px-4 text-sm font-medium text-slate-500",
      },
      cell: ({ row }) => row.original.key,
    },
    {
      id: "value",
      header: "",
      meta: {
        cellClassName: "px-4 text-sm text-slate-900",
      },
      cell: ({ row }) => row.original.value,
    },
  ];

  const activityColumns: ColumnDef<
    (typeof detail.activityRows)[number],
    unknown
  >[] = [
    {
      id: "renter",
      header: "Peminjam",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4",
      },
      cell: ({ row }) => (
        <>
          <div className="text-sm font-medium text-slate-900">
            {row.original.renterName}
          </div>
          <div className="text-xs text-slate-500">
            {row.original.renterContact}
          </div>
        </>
      ),
    },
    {
      id: "startDate",
      header: "Tanggal Pinjam",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4 text-sm text-slate-600",
      },
      cell: ({ row }) => row.original.startDate,
    },
    {
      id: "endDate",
      header: "Tanggal Kembali",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4 text-sm text-slate-600",
      },
      cell: ({ row }) => row.original.endDate,
    },
    {
      id: "duration",
      header: "Durasi",
      meta: {
        headerClassName: "px-4",
        cellClassName: "px-4 text-sm text-slate-600",
      },
      cell: ({ row }) => row.original.duration,
    },
    {
      id: "status",
      header: "Status",
      meta: {
        align: "right",
        headerClassName: "px-4 text-right",
        cellClassName: "px-4 text-right",
      },
      cell: ({ row }) => (
        <Badge
          className={
            row.original.status === "Selesai"
              ? "rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700"
              : row.original.status === "Menunggu"
                ? "rounded-full border border-amber-200 bg-amber-50 text-amber-700"
                : "rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700"
          }
        >
          {row.original.status}
        </Badge>
      ),
    },
  ];

  return (
    <AssetRentalFeatureShell
      title="Detail Aset"
      description="Struktur informasi aset utama dari desain Stitch."
    >
      <div
        className="mb-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        data-testid="asset-admin-detail-summary-grid"
      >
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
        <section
          className="space-y-4 rounded-xl border border-slate-200 bg-white p-5"
          data-testid="asset-admin-detail-sidebar"
        >
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
                data-testid="asset-admin-detail-copy-asset-tag-button"
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
                Lifecycle Internal
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {detail.internalLifecycle}
              </div>
            </div>
            <div className="col-span-2">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Kesiapan Publik
              </div>
              <div className="mt-1 text-sm font-medium text-slate-900">
                {detail.publicReady
                  ? "Siap diaktifkan untuk publik"
                  : "Belum siap untuk publik"}
              </div>
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
          {detail.publicReadinessIssues.length > 0 ? (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              <p className="font-medium">
                Lengkapi data berikut sebelum aset diaktifkan:
              </p>
              <ul className="mt-2 list-disc pl-5 space-y-1">
                {detail.publicReadinessIssues.map((issue) => (
                  <li key={issue}>{issue}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <div className="space-y-4">
          <section
            className="rounded-xl border border-slate-200 bg-white p-5"
            data-testid="asset-admin-detail-specifications"
          >
            <div className="mb-4 flex items-center gap-2 text-base font-semibold text-slate-900">
              <Cpu className="h-4 w-4 text-indigo-600" />
              <span>Spesifikasi</span>
            </div>
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <TableShell
                columns={specificationColumns}
                data={detail.specifications}
                getRowId={(row) => row.key}
                emptyState="Belum ada spesifikasi."
              />
            </div>
          </section>

          <section
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
            data-testid="asset-admin-detail-activity-table"
          >
            <div className="flex items-center justify-between border-b border-slate-200 p-5">
              <div className="flex items-center gap-2 text-base font-semibold text-slate-900">
                <History className="h-4 w-4 text-indigo-600" />
                <span>Riwayat Penyewaan</span>
              </div>
              <Button
                type="button"
                variant="ghost"
                className="px-0 text-indigo-600 hover:text-indigo-700"
                data-testid="asset-admin-detail-view-all-activity-button"
              >
                Lihat Semua
              </Button>
            </div>
            <TableShell
              columns={activityColumns}
              data={detail.activityRows}
              getRowId={(row) => row.id}
              emptyState="Belum ada riwayat penyewaan untuk aset ini."
              headerClassName="bg-slate-50"
              rowClassName="bg-white"
            />
          </section>
        </div>
      </div>
    </AssetRentalFeatureShell>
  );
}
