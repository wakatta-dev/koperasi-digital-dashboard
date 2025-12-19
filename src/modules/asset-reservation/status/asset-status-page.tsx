/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";

import { LandingNavbar } from "@/modules/landing/components/navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import { DetailDescription } from "../detail/components/detail-description";
import { DetailFacilities } from "../detail/components/detail-facilities";
import { DetailRecommendations } from "../detail/components/detail-recommendations";
import {
  STATUS_ASSET,
  STATUS_FACILITIES,
  REQUEST_INFO,
  type ReservationStatus,
} from "./constants";
import { StatusBreadcrumb } from "./components/status-breadcrumb";
import { StatusHeader } from "./components/status-header";
import { StatusHero } from "./components/status-hero";
import { StatusRenterCard } from "./components/status-renter-card";
import { StatusSidebar } from "./components/status-sidebar";
import { DETAIL_ASSET } from "../detail/constants";
import { CancelRequestModal } from "./components/cancel-request-modal";
import React, { useEffect, useMemo, useState } from "react";
import { StatusTimeline } from "./components/status-timeline";
import { getReservation } from "@/services/api/reservations";
import type { ReservationSummary } from "../types";
import { useAssetDetail } from "../hooks";

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
    ...STATUS_ASSET,
    id: String(asset.id ?? STATUS_ASSET.id),
    title: asset.name || STATUS_ASSET.title,
    price: priceValue > 0 ? `Rp${priceValue.toLocaleString("id-ID")}` : STATUS_ASSET.price,
    unit,
    location: asset.location || STATUS_ASSET.location,
    heroImage: asset.photo_url || STATUS_ASSET.heroImage,
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
  const [reservation, setReservation] = useState<ReservationSummary | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolvedReservationId = reservation?.reservationId ?? reservationId;
  const displayStatus = reservation ? mapStatus(reservation.status) : status;
  const { data: assetData } = useAssetDetail(reservation?.assetId);
  const asset = useMemo(() => mapAssetForStatus(assetData) ?? STATUS_ASSET, [assetData]);
  const descriptions = useMemo(() => {
    if (assetData?.description?.trim()) {
      return assetData.description.split("\n").filter(Boolean);
    }
    return DETAIL_ASSET.descriptions;
  }, [assetData?.description]);
  const requestInfo = useMemo(() => {
    if (!reservation) return REQUEST_INFO;
    const submitted = reservation.submittedAt
      ? `Diajukan pada ${new Date(reservation.submittedAt).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : REQUEST_INFO.submittedAt;
    return {
      ...REQUEST_INFO,
      id: `#${reservation.reservationId}`,
      submittedAt: submitted,
      renterName: reservation.renterName || REQUEST_INFO.renterName,
      renterContact: reservation.renterContact || REQUEST_INFO.renterContact,
      dateRange: {
        start: formatDateLabel(reservation.startDate) || REQUEST_INFO.dateRange.start,
        end: formatDateLabel(reservation.endDate) || REQUEST_INFO.dateRange.end,
        duration: calculateDurationLabel(reservation.startDate, reservation.endDate),
      },
      purpose: reservation.purpose || REQUEST_INFO.purpose,
    };
  }, [reservation]);

  useEffect(() => {
    let ignore = false;
    async function fetchReservation() {
      if (!reservationId) return;
      setLoading(true);
      setError(null);
      try {
        const res = await getReservation(reservationId);
        if (ignore) return;
        if (res.success && res.data) {
          setReservation({
            reservationId: res.data.reservation_id,
            assetId: res.data.asset_id,
            assetName: res.data.asset_name,
            renterName: res.data.renter_name,
            renterContact: res.data.renter_contact,
            purpose: res.data.purpose,
            submittedAt: res.data.submitted_at,
            startDate: res.data.start_date,
            endDate: res.data.end_date,
            status: res.data.status,
            holdExpiresAt: res.data.hold_expires_at,
            amounts: res.data.amounts,
            timeline: res.data.timeline?.map((t) => ({
              event: t.event,
              at: t.at,
              meta: t.meta,
            })),
          });
        } else {
          setError(res.message || "Tidak dapat memuat reservasi.");
        }
      } catch (err) {
        if (!ignore) setError(err instanceof Error ? err.message : "Gagal memuat reservasi.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchReservation();
    return () => {
      ignore = true;
    };
  }, [reservationId]);

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
    if (reservation) {
      return [
        {
          status: "Permintaan dibuat",
          description: "Reservasi disimpan dan menunggu konfirmasi.",
          time: reservation.submittedAt
            ? new Date(reservation.submittedAt).toLocaleString("id-ID")
            : "-",
          active: true,
        },
      ];
    }
    if (displayStatus === "confirmed") {
      return [
        {
          status: "Permintaan diterima",
          description: "Tim BUMDes memeriksa ketersediaan.",
          time: "24 Okt 2024, 09:00",
          done: true,
        },
        {
          status: "Aktif (DP dibayar)",
          description: "Reservasi dikunci, selesaikan pelunasan sebelum H-3.",
          time: "24 Okt 2024, 10:00",
          active: true,
        },
        {
          status: "Pelunasan",
          description: "Pembayaran akhir menyelesaikan reservasi.",
          time: "-",
        },
      ];
    }
    return [
      {
        status: "Permintaan diterima",
        description: "Tim BUMDes memeriksa ketersediaan.",
        time: "24 Okt 2024, 09:00",
        done: true,
      },
      {
        status: "Menunggu DP",
        description: "Silakan lakukan pembayaran DP untuk mengamankan jadwal.",
        time: "24 Okt 2024, 09:15",
        active: true,
      },
      {
        status: "Aktif (DP dibayar)",
        description: "Reservasi dikunci, lanjutkan pelunasan sebelum H-3.",
        time: "-",
      },
    ];
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
                {loading ? <div className="text-xs text-gray-500">Memuat status reservasi...</div> : null}
                {error ? (
                  <div className="text-xs text-red-600 dark:text-red-400">
                    Gagal memuat reservasi: {error}
                  </div>
                ) : null}
              </div>
            ) : null}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
              <div className="lg:col-span-2 space-y-8">
                <StatusHeader
                  requestId={requestInfo.id}
                  submittedAt={requestInfo.submittedAt}
                />
                <StatusHero imageUrl={asset.heroImage} title={asset.title} />
                <div className="space-y-6">
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                      <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">
                        {asset.title}
                      </h2>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#4338ca]">
                          {asset.price}
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
                      <span className="text-sm">{asset.location}</span>
                    </div>
                  </div>

                  <StatusRenterCard
                    renterName={requestInfo.renterName}
                    renterContact={requestInfo.renterContact}
                    dateRange={requestInfo.dateRange}
                    purpose={requestInfo.purpose}
                  />

                  <StatusTimeline items={timelineItems} />

                  <DetailDescription paragraphs={descriptions} />
                  <DetailFacilities facilities={STATUS_FACILITIES} />
                </div>
              </div>

              <div className="lg:col-span-1">
                <StatusSidebar
                  status={displayStatus}
                  onCancel={() => setCancelOpen(true)}
                  onReschedule={() => setRescheduleOpen(true)}
                />
              </div>
            </div>

            <DetailRecommendations currentId={asset.id} />
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
