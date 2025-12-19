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
import React, { useMemo, useState } from "react";
import { StatusTimeline } from "./components/status-timeline";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

type AssetStatusPageProps = {
  status: ReservationStatus;
};

export function AssetStatusPage({ status }: AssetStatusPageProps) {
  const asset = STATUS_ASSET;
  const [cancelOpen, setCancelOpen] = useState(false);
  const [rescheduleOpen, setRescheduleOpen] = useState(false);
  const timelineItems = useMemo(() => {
    if (status === "confirmed") {
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
  }, [status]);

  return (
    <div className={plusJakarta.className}>
      <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen flex flex-col">
        <LandingNavbar activeLabel="Penyewaan Aset" />
        <main className="flex-grow pt-20">
          <StatusBreadcrumb currentLabel="Detail Permintaan" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 xl:gap-12">
              <div className="lg:col-span-2 space-y-8">
                <StatusHeader
                  requestId={REQUEST_INFO.id}
                  submittedAt={REQUEST_INFO.submittedAt}
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
                    renterName={REQUEST_INFO.renterName}
                    renterContact={REQUEST_INFO.renterContact}
                    dateRange={REQUEST_INFO.dateRange}
                    purpose={REQUEST_INFO.purpose}
                  />

                  <StatusTimeline items={timelineItems} />

                  <DetailDescription paragraphs={DETAIL_ASSET.descriptions} />
                  <DetailFacilities facilities={STATUS_FACILITIES} />
                </div>
              </div>

              <div className="lg:col-span-1">
                <StatusSidebar
                  status={status}
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
