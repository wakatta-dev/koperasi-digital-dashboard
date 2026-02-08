/** @format */

"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { QK } from "@/hooks/queries/queryKeys";
import { showToastError, showToastSuccess, showToastWarning } from "@/lib/toast";
import {
  completeAssetBooking,
  getAssetRentalBookings,
  updateAssetBookingStatus,
} from "@/services/api/asset-rental";

import { useAssetRentalFeatureFilters } from "../../hooks/use-asset-rental-feature-filters";
import { useAssetRentalOverlays } from "../../hooks/use-asset-rental-overlays";
import { splitBookingsForStitchTables } from "../../utils/stitch-contract-mappers";
import { AssetRentalFeatureDemoShell } from "@/modules/asset/components/stitch/AssetRentalFeatureDemoShell";
import { MarkReturnModalFeature } from "./MarkReturnModalFeature";
import { RejectRequestModalFeature } from "./RejectRequestModalFeature";
import { RentalListFeature } from "./RentalListFeature";
import { RentalRequestListFeature } from "./RentalRequestListFeature";
import { ReturnConfirmationModalFeature } from "./ReturnConfirmationModalFeature";
import { ReturnListFeature } from "./ReturnListFeature";

type SectionKey = "penyewaan" | "pengajuan" | "pengembalian";

const sectionMenu: Record<SectionKey, "Penyewaan" | "Pengajuan Sewa" | "Pengembalian"> = {
  penyewaan: "Penyewaan",
  pengajuan: "Pengajuan Sewa",
  pengembalian: "Pengembalian",
};

const sectionDetailBasePath: Record<SectionKey, string> = {
  penyewaan: "/bumdes/asset/penyewaan",
  pengajuan: "/bumdes/asset/pengajuan-sewa",
  pengembalian: "/bumdes/asset/pengembalian",
};

type AssetRentalTablesShowcaseProps = Readonly<{
  initialSection?: SectionKey;
}>;

