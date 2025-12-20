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
import React, { useEffect, useMemo, useState } from "react";
import { StatusTimeline } from "./components/status-timeline";
import type { ReservationSummary } from "../types";
import { useAssetDetail, useReservation } from "../hooks";
import { verifySignedReservationToken } from "../utils/signed-link";
import { AlertCircle, CheckCircle2, Clock3 } from "lucide-react";
import { humanizeReservationStatus } from "../utils/status";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type AssetStatusPageProps = {
  status: ReservationStatus;
  reservationId?: string;
  token?: string;
  signature?: string | null;
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
  const key = (event || "").toLowerCase();
  const labels: Record<string, string> = {
    reservation_created: "Permintaan dikirim",
    pending_review: "Menunggu persetujuan",
    awaiting_dp: "Disetujui - menunggu DP",
    confirmed_dp: "DP diterima",
    awaiting_settlement: "Menunggu pelunasan",
    confirmed_full: "Reservasi terkonfirmasi",
    payment_completed: "Pembayaran selesai",
    cancelled: "Reservasi dibatalkan",
    rejected: "Permintaan ditolak",
    expired: "Reservasi kedaluwarsa",
  };
  return labels[key] ?? event.replaceAll("_", " ");
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
  switch (status) {
  case "pending_review":
    return "pending_review";
  case "awaiting_dp":
    return "awaiting_dp";
  case "confirmed_dp":
    return "confirmed_dp";
  case "awaiting_settlement":
    return "awaiting_settlement";
  case "confirmed_full":
    return "confirmed_full";
  case "cancelled":
    return "cancelled";
  case "expired":
    return "expired";
  case "rejected":
    return "rejected";
  default:
    return "pending_review";
  }
}

