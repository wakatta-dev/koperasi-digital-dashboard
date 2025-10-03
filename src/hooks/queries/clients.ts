/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type {
  Client,
  ClientActivityEntry,
  UpdateClientPlanRequest,
  UpdateClientStatusRequest,
} from "@/types/api";
import {
  listClients,
  listClientActivity,
  updateClientPlan,
  updateClientStatus,
} from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";

export function useClients(
  params?: {
    term?: string;
    type?: string;
    status?: string;
    limit?: number;
    cursor?: string;
  },
  initialData?: Client[] | undefined,
  options?: { refetchInterval?: number }
) {
  return useQuery({
    queryKey: QK.clients.list(params),
    queryFn: async () => ensureSuccess(await listClients(params)),
    ...(initialData ? { initialData } : {}),
    ...(options?.refetchInterval
      ? { refetchInterval: options.refetchInterval }
      : {}),
  });
}

export function useClientActivity(
  id?: string | number,
  params?: { limit?: number; cursor?: string },
  initialData?: ClientActivityEntry[] | undefined
) {
  return useQuery({
    queryKey: QK.clients.activity(id ?? "", params),
    enabled: !!id,
    queryFn: async () =>
      ensureSuccess(await listClientActivity(id as string | number, params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useClientActions() {
  const qc = useQueryClient();

  const updatePlanMutation = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      payload: UpdateClientPlanRequest;
    }) => ensureSuccess(await updateClientPlan(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.clients.lists() });
      qc.invalidateQueries({ queryKey: QK.tenants.detail(vars.id) });
      toast.success("Plan client diperbarui");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal memperbarui plan"),
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (vars: {
      id: string | number;
      status: UpdateClientStatusRequest["status"];
    }) =>
      ensureSuccess(await updateClientStatus(vars.id, { status: vars.status })),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.clients.lists() });
      qc.invalidateQueries({ queryKey: QK.tenants.detail(vars.id) });
      toast.success("Status client diperbarui");
    },
    onError: (err: any) =>
      toast.error(err?.message || "Gagal memperbarui status"),
  });

  return {
    updatePlan: updatePlanMutation,
    updateStatus: updateStatusMutation,
  } as const;
}
