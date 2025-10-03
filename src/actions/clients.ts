/** @format */

"use server";

import type {
  ClientListResponse,
  ClientPlanResponse,
  ClientStatusResponse,
  ClientActivityResponse,
  UpdateClientPlanRequest,
  UpdateClientStatusRequest,
} from "@/types/api";
import { ensureSuccess } from "@/lib/api";
import {
  listClients as listClientsService,
  updateClientPlan as updateClientPlanService,
  updateClientStatus as updateClientStatusService,
  listClientActivity as listClientActivityService,
} from "@/services/api";

export async function listClients(params?: {
  term?: string;
  type?: string;
  status?: string;
  limit?: number;
  cursor?: string;
}): Promise<ClientListResponse> {
  return listClientsService(params);
}

export async function updateClientPlan(
  id: string | number,
  payload: UpdateClientPlanRequest,
): Promise<ClientPlanResponse> {
  return updateClientPlanService(id, payload);
}

export async function updateClientStatus(
  id: string | number,
  payload: UpdateClientStatusRequest,
): Promise<ClientStatusResponse> {
  return updateClientStatusService(id, payload);
}

export async function listClientActivity(
  id: string | number,
  params?: { limit?: number; cursor?: string },
): Promise<ClientActivityResponse> {
  return listClientActivityService(id, params);
}

export async function listClientsAction(
  params?: Record<string, string | number>
) {
  try {
    const res = await listClientsService(params);
    return ensureSuccess(res);
  } catch {
    return [];
  }
}

export type ListClientsActionResult = Awaited<
  ReturnType<typeof listClientsAction>
>;
