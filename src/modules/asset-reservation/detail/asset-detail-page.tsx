/** @format */

"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import { useMemo, useState } from "react";
import { z } from "zod";

import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { AssetReservationFooter } from "../components/reservation-footer";
import { useAssetDetail, useCreateGuestReservation } from "../hooks";
import { checkAvailability } from "./utils/availability";
import { GuestRentalApplicationFeature } from "../guest/components/application/GuestRentalApplicationFeature";
import type { GuestRentalApplicationFormValues } from "../guest/components/application/GuestRentalApplicationForm";
import type { SelectedAssetSummary } from "../guest/components/application/SelectedAssetSummaryCard";
import { SubmissionSuccessCardFeature } from "../guest/components/success/SubmissionSuccessCardFeature";
import {
  resolvePublicAssetErrorMessage,
  resolvePublicAssetStatusPresentation,
} from "../guest/utils/public-catalog";
import {
  buildAvailabilityConflictMessage,
  buildPublicReservationSuccessState,
  resolvePublicReservationSubmissionErrorMessage,
  type PublicReservationSuccessState,
} from "../guest/utils/public-reservation";

type AssetDetailPageProps = {
  assetId?: string;
};

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const formSchema = z.object({
  fullName: z.string().trim().min(1),
  phone: z.string().trim().min(1),
  email: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || z.string().email().safeParse(value).success, {
      message: "invalid",
    }),
  purpose: z.string().trim().min(1),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
});

function resolveUnit(rateType?: string) {
  return (rateType || "").toUpperCase() === "HOURLY" ? "/ jam" : "/ hari";
}

function specLookup(
  specs: Array<{ label: string; value: string }> | undefined,
  key: string,
) {
  const normalizedKey = key.trim().toLowerCase();
  const match = (specs || []).find(
    (s) => (s.label || "").trim().toLowerCase() === normalizedKey,
  );
  return match?.value?.trim() || "";
}

function formatCurrency(amount?: number) {
  const safeAmount =
    typeof amount === "number" && Number.isFinite(amount) ? amount : 0;
  return `Rp ${safeAmount.toLocaleString("id-ID")}`;
}

export function AssetDetailPage({ assetId }: AssetDetailPageProps) {
  const { data: asset, isLoading, error } = useAssetDetail(assetId);
  const errorMessage = resolvePublicAssetErrorMessage(
    error instanceof Error ? error.message : error ? String(error) : null,
  );

  const tomorrow = useMemo(
    () => new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    [],
  );

  const [values, setValues] = useState<GuestRentalApplicationFormValues>({
    fullName: "",
    phone: "",
    email: "",
    purpose: "",
    startDate: tomorrow,
    endDate: tomorrow,
  });

  const createReservation = useCreateGuestReservation();
  const [reservationSuccess, setReservationSuccess] =
    useState<PublicReservationSuccessState | null>(null);
  const [submissionMessage, setSubmissionMessage] = useState<string | null>(null);

  const selectedAsset: SelectedAssetSummary = useMemo(() => {
    const priceLabel = formatCurrency(asset?.rate_amount);
    const unitLabel = resolveUnit(asset?.rate_type);
    const title = asset?.name?.trim() || "Aset Desa";
    const status = resolvePublicAssetStatusPresentation(asset ?? null);
    const capacity = specLookup(asset?.specifications, "Kapasitas") || "-";
    const facilities = specLookup(asset?.specifications, "Fasilitas") || "-";
    const location = asset?.location?.trim() || "-";
    return {
      title,
      statusLabel: status.label,
      statusTone: status.tone,
      priceLabel,
      unitLabel,
      imageUrl:
        asset?.photo_url?.trim() ||
        "https://images.unsplash.com/photo-1559054663-e9b7f7a2b5b0?auto=format&fit=crop&w=1200&q=60",
      capacityLabel: capacity,
      facilitiesLabel: facilities,
      locationLabel: location,
    };
  }, [asset]);

  const handleSubmit = async () => {
    if (!asset?.id) return;
    setSubmissionMessage(null);
    setReservationSuccess(null);
    const parsed = formSchema.safeParse(values);
    if (!parsed.success) {
      setSubmissionMessage("Mohon lengkapi data pengajuan dengan benar sebelum dikirim.");
      return;
    }

    const start = values.startDate;
    const end = values.endDate;
    if (start > end) {
      setSubmissionMessage(
        "Tanggal selesai harus sama dengan atau setelah tanggal mulai."
      );
      return;
    }

    try {
      const availability = await checkAvailability({
        start,
        end,
        assetId: asset.id,
      });
      if (!availability.ok) {
        setSubmissionMessage(buildAvailabilityConflictMessage(availability));
        return;
      }

      const creation = await createReservation.mutateAsync({
        asset_id: asset.id,
        start_date: start,
        end_date: end,
        purpose: values.purpose.trim(),
        renter_name: values.fullName.trim(),
        renter_contact: values.phone.trim(),
        renter_email: values.email.trim() ? values.email.trim() : undefined,
      });

      setReservationSuccess(await buildPublicReservationSuccessState(creation));
    } catch (error) {
      setSubmissionMessage(
        resolvePublicReservationSubmissionErrorMessage(
          error instanceof Error ? error.message : String(error)
        )
      );
    }
  };

  return (
    <div
      className="bg-surface-subtle dark:bg-surface-dark text-surface-text dark:text-surface-text-dark min-h-screen flex flex-col"
      data-testid="asset-rental-application-page-root"
    >
      <LandingNavbar activeLabel="Penyewaan Aset" />
      <div
        className={`asset-rental-guest ${plusJakarta.className} flex min-h-0 flex-1 flex-col`}
      >
        <main
          className="flex-grow pt-20"
          data-testid="asset-rental-application-page-main"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {errorMessage || submissionMessage ? (
              <div className="mt-10 rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 px-6 py-5 text-sm text-red-700 dark:text-red-200">
                {errorMessage || submissionMessage}
              </div>
            ) : null}

            {isLoading ? (
              <div className="mt-10 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-surface-card-dark px-6 py-10 text-sm text-gray-500 dark:text-gray-400">
                Memuat detail aset...
              </div>
            ) : null}
          </div>

          {!isLoading && asset ? (
            reservationSuccess ? (
              <SubmissionSuccessCardFeature
                ticket={reservationSuccess.ticket}
                statusHref={reservationSuccess.statusHref}
                homeHref="/penyewaan-aset"
              />
            ) : (
              <GuestRentalApplicationFeature
                title="Formulir Pengajuan Sewa"
                description="Silakan lengkapi data diri dan detail penyewaan Anda di bawah ini."
                values={values}
                onValuesChange={setValues}
                submitting={createReservation.isPending}
                onSubmit={handleSubmit}
                selectedAsset={selectedAsset}
              />
            )
          ) : null}
        </main>
        <AssetReservationFooter />
      </div>
    </div>
  );
}
