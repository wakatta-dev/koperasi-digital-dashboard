/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";
import {
  adjustInventoryStock,
  archiveInventoryProduct,
  createInventoryProduct,
  getInventoryProduct,
  listInventoryProducts,
  setInitialInventoryStock,
  unarchiveInventoryProduct,
  updateInventoryProduct,
} from "@/services/api";
import type {
  CreateInventoryProductRequest,
  InventoryAdjustmentRequest,
  InventoryInitialStockRequest,
  InventoryProductListResponse,
  InventoryProductResponse,
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
    archive,
    unarchive,
    initialStock,
    adjustStock,
  } as const;
}
