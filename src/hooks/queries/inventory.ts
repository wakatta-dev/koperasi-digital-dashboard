/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import {
  adjustInventoryStock,
  archiveInventoryProduct,
  archiveInventoryVariantGroup,
  archiveInventoryVariantOption,
  createInventoryVariantGroup,
  createInventoryVariantOption,
  createInventoryProduct,
  getInventoryProduct,
  getInventoryProductVariants,
  getInventoryStockHistory,
  listInventoryProducts,
  setInitialInventoryStock,
  unarchiveInventoryProduct,
  uploadInventoryProductImage,
  uploadInventoryVariantGroupImage,
  updateInventoryVariantGroup,
  updateInventoryVariantOption,
  updateInventoryProduct,
} from "@/services/api";
import type {
  CreateInventoryProductRequest,
  CreateInventoryVariantGroupRequest,
  CreateInventoryVariantOptionRequest,
  InventoryAdjustmentRequest,
  InventoryInitialStockRequest,
  InventoryProductListResponse,
  InventoryProductResponse,
  InventoryProductVariantsResponse,
  InventoryStockHistoryEntry,
  UpdateInventoryVariantGroupRequest,
  UpdateInventoryVariantOptionRequest,
  UpdateInventoryProductRequest,
} from "@/types/api/inventory";

export type InventoryListParams = {
  q?: string;
  status?: string;
  show_in_marketplace?: boolean;
  limit?: number;
  offset?: number;
  sort?: string;
};

export function useInventoryProducts(
  params?: InventoryListParams,
  options?: { enabled?: boolean; placeholderData?: any }
) {
  const normalized = {
    limit: params?.limit ?? 20,
    offset: params?.offset ?? 0,
    ...params,
  };

  return useQuery({
    queryKey: QK.inventory.list(normalized),
    queryFn: async (): Promise<InventoryProductListResponse> =>
      ensureSuccess(await listInventoryProducts(normalized)),
    ...(options?.enabled !== undefined ? { enabled: options.enabled } : {}),
    ...(options?.placeholderData ? { placeholderData: options.placeholderData } : {}),
  });
}

export function useInventoryProduct(id?: string | number, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: QK.inventory.detail(id ?? ""),
    enabled: Boolean(id) && (options?.enabled ?? true),
    queryFn: async (): Promise<InventoryProductResponse> =>
      ensureSuccess(await getInventoryProduct(id as string | number)),
  });
}

export function useInventoryVariants(
  id?: string | number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.inventory.variants(id ?? ""),
    enabled: Boolean(id) && (options?.enabled ?? true),
    queryFn: async (): Promise<InventoryProductVariantsResponse> =>
      ensureSuccess(await getInventoryProductVariants(id as string | number)),
  });
}

export function useInventoryStockHistory(
  id?: string | number,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: QK.inventory.history(id ?? ""),
    enabled: Boolean(id) && (options?.enabled ?? true),
    queryFn: async (): Promise<InventoryStockHistoryEntry[]> =>
      ensureSuccess(await getInventoryStockHistory(id as string | number)),
  });
}