export function AssetStatusPage({ status, reservationId, token, signature }: AssetStatusPageProps) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const [decoded, setDecoded] = useState<ReservationSummary | null>(null);
  const [tokenError, setTokenError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<{ text: string; tone: "info" | "success" | "error" } | null>(null);
  const [actionLoading, setActionLoading] = useState<"cancel" | "reschedule" | null>(null);
  const {
    data: reservation,
    isLoading: loading,
    error,
  } = useReservation(decoded?.reservationId || reservationId);
  const errorMessage = useMemo(() => (error instanceof Error ? error.message : error ? String(error) : null), [error]);
  const resolvedReservationId = reservation?.reservationId ?? decoded?.reservationId ?? reservationId;
  const displayStatus = reservation ? mapStatus(reservation.status) : decoded ? mapStatus(decoded.status) : status;
  const { data: assetData } = useAssetDetail(reservation?.assetId);
  const asset = useMemo(() => mapAssetForStatus(assetData), [assetData]);
  const descriptions = useMemo(() => {
    if (assetData?.description?.trim()) {
      return assetData.description.split("\n").filter(Boolean);
    }
    return [];
  }, [assetData?.description]);
  const requestInfo = useMemo(() => {
    if (!reservation && !decoded) return null;
    const base = reservation ?? decoded;
    if (!base) return null;
    const submitted = base.submittedAt
      ? `Diajukan pada ${new Date(base.submittedAt).toLocaleString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}`
      : "";
    return {
      id: `#${base.reservationId}`,
      submittedAt: submitted || "Waktu pengajuan tidak tersedia",
      renterName: base.renterName || "-",
      renterContact: base.renterContact || "-",
      dateRange: {
        start: formatDateLabel(base.startDate),
        end: formatDateLabel(base.endDate),
        duration: calculateDurationLabel(base.startDate, base.endDate),
      },
      purpose: base.purpose || "-",
    };
  }, [reservation, decoded]);

  const timelineItems = useMemo(() => {
    if (reservation?.timeline?.length) {
      return reservation.timeline.map((item, idx, arr) => ({
        status: humanizeEvent(item.event || item.meta?.status || ""),
        description:
          item.meta?.description ??
          (item.meta?.status ? `Status: ${humanizeEvent(item.meta.status)}` : "Pembaruan status"),
        time: new Date(item.at).toLocaleString("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        done: idx < arr.length - 1,
        active: idx === arr.length - 1,
      }));
    }
    return [];
  }, [reservation, displayStatus]);

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!token) return;
      const result = await verifySignedReservationToken(token, signature || undefined);
      if (ignore) return;
      if (!result.ok || !result.payload) {
        setTokenError(result.reason || "Tautan tidak valid");
        return;
      }
      setTokenError(null);
      setDecoded({
        reservationId: result.payload.id,
        assetId: "",
        status: (result.payload.status as any) || "pending_review",
        startDate: result.payload.exp ? new Date().toISOString() : "",
        endDate: result.payload.exp ? new Date().toISOString() : "",
        amounts: { total: 0, dp: 0, remaining: 0 },
        holdExpiresAt: result.payload.exp,
      });
    }
    run();
    return () => {
      ignore = true;
    };
  }, [token, signature]);

  const handleCancel = async () => {
    if (!resolvedReservationId) return;
    setActionLoading("cancel");
    setActionMessage(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActionMessage({
        text: "Permintaan pembatalan dikirim. Tim akan menindaklanjuti.",
        tone: "success",
      });
    } catch (err) {
      setActionMessage({
        text: err instanceof Error ? err.message : "Gagal mengirim permintaan pembatalan.",
        tone: "error",
      });
    } finally {
      setActionLoading(null);
      setCancelOpen(false);
    }
  };

  const handleReschedule = async () => {
    if (!resolvedReservationId) return;
    setActionLoading("reschedule");
    setActionMessage(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setActionMessage({
        text: "Permintaan penjadwalan ulang dikirim. Tim akan mengkonfirmasi jadwal baru.",
        tone: "success",
      });
    } catch (err) {
      setActionMessage({
        text: err instanceof Error ? err.message : "Gagal mengirim permintaan penjadwalan ulang.",
        tone: "error",
      });
    } finally {
      setActionLoading(null);
      setRescheduleOpen(false);
    }
  };

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <StatusBreadcrumb currentLabel="Detail Permintaan" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {tokenError ? (
              <div className="mb-4 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                {tokenError}
              </div>
            ) : null}
            {resolvedReservationId ? (
              <div className="mb-4 text-xs text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                Simpan tautan ini untuk memeriksa status reservasi Anda di kemudian hari.
              </div>
            ) : null}
            {actionMessage ? (
              <div
                className={`mb-4 text-sm rounded-lg p-4 border flex items-start gap-2 ${
                  actionMessage.tone === "success"
                    ? "text-green-700 bg-green-50 dark:text-green-200 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : actionMessage.tone === "error"
                    ? "text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                    : "text-sky-700 bg-sky-50 dark:text-sky-200 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800"
                }`}
              >
                {actionMessage.tone === "success" ? (
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                ) : actionMessage.tone === "error" ? (
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Clock3 className="w-5 h-5 flex-shrink-0" />
                )}
                <span>{actionMessage.text}</span>
              </div>
            ) : null}
            {resolvedReservationId ? (
              <div className="mb-6 text-sm text-gray-800 dark:text-gray-200 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-lg px-4 py-3">
                <div className="font-semibold">ID Reservasi: {resolvedReservationId}</div>
                {reservation ? (
                  <div className="flex flex-wrap gap-4 mt-1">
                    <span>
                      Status: {humanizeReservationStatus(reservation.status)}
                    </span>
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

            {!loading && !reservation && !tokenError ? (
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
                  reservationId={resolvedReservationId}
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
        <CancelRequestModal
          open={cancelOpen}
          onOpenChange={setCancelOpen}
          submitting={actionLoading === "cancel"}
          onConfirm={handleCancel}
        />
        <CancelRequestModal
          open={rescheduleOpen}
          onOpenChange={setRescheduleOpen}
          mode="reschedule"
          submitting={actionLoading === "reschedule"}
          onConfirm={handleReschedule}
        />
      </div>
    </div>
  );
}
