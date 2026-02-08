/** @format */

"use client";

import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AssetRentalFeatureShell } from "@/modules/asset/components/asset-rental/AssetRentalFeatureShell";
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
import { splitAssetRentalBookings } from "../../utils/asset-rental-booking-mappers";

import { AssetRentalMarkReturnDialog } from "./AssetRentalMarkReturnDialog";
import { AssetRentalRejectRequestDialog } from "./AssetRentalRejectRequestDialog";
import { AssetRentalRentalsTable } from "./AssetRentalRentalsTable";
import { AssetRentalRequestsTable } from "./AssetRentalRequestsTable";
import { AssetRentalReturnConfirmationDialog } from "./AssetRentalReturnConfirmationDialog";
import { AssetRentalReturnsTable } from "./AssetRentalReturnsTable";

type SectionKey = "penyewaan" | "pengajuan" | "pengembalian";

const sectionDetailBasePath: Record<SectionKey, string> = {
  penyewaan: "/bumdes/asset/penyewaan",
  pengajuan: "/bumdes/asset/pengajuan-sewa",
  pengembalian: "/bumdes/asset/pengembalian",
};

type AssetRentalScheduleFeatureProps = Readonly<{
  initialSection?: SectionKey;
}>;

export function AssetRentalScheduleFeature({
  initialSection = "penyewaan",
}: AssetRentalScheduleFeatureProps) {
  const section = initialSection;
  const queryClient = useQueryClient();
  const { search, status, setSearch, setStatus } = useAssetRentalFeatureFilters();
  const overlays = useAssetRentalOverlays();

  const bookingsQuery = useQuery({
    queryKey: QK.assetRental.bookings({ source: "asset-rental-schedule" }),
    queryFn: async () => {
      const response = await getAssetRentalBookings();
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat data penyewaan aset");
      }
      return response.data;
    },
  });

  const bookingCollections = useMemo(
    () => splitAssetRentalBookings(bookingsQuery.data ?? []),
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
      const message =
        error instanceof Error ? error.message : "Gagal menyetujui pengajuan";
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
      showToastSuccess(
        "Pengembalian selesai",
        "Status booking diperbarui menjadi selesai."
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Gagal menyelesaikan pengembalian";
      showToastError("Gagal menyimpan pengembalian", message);
    }
  };

  const selectedId = overlays.selectedId;
  const selectedReturn = selectedId
    ? returnRows.find((row) => row.id === selectedId)
    : undefined;

  const scheduleTitle =
    section === "penyewaan"
      ? "Penyewaan"
      : section === "pengajuan"
        ? "Pengajuan Sewa"
        : "Pengembalian";

  return (
    <AssetRentalFeatureShell
      title={scheduleTitle}
      actions={
        section === "pengembalian" ? (
          <Button
            type="button"
            variant="outline"
            className="h-8 border-slate-200 bg-white text-slate-600"
            onClick={() => {
              if (filteredReturnRows.length === 0) {
                showToastWarning(
                  "Tidak ada data",
                  "Tidak ada pengembalian yang bisa diproses."
                );
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
        <AssetRentalRentalsTable
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
              showToastWarning(
                "Aksi tidak tersedia",
                "Booking ini sudah selesai."
              );
              return;
            }
            overlays.openConfirm(id);
          }}
        />
      ) : null}

      {!bookingsQuery.isLoading && !bookingsQuery.isError && section === "pengajuan" ? (
        <AssetRentalRequestsTable
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
        <AssetRentalReturnsTable
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

      <AssetRentalRejectRequestDialog
        open={overlays.rejectOpen}
        onOpenChange={(open) => {
          if (!open) overlays.closeReject();
        }}
        onConfirm={async (_reason) => {
          if (!overlays.selectedId) {
            overlays.closeReject();
            return;
          }
          await rejectRequest(overlays.selectedId);
          overlays.closeReject();
        }}
      />

      <AssetRentalReturnConfirmationDialog
        open={overlays.confirmOpen}
        onOpenChange={(open) => {
          if (!open) overlays.closeConfirm();
        }}
        onConfirm={() => {
          const nextId = overlays.selectedId;
          if (!nextId) {
            overlays.closeConfirm();
            return;
          }
          overlays.closeConfirm();
          overlays.openMarkReturn(nextId);
        }}
      />

      <AssetRentalMarkReturnDialog
        open={overlays.markReturnOpen}
        onOpenChange={(open) => {
          if (!open) overlays.closeMarkReturn();
        }}
        assetName={selectedReturn?.assetName}
        renterName={selectedReturn?.borrowerName}
        onConfirm={async (_payload) => {
          const bookingId = overlays.selectedId;
          if (!bookingId) {
            overlays.closeMarkReturn();
            return;
          }
          await completeReturn(bookingId);
          overlays.closeMarkReturn();
        }}
      />
    </AssetRentalFeatureShell>
  );
}
