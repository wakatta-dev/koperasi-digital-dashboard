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
import { createAsset, uploadAssetImage } from "@/services/api/assets";
import type { CreateAssetRentalRequest } from "@/types/api/asset-rental";

import { AssetCreateFormFeature } from "./features/AssetCreateFormFeature";
import { toFormOptionGroups, useAssetMasterData } from "../hooks/use-asset-master-data";
import type { AssetFormModel } from "../types/stitch";

const ASSET_MANAGEMENT_PATH = "/bumdes/asset/manajemen";
const DEFAULT_RATE_AMOUNT = 1000;

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
        throw new Error(response.message || "Gagal menambah aset");
      }
      return response.data;
    },
  });

  const handleSubmit = async (form: AssetFormModel) => {
    setIsSaving(true);
    const payload: CreateAssetRentalRequest = {
      name: form.name.trim(),
      rate_type: mapCategoryToRateType(form.category),
      rate_amount: parsePositiveAmount(form.priceDisplay),
      category: form.category.trim(),
      availability_status: form.status.trim(),
      location: form.location.trim(),
      serial_number: form.serialNumber.trim() || undefined,
      assigned_to: form.assignedTo.trim() || undefined,
      purchase_date: form.purchaseDate || undefined,
      vendor: form.vendor.trim() || undefined,
      purchase_price: parseOptionalAmount(form.priceDisplay),
      warranty_end_date: form.warrantyEndDate || undefined,
      specifications: form.attributes
        .map((attribute) => ({
          label: attribute.label.trim(),
          value: attribute.value.trim(),
        }))
        .filter((attribute) => attribute.label || attribute.value),
      description: composeDescription(form) || undefined,
    };
    let createdAssetId: string | number | null = null;

    try {
      const createdAsset = await createMutation.mutateAsync(payload);
      createdAssetId = createdAsset.id;

      if (form.imageFile) {
        const uploadResponse = await uploadAssetImage(createdAsset.id, form.imageFile);
        if (!uploadResponse.success || !uploadResponse.data) {
          throw new Error(uploadResponse.message || "Gagal mengunggah gambar aset");
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
        showToastError(
          "Upload gambar gagal",
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
    <div className="mx-auto max-w-7xl space-y-6 text-foreground">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-800">Tambah Aset</h3>
            <p className="mt-1 text-sm text-slate-500">
              Isi informasi aset baru pada halaman ini.
            </p>
          </div>
          <Button asChild variant="outline" className="gap-2 border-slate-200">
            <Link href={ASSET_MANAGEMENT_PATH}>
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