export function useInventoryActions() {
  const qc = useQueryClient();
  const invalidateLists = () =>
    qc.invalidateQueries({
      queryKey: QK.inventory.lists(),
    });
  const invalidateDetail = (id: string | number | undefined) => {
    if (!id) return;
    qc.invalidateQueries({
      queryKey: QK.inventory.detail(id),
    });
  };

  const create = useMutation({
    mutationFn: async (payload: CreateInventoryProductRequest) =>
      ensureSuccess(await createInventoryProduct(payload)),
    onSuccess: () => {
      invalidateLists();
      toast.success("Produk berhasil dibuat");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal membuat produk"),
  });

  const update = useMutation({
    mutationFn: async (vars: { id: string | number; payload: UpdateInventoryProductRequest }) =>
      ensureSuccess(await updateInventoryProduct(vars.id, vars.payload)),
    onSuccess: (_data, vars) => {
      invalidateLists();
      invalidateDetail(vars.id);
      toast.success("Produk diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui produk"),
  });

  const uploadImage = useMutation({
    mutationFn: async (vars: { id: string | number; file: File }) =>
      ensureSuccess(await uploadInventoryProductImage(vars.id, vars.file)),
    onSuccess: (_data, vars) => {
      invalidateLists();
      invalidateDetail(vars.id);
      toast.success("Foto produk diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal mengunggah foto produk"),
  });

  const archive = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await archiveInventoryProduct(id)),
    onSuccess: (_data, id) => {
      invalidateLists();
      invalidateDetail(id);
      toast.success("Produk diarsipkan");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal mengarsipkan produk"),
  });

  const unarchive = useMutation({
    mutationFn: async (id: string | number) =>
      ensureSuccess(await unarchiveInventoryProduct(id)),
    onSuccess: (_data, id) => {
      invalidateLists();
      invalidateDetail(id);
      toast.success("Produk dipulihkan");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal mengaktifkan produk"),
  });

  const initialStock = useMutation({
    mutationFn: async (vars: { id: string | number; payload: InventoryInitialStockRequest }) =>
      ensureSuccess(await setInitialInventoryStock(vars.id, vars.payload)),
    onSuccess: (_data, vars) => {
      invalidateDetail(vars.id);
      invalidateLists();
      toast.success("Stok awal tersimpan");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal menyimpan stok awal"),
  });

  const adjustStock = useMutation({
    mutationFn: async (vars: { id: string | number; payload: InventoryAdjustmentRequest }) =>
      ensureSuccess(await adjustInventoryStock(vars.id, vars.payload)),
    onSuccess: (_data, vars) => {
      invalidateDetail(vars.id);
      invalidateLists();
      toast.success("Stok diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui stok"),
  });

  return {
    create,
    update,
    uploadImage,
    archive,
    unarchive,
    initialStock,
    adjustStock,
  } as const;
}

export function useInventoryVariantActions() {
  const qc = useQueryClient();
  const invalidateVariants = (id: string | number | undefined) => {
    if (!id) return;
    qc.invalidateQueries({
      queryKey: QK.inventory.variants(id),
    });
  };

  const createGroup = useMutation({
    mutationFn: async (vars: {
      productId: string | number;
      payload: CreateInventoryVariantGroupRequest;
    }) => ensureSuccess(await createInventoryVariantGroup(vars.productId, vars.payload)),
    onSuccess: (_data, vars) => {
      invalidateVariants(vars.productId);
      toast.success("Varian grup dibuat");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal membuat varian grup"),
  });

  const updateGroup = useMutation({
    mutationFn: async (vars: {
      productId: string | number;
      groupId: string | number;
      payload: UpdateInventoryVariantGroupRequest;
    }) => ensureSuccess(await updateInventoryVariantGroup(vars.productId, vars.groupId, vars.payload)),
    onSuccess: (_data, vars) => {
      invalidateVariants(vars.productId);
      toast.success("Varian grup diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui varian grup"),
  });

  const uploadGroupImage = useMutation({
    mutationFn: async (vars: {
      productId: string | number;
      groupId: string | number;
      file: File;
    }) =>
      ensureSuccess(
        await uploadInventoryVariantGroupImage(vars.productId, vars.groupId, vars.file)
      ),
    onSuccess: (_data, vars) => {
      invalidateVariants(vars.productId);
      toast.success("Foto varian grup diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal mengunggah foto varian grup"),
  });

  const archiveGroup = useMutation({
    mutationFn: async (vars: { productId: string | number; groupId: string | number }) =>
      ensureSuccess(await archiveInventoryVariantGroup(vars.productId, vars.groupId)),
    onSuccess: (_data, vars) => {
      invalidateVariants(vars.productId);
      toast.success("Varian grup diarsipkan");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal mengarsipkan varian grup"),
  });

  const createOption = useMutation({
    mutationFn: async (vars: {
      productId: string | number;
      groupId: string | number;
      payload: CreateInventoryVariantOptionRequest;
    }) => ensureSuccess(await createInventoryVariantOption(vars.productId, vars.groupId, vars.payload)),
    onSuccess: (_data, vars) => {
      invalidateVariants(vars.productId);
      toast.success("Varian opsi dibuat");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal membuat varian opsi"),
  });

  const updateOption = useMutation({
    mutationFn: async (vars: {
      productId: string | number;
      optionId: string | number;
      payload: UpdateInventoryVariantOptionRequest;
    }) => ensureSuccess(await updateInventoryVariantOption(vars.productId, vars.optionId, vars.payload)),
    onSuccess: (_data, vars) => {
      invalidateVariants(vars.productId);
      toast.success("Varian opsi diperbarui");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal memperbarui varian opsi"),
  });

  const archiveOption = useMutation({
    mutationFn: async (vars: { productId: string | number; optionId: string | number }) =>
      ensureSuccess(await archiveInventoryVariantOption(vars.productId, vars.optionId)),
    onSuccess: (_data, vars) => {
      invalidateVariants(vars.productId);
      toast.success("Varian opsi diarsipkan");
    },
    onError: (err: any) => toast.error(err?.message || "Gagal mengarsipkan varian opsi"),
  });

  return {
    createGroup,
    updateGroup,
    uploadGroupImage,
    archiveGroup,
    createOption,
    updateOption,
    archiveOption,
  } as const;
}
