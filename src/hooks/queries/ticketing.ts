/** @format */

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Ticket, TicketReply } from "@/types/api";
import {
  createTicket,
  listTickets,
  getTicket,
  addTicketReply,
  updateTicket,
  listTicketReplies,
  listTicketActivities,
  listTicketSLA,
  upsertTicketSLA,
} from "@/services/api";
import { ensureSuccess } from "@/lib/api";
import { QK } from "./queryKeys";

export function useTickets(
  params: {
    status?: string;
    priority?: string;
    category?: string;
    limit?: number;
    cursor?: string;
  } = { limit: 10 },
  initialData?: Ticket[] | undefined,
  options?: { refetchInterval?: number }
) {
  const final = {
    limit: typeof params.limit === "number" ? params.limit : 10,
    ...params,
  } as any;
  return useQuery({
    queryKey: QK.tickets.list(final),
    queryFn: async () => ensureSuccess(await listTickets(final)),
    ...(initialData ? { initialData } : {}),
    ...(options?.refetchInterval ? { refetchInterval: options.refetchInterval } : {}),
  });
}

export function useTicket(id?: string, initialData?: Ticket | undefined) {
  return useQuery({
    queryKey: QK.tickets.detail(id ?? ""),
    enabled: !!id,
    queryFn: async () => ensureSuccess(await getTicket(id as string)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTicketActions() {
  const qc = useQueryClient();

  const create = useMutation({
    mutationFn: async (payload: Partial<Ticket>) =>
      ensureSuccess(await createTicket(payload as any)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.tickets.lists() });
    },
  });

  const addReply = useMutation({
    mutationFn: async (vars: { id: string; payload: Partial<TicketReply> }) =>
      ensureSuccess(await addTicketReply(vars.id, vars.payload as any)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tickets.detail(vars.id) });
    },
  });

  const update = useMutation({
    mutationFn: async (vars: {
      id: string;
      payload: { status?: string; agent_id?: number };
    }) => ensureSuccess(await updateTicket(vars.id, vars.payload)),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: QK.tickets.detail(vars.id) });
      qc.invalidateQueries({ queryKey: QK.tickets.lists() });
    },
  });

  return { create, addReply, update } as const;
}

export function useTicketReplies(
  id?: string,
  params?: { limit?: number; cursor?: string },
  initialData?: TicketReply[] | undefined
) {
  return useQuery({
    queryKey: QK.tickets.replies(id ?? "", params ?? {}),
    enabled: !!id,
    queryFn: async () =>
      ensureSuccess(await listTicketReplies(id as string, params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTicketActivities(
  id?: string,
  params?: { limit?: number; cursor?: string },
  initialData?: any[] | undefined
) {
  return useQuery({
    queryKey: QK.tickets.activities(id ?? "", params ?? {}),
    enabled: !!id,
    queryFn: async () =>
      ensureSuccess(await listTicketActivities(id as string, params)),
    ...(initialData ? { initialData } : {}),
  });
}

export function useTicketSLA(initialData?: any[] | undefined) {
  return useQuery({
    queryKey: QK.tickets.sla(),
    queryFn: async () => {
      const res = await listTicketSLA();
      console.log(res);
      return ensureSuccess(res);
    },
    ...(initialData ? { initialData } : {}),
  });
}

export function useTicketSlaActions() {
  const qc = useQueryClient();
  const upsert = useMutation({
    mutationFn: async (payload: {
      category: string;
      sla_response_minutes: number;
      sla_resolution_minutes: number;
    }) => ensureSuccess(await upsertTicketSLA(payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.tickets.sla() });
    },
  });
  return { upsert } as const;
}