export function AssetRentalTablesShowcase({
  initialSection = "penyewaan",
}: AssetRentalTablesShowcaseProps) {
  const section = initialSection;
  const queryClient = useQueryClient();
  const { search, status, setSearch, setStatus } = useAssetRentalFeatureFilters();
  const overlays = useAssetRentalOverlays();

  const bookingsQuery = useQuery({
    queryKey: QK.assetRental.bookings({ source: "asset-rental-tables" }),
    queryFn: async () => {
      const response = await getAssetRentalBookings();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat data penyewaan aset");
      }
      return response.data;
    },
  });

  const bookingCollections = useMemo(
    () => splitBookingsForStitchTables(bookingsQuery.data ?? []),
    [bookingsQuery.data]
  );

  const rentalRows = bookingCollections.rentalRows;
  const requestRows = bookingCollections.requestRows;
  const returnRows = bookingCollections.returnRows;

  const statusMutation = useMutation({
    mutationFn: async (args: { bookingId: string; status: string }) => {
      const response = await updateAssetBookingStatus(args.bookingId, args.status);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui status booking");
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["asset-rental", "bookings"],
      });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const response = await completeAssetBooking(bookingId);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menyelesaikan pengembalian");
      }
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["asset-rental", "bookings"],
      });
    },
  });

  const filteredRentalRows = useMemo(() => {
    const searchText = search.toLowerCase();
    return rentalRows.filter((row) => {
      const searchOk = `${row.assetName} ${row.borrowerName} ${row.assetTag}`
        .toLowerCase()
        .includes(searchText);
      const statusOk = status === "Semua" ? true : row.status === status;
      return searchOk && statusOk;
    });
  }, [rentalRows, search, status]);

  const filteredRequestRows = useMemo(() => {
    const searchText = search.toLowerCase();
    return requestRows.filter((row) => {
      const searchOk = `${row.assetName} ${row.requesterName}`
        .toLowerCase()
        .includes(searchText);
      const statusOk = status === "Semua" ? true : row.status === status;
      return searchOk && statusOk;
    });
  }, [requestRows, search, status]);

  const filteredReturnRows = useMemo(() => {
    const searchText = search.toLowerCase();
    return returnRows.filter((row) => {
      const searchOk = `${row.assetName} ${row.borrowerName}`
        .toLowerCase()
        .includes(searchText);
      return searchOk;
    });
  }, [returnRows, search]);

  const isMutating = statusMutation.isPending || completeMutation.isPending;

  const approveRequest = async (bookingId: string) => {
    try {
      await statusMutation.mutateAsync({ bookingId, status: "AWAITING_DP" });
      showToastSuccess("Pengajuan disetujui", "Status pengajuan diperbarui.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyetujui pengajuan";
      showToastError("Gagal menyetujui", message);
    }
  };

  const rejectRequest = async (bookingId: string) => {
    try {
      await statusMutation.mutateAsync({ bookingId, status: "REJECTED" });
      showToastSuccess("Pengajuan ditolak", "Status pengajuan diperbarui.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menolak pengajuan";
      showToastError("Gagal menolak", message);
    }
  };

  const completeReturn = async (bookingId: string) => {
    try {
      await completeMutation.mutateAsync(bookingId);
      showToastSuccess("Pengembalian selesai", "Status booking diperbarui menjadi selesai.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menyelesaikan pengembalian";
      showToastError("Gagal menyimpan pengembalian", message);
    }
  };

  return (
    <AssetRentalFeatureDemoShell
      title={section === "penyewaan" ? "Penyewaan" : section === "pengajuan" ? "Pengajuan Sewa" : "Pengembalian"}
      activeItem={sectionMenu[section]}
      actions={
        section === "pengembalian" ? (
          <Button
            type="button"
            variant="outline"
            className="h-8 border-slate-200 bg-white text-slate-600"
            onClick={() => {
              if (filteredReturnRows.length === 0) {
                showToastWarning("Tidak ada data", "Tidak ada pengembalian yang bisa diproses.");
                return;
              }
              overlays.openMarkReturn(filteredReturnRows[0].id);
            }}
            disabled={isMutating}
          >
            Tandai Selesai Pengembalian
          </Button>
        ) : null
      }
    >
      {bookingsQuery.isLoading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-600">
          Memuat data penyewaan aset...
        </div>
      ) : null}

      {bookingsQuery.isError ? (
        <div className="space-y-3 rounded-xl border border-red-200 bg-red-50 px-4 py-5 text-sm text-red-700">
          <p>{(bookingsQuery.error as Error).message}</p>
          <Button
            type="button"
            variant="outline"
            className="border-red-200 bg-white text-red-700"
            onClick={() => bookingsQuery.refetch()}
          >
            Coba Lagi
          </Button>
        </div>
      ) : null}

      {!bookingsQuery.isLoading && !bookingsQuery.isError && section === "penyewaan" ? (
        <RentalListFeature
          rows={filteredRentalRows}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          buildDetailHref={(id) =>
            `${sectionDetailBasePath.penyewaan}/${encodeURIComponent(id)}`
          }
          actionDisabled={isMutating}
          onRowAction={(id) => {
            const row = filteredRentalRows.find((item) => item.id === id);
            if (!row || row.status === "Selesai") {
              showToastWarning("Aksi tidak tersedia", "Booking ini sudah selesai.");
              return;
            }
            overlays.openConfirm(id);
          }}
        />
      ) : null}

      {!bookingsQuery.isLoading && !bookingsQuery.isError && section === "pengajuan" ? (
        <RentalRequestListFeature
          rows={filteredRequestRows}
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          buildDetailHref={(id) =>
            `${sectionDetailBasePath.pengajuan}/${encodeURIComponent(id)}`
          }
          onApprove={approveRequest}
          onReject={(id) => overlays.openReject(id)}
          actionDisabled={isMutating}
        />
      ) : null}

      {!bookingsQuery.isLoading && !bookingsQuery.isError && section === "pengembalian" ? (
        <ReturnListFeature
          rows={filteredReturnRows}
          search={search}
          onSearchChange={setSearch}
          buildDetailHref={(id) =>
            `${sectionDetailBasePath.pengembalian}/${encodeURIComponent(id)}`
          }
          onProcess={(id) => overlays.openConfirm(id)}
          actionDisabled={isMutating}
        />
      ) : null}

      <RejectRequestModalFeature
        open={overlays.rejectOpen}
        onOpenChange={(open) => {
          if (!open) overlays.closeReject();
        }}
        onConfirm={async () => {
          if (!overlays.selectedId) {
            overlays.closeReject();
            return;
          }
          await rejectRequest(overlays.selectedId);
          overlays.closeReject();
        }}
      />

      <ReturnConfirmationModalFeature
        open={overlays.confirmOpen}
        onOpenChange={(open) => {
          if (!open) overlays.closeConfirm();
        }}
        onConfirm={() => {
          const selectedId = overlays.selectedId;
          if (!selectedId) {
            overlays.closeConfirm();
            return;
          }
          overlays.closeConfirm();
          overlays.openMarkReturn(selectedId);
        }}
      />

      <MarkReturnModalFeature
        open={overlays.markReturnOpen}
        onOpenChange={(open) => {
          if (!open) overlays.closeMarkReturn();
        }}
        onConfirm={async () => {
          if (!overlays.selectedId) {
            overlays.closeMarkReturn();
            return;
          }
          await completeReturn(overlays.selectedId);
          overlays.closeMarkReturn();
        }}
      />
    </AssetRentalFeatureDemoShell>
  );
}
