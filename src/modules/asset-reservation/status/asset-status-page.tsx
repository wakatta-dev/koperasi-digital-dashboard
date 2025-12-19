/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import { DetailDescription } from "../detail/components/detail-description";
import { DetailFacilities } from "../detail/components/detail-facilities";
import { DetailRecommendations } from "../detail/components/detail-recommendations";
import { STATUS_FACILITIES, type ReservationStatus } from "./constants";
import { StatusBreadcrumb } from "./components/status-breadcrumb";
import { StatusHeader } from "./components/status-header";
import { StatusHero } from "./components/status-hero";
import { StatusRenterCard } from "./components/status-renter-card";
import { StatusSidebar } from "./components/status-sidebar";
import { CancelRequestModal } from "./components/cancel-request-modal";
import React, { useMemo, useState } from "react";
import { StatusTimeline } from "./components/status-timeline";
import type { ReservationSummary } from "../types";
import { useAssetDetail, useReservation } from "../hooks";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type AssetStatusPageProps = {
  status: ReservationStatus;
  reservationId?: string;
};

function formatDateLabel(date?: string) {
  if (!date) return "-";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "-";
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function calculateDurationLabel(start?: string, end?: string) {
  const startDate = start ? new Date(start) : null;
  const endDate = end ? new Date(end) : null;
  if (!startDate || !endDate || Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return "Durasi tidak diketahui";
  }
  const diffDays = Math.max(
    1,
    Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
  );
  return `${diffDays} Hari`;
}

function humanizeEvent(event: string) {
  const labels: Record<string, string> = {
    reservation_created: "Permintaan dibuat",
    payment_completed: "Pembayaran selesai",
  };
  return labels[event] ?? event.replaceAll("_", " ");
}

function mapAssetForStatus(asset: any) {
  if (!asset) return null;
  const rateType = (asset.rate_type || asset.rateType || "").toLowerCase();
  const unit = rateType === "hourly" ? "/jam" : "/hari";
  const priceValue = Number(asset.rate_amount ?? 0);
  return {
    id: String(asset.id ?? ""),
    title: asset.name || "",
    price: priceValue > 0 ? `Rp${priceValue.toLocaleString("id-ID")}` : "",
    unit,
    location: asset.location || "",
    heroImage: asset.photo_url || "",
  };
}

function mapStatus(status: ReservationSummary["status"]): ReservationStatus {
  if (status === "confirmed_dp" || status === "confirmed_full") return "confirmed";
  if (status === "awaiting_settlement") return "confirmed";
  return "pending";
}

export function AssetStatusPage({ status, reservationId }: AssetStatusPageProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const {
    data: reservation,
    isLoading: loading,
    error,
  } = useReservation(reservationId);
  const errorMessage = useMemo(
    () => (error instanceof Error ? error.message : error ? String(error) : null),
    [error]
  );
  const resolvedReservationId = reservation?.reservationId ?? reservationId;
  const displayStatus = reservation ? mapStatus(reservation.status) : status;
  const { data: assetData } = useAssetDetail(reservation?.assetId);
  const asset = useMemo(() => mapAssetForStatus(assetData), [assetData]);
  const descriptions = useMemo(() => {
    if (assetData?.description?.trim()) {
      return assetData.description.split("\n").filter(Boolean);
    }
    return [];
  }, [assetData?.description]);
  const requestInfo = useMemo(() => {
    if (!reservation) return null;
    const submitted = reservation.submittedAt
      ? `Diajukan pada ${new Date(reservation.submittedAt).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "";
    return {
      id: `#${reservation.reservationId}`,
      submittedAt: submitted || "Waktu pengajuan tidak tersedia",
      renterName: reservation.renterName || "-",
      renterContact: reservation.renterContact || "-",
      dateRange: {
        start: formatDateLabel(reservation.startDate),
        end: formatDateLabel(reservation.endDate),
        duration: calculateDurationLabel(reservation.startDate, reservation.endDate),
      },
      purpose: reservation.purpose || "-",
    };
  }, [reservation]);

  const timelineItems = useMemo(() => {
    if (reservation?.timeline?.length) {
      return reservation.timeline.map((item, idx, arr) => ({
        status: humanizeEvent(item.event),
        description:
          item.meta?.description ??
          (item.meta?.status ? `Status: ${item.meta.status}` : "Pembaruan status"),
        time: new Date(item.at).toLocaleString("id-ID"),
        done: idx < arr.length - 1,
        active: idx === arr.length - 1,
      }));
    }
    return [];
  }, [reservation, displayStatus]);

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <StatusBreadcrumb currentLabel="Detail Permintaan" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {resolvedReservationId ? (
              <div className="mb-6 text-sm text-gray-800 dark:text-gray-200 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-3">
                <div className="font-semibold">ID Reservasi: {resolvedReservationId}</div>
                {reservation ? (
                  <div className="flex flex-wrap gap-4 mt-1">
                    <span>Status: {reservation.status}</span>
                    <span>
                      DP: Rp{reservation.amounts.dp.toLocaleString("id-ID")} · Sisa: Rp
                      {reservation.amounts.remaining.toLocaleString("id-ID")}
                    </span>
                  </div>
                ) : null}
                {loading ? (
                  <div className="text-xs text-gray-500">Memuat status reservasi...</div>
                ) : null}
                {errorMessage ? (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    Gagal memuat reservasi: {errorMessage}
                  </div>
                ) : null}
              </div>
            ) : null}

            {loading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12 animate-pulse">
                <div className="lg:col-span-2 space-y-6">
                  <div className="h-10 bg-gray-200 dark:bg-gray-800 rounded-lg w-1/2" />
                  <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  <div className="h-40 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                  <div className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>
                <div className="lg:col-span-1 space-y-4">
                  <div className="h-72 bg-gray-200 dark:bg-gray-800 rounded-2xl" />
                  <div className="h-32 bg-gray-200 dark:bg-gray-800 rounded-xl" />
                </div>
              </div>
            ) : null}

            {!loading && errorMessage ? (
              <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                Data reservasi gagal dimuat.
              </div>
            ) : null}

            {!loading && !reservation ? (
              <div className="text-sm text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                Reservasi tidak ditemukan atau belum tersedia.
              </div>
            ) : null}

            {reservation ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
                <div className="lg:col-span-2 space-y-8">
                  {requestInfo ? (
                    <StatusHeader requestId={requestInfo.id} submittedAt={requestInfo.submittedAt} />
                  ) : null}
                  {asset ? <StatusHero imageUrl={asset.heroImage} title={asset.title || "Aset"} /> : null}
                  <div className="space-y-6">
                    {asset ? (
                      <div>
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                            {asset.title || "Aset"}
                          </h2>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-[#4338ca]">
                              {asset.price || "-"}
                              <span className="text-base font-normal text-gray-500 dark:text-gray-400">
                                {asset.unit}
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <span className="material-icons-outlined text-lg">
                            location_on
                          </span>
                          <span className="text-sm">{asset.location || "-"}</span>
                        </div>
                      </div>
                    ) : null}

                    {requestInfo ? (
                      <StatusRenterCard
                        renterName={requestInfo.renterName}
                        renterContact={requestInfo.renterContact}
                        dateRange={requestInfo.dateRange}
                        purpose={requestInfo.purpose}
                      />
                    ) : null}

                    {timelineItems.length > 0 ? <StatusTimeline items={timelineItems} /> : null}

                    {descriptions.length > 0 ? <DetailDescription paragraphs={descriptions} /> : null}
                    <DetailFacilities facilities={STATUS_FACILITIES} />
                  </div>
                </div>

                <div className="lg:col-span-1">
                  <StatusSidebar
                    status={displayStatus}
                    amounts={reservation?.amounts}
                    onCancel={() => setCancelOpen(true)}
                    onReschedule={() => setRescheduleOpen(true)}
                  />
                </div>
              </div>
            ) : null}

            {asset?.id ? <DetailRecommendations currentId={asset.id} /> : null}
          </div>
        </main>
        <AssetReservationFooter />
        <CancelRequestModal open={cancelOpen} onOpenChange={setCancelOpen} onConfirm={() => setCancelOpen(false)} />
        <CancelRequestModal
          open={rescheduleOpen}
          onOpenChange={setRescheduleOpen}
          mode="reschedule"
          onConfirm={() => setRescheduleOpen(false)}
        />
      </div>
    </div>
  );
}
