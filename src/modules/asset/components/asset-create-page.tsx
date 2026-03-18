/** @format */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { QK } from "@/hooks/queries/queryKeys";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { createAsset, updateAsset, uploadAssetImage } from "@/services/api/assets";
import type { ApiResponse } from "@/types/api";
import type { CreateAssetRentalRequest } from "@/types/api/asset-rental";

import { AssetCreateFormFeature } from "./features/AssetCreateFormFeature";
import { toFormOptionGroups, useAssetMasterData } from "../hooks/use-asset-master-data";
import type { AssetFormModel } from "../types/stitch";
import {
  isPublicAvailabilityStatus,
  resolveCreateAvailabilityStatus,
} from "../utils/create-asset-flow";

const ASSET_MANAGEMENT_PATH = "/bumdes/asset/manajemen";
const DEFAULT_RATE_AMOUNT = 1000;

function extractApiErrorMessage<T>(
  response: ApiResponse<T>,
  fallback: string
): string {
  const firstError = Object.values(response.errors ?? {})
    .flat()
    .find((value) => typeof value === "string" && value.trim().length > 0);
  return firstError ?? response.message ?? fallback;
}

function parsePositiveAmount(value: string) {
  const numeric = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : DEFAULT_RATE_AMOUNT;
}

function parseOptionalAmount(value: string) {
  const numeric = Number(value.replace(/[^\d]/g, ""));
  return Number.isFinite(numeric) && numeric > 0 ? numeric : undefined;
}

function mapCategoryToRateType(category: string): "DAILY" | "HOURLY" {
  const key = category.trim().toLowerCase();
  if (key === "aset per jam" || key === "elektronik" || key === "peralatan") {
    return "HOURLY";
  }
  return "DAILY";
}

export function AssetCreatePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const masterDataQuery = useAssetMasterData();
  const formOptions = toFormOptionGroups(masterDataQuery.data);

  const handleClose = () => {
    router.push(ASSET_MANAGEMENT_PATH);
  };

  const createMutation = useMutation({
    mutationFn: async (payload: CreateAssetRentalRequest) => {
      const response = await createAsset(payload);
      if (!response.success || !response.data) {
        throw new Error(extractApiErrorMessage(response, "Gagal menambah aset"));
      }
      return response.data;
    },
  });

  const handleSubmit = async (form: AssetFormModel) => {
    const desiredAvailabilityStatus = form.status.trim();
    const createAvailabilityStatus =
      resolveCreateAvailabilityStatus(desiredAvailabilityStatus);

    if (isPublicAvailabilityStatus(desiredAvailabilityStatus) && !form.imageFile) {
      showToastError(
        "Gambar aset wajib",
        "Status Tersedia baru bisa dipakai setelah gambar aset diunggah."
      );
      return;
    }

    setIsSaving(true);
    const payload: CreateAssetRentalRequest = {
      name: form.name.trim(),
      rate_type: mapCategoryToRateType(form.category),
      rate_amount: parsePositiveAmount(form.rentalPriceDisplay),
      category: form.category.trim(),
      availability_status: createAvailabilityStatus,
      location: form.location.trim(),
      serial_number: form.serialNumber.trim() || undefined,
      assigned_to: form.assignedTo.trim() || undefined,
      purchase_date: form.purchaseDate || undefined,
      vendor: form.vendor.trim() || undefined,
      purchase_price: parseOptionalAmount(form.purchasePriceDisplay),
      warranty_end_date: form.warrantyEndDate || undefined,
      description: form.description.trim() || undefined,
    };
    let createdAssetId: string | number | null = null;
    let postCreateStep: "upload" | "activate" | null = null;

    try {
      const createdAsset = await createMutation.mutateAsync(payload);
      createdAssetId = createdAsset.id;

      if (form.imageFile) {
        postCreateStep = "upload";
        const uploadResponse = await uploadAssetImage(createdAsset.id, form.imageFile);
        if (!uploadResponse.success || !uploadResponse.data) {
          throw new Error(
            extractApiErrorMessage(uploadResponse, "Gagal mengunggah gambar aset")
          );
        }
      }

      if (
        desiredAvailabilityStatus &&
        desiredAvailabilityStatus !== (createAvailabilityStatus ?? "")
      ) {
        postCreateStep = "activate";
        const activationResponse = await updateAsset(createdAsset.id, {
          availability_status: desiredAvailabilityStatus,
        });
        if (!activationResponse.success || !activationResponse.data) {
          throw new Error(
            extractApiErrorMessage(activationResponse, "Gagal mengaktifkan status aset")
          );
        }
      }

      await queryClient.invalidateQueries({
        queryKey: ["asset-rental", "assets"],
      });
      await queryClient.invalidateQueries({
        queryKey: QK.assetRental.masterData(),
      });

      showToastSuccess("Aset ditambahkan", "Data aset berhasil disimpan.");
      handleClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal menambah aset";
      if (createdAssetId !== null) {
        const title =
          postCreateStep === "activate" ? "Aktivasi aset gagal" : "Upload gambar gagal";
        showToastError(
          title,
          `${message}. Data aset sudah dibuat, silakan unggah ulang dari halaman edit.`
        );
        router.push(`/bumdes/asset/manajemen/edit?assetId=${createdAssetId}`);
        return;
      }
      showToastError("Gagal menambah aset", message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="mx-auto max-w-7xl space-y-6 text-foreground"
      data-testid="asset-admin-create-page-root"
    >
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Tambah Aset</h3>
            <p className="mt-1 text-sm text-slate-500">
              Isi informasi aset baru pada halaman ini.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 border-slate-200">
            <Link
              href={ASSET_MANAGEMENT_PATH}
              data-testid="asset-admin-create-back-link"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Daftar Aset</span>
            </Link>
          </Button>
        </div>

        <AssetCreateFormFeature
          options={formOptions}
          isLoadingOptions={masterDataQuery.isLoading}
          onCancel={handleClose}
          onSubmit={handleSubmit}
          isSubmitting={isSaving || createMutation.isPending}
        />
      </section>
    </div>
  );
}
