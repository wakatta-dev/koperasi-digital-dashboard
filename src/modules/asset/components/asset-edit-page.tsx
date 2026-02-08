/** @format */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { QK } from "@/hooks/queries/queryKeys";
import { showToastError, showToastSuccess } from "@/lib/toast";
import { getAssetById, updateAsset, uploadAssetImage } from "@/services/api/assets";
import type { UpdateAssetRentalRequest } from "@/types/api/asset-rental";

import { AssetEditFormFeature } from "./stitch/AssetEditFormFeature";
import { toFormOptionGroups, useAssetMasterData } from "../hooks/use-asset-master-data";
import { mapContractAssetToFormModel } from "../utils/stitch-contract-mappers";
import type { AssetFormModel } from "../types/stitch";

const ASSET_MANAGEMENT_PATH = "/bumdes/asset/manajemen";
const DEFAULT_RATE_AMOUNT = 1000;

type AssetEditPageProps = Readonly<{
  assetId?: string;
}>;

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

function composeDescription(form: AssetFormModel) {
  const attributesText = form.attributes
    .map((attribute) => {
      const label = attribute.label.trim();
      const value = attribute.value.trim();
      if (!label && !value) return "";
      return `${label || "Atribut"}: ${value || "-"}`;
    })
    .filter(Boolean)
    .join("; ");

  return [
    attributesText ? `Spesifikasi: ${attributesText}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function AssetEditPage({ assetId }: AssetEditPageProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSaving, setIsSaving] = useState(false);
  const masterDataQuery = useAssetMasterData();
  const formOptions = toFormOptionGroups(masterDataQuery.data);

  const handleClose = () => {
    router.push(ASSET_MANAGEMENT_PATH);
  };

  const detailQuery = useQuery({
    enabled: Boolean(assetId),
    queryKey: QK.assetRental.detail(assetId ?? "unknown"),
    queryFn: async () => {
      const response = await getAssetById(assetId ?? "");
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memuat detail aset");
      }
      return response.data;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: UpdateAssetRentalRequest) => {
      if (!assetId) {
        throw new Error("Asset ID tidak ditemukan");
      }
      const response = await updateAsset(assetId, payload);
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui aset");
      }
      return response.data;
    },
  });

  const handleSubmit = async (form: AssetFormModel) => {
    setIsSaving(true);
    const payload: UpdateAssetRentalRequest = {
      name: form.name.trim(),
      rate_type: mapCategoryToRateType(form.category),
      rate_amount: parsePositiveAmount(form.priceDisplay),
      category: form.category.trim(),
      availability_status: form.status.trim(),
      location: form.location.trim(),
      serial_number: form.serialNumber.trim() || undefined,
      assigned_to: form.assignedTo.trim() || undefined,
      purchase_date: form.purchaseDate || "",
      vendor: form.vendor.trim() || undefined,
      purchase_price: parseOptionalAmount(form.priceDisplay) ?? 0,
      warranty_end_date: form.warrantyEndDate || "",
      specifications: form.attributes
        .map((attribute) => ({
          label: attribute.label.trim(),
          value: attribute.value.trim(),
        }))
        .filter((attribute) => attribute.label || attribute.value),
      description: composeDescription(form) || undefined,
    };
    try {
      await updateMutation.mutateAsync(payload);

      if (assetId && form.imageFile) {
        const uploadResponse = await uploadAssetImage(assetId, form.imageFile);
        if (!uploadResponse.success || !uploadResponse.data) {
          throw new Error(uploadResponse.message || "Gagal mengunggah gambar aset");
        }
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["asset-rental", "assets"] }),
        queryClient.invalidateQueries({
          queryKey: QK.assetRental.detail(assetId ?? "unknown"),
        }),
      ]);

      showToastSuccess("Aset diperbarui", "Perubahan aset berhasil disimpan.");
      handleClose();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal memperbarui aset";
      showToastError("Gagal memperbarui aset", message);
    } finally {
      setIsSaving(false);
    }
  };

  const formModel = detailQuery.data
    ? mapContractAssetToFormModel(detailQuery.data, "edit")
    : undefined;

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-foreground">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Edit Aset</h3>
            <p className="mt-1 text-sm text-slate-500">
              Ubah informasi aset pada halaman ini.
            </p>
            {assetId ? (
              <p className="mt-1 text-xs font-medium text-slate-500">Asset ID: {assetId}</p>
            ) : null}
          </div>
          <Button asChild variant="outline" className="gap-2 border-slate-200">
            <Link href={ASSET_MANAGEMENT_PATH}>
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Daftar Aset</span>
            </Link>
          </Button>
        </div>

        {!assetId ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-6 text-sm text-amber-700">
            Asset ID tidak ditemukan. Silakan kembali ke daftar aset dan pilih aset yang ingin diedit.
          </div>
        ) : detailQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            Memuat detail aset...
          </div>
        ) : detailQuery.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {(detailQuery.error as Error).message}
          </div>
        ) : (
          <AssetEditFormFeature
            initialModel={formModel}
            options={formOptions}
            isLoadingOptions={masterDataQuery.isLoading}
            onCancel={handleClose}
            onSubmit={handleSubmit}
            isSubmitting={isSaving || updateMutation.isPending}
          />
        )}
      </section>
    </div>
  );
}
