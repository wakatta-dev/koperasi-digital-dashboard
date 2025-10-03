/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type ClientActivePlan = {
  subscription_id: number;
  plan_id: number;
  plan_name: string;
  plan_type: "package" | "addon";
  price: number;
  start_date: Rfc3339String;
  end_date?: Rfc3339String;
  status: string;
};

export type Client = {
  id: number;
  name: string;
  domain: string;
  type: string;
  status: "active" | "inactive" | "suspended";
  is_active: boolean;
  suspended_at?: Rfc3339String;
  primary_plan_id?: number;
  active_plan?: ClientActivePlan;
};

export type ClientActivityEntry = {
  type: "plan" | "payment" | "ticket";
  action: string;
  reference?: string;
  status?: string;
  message?: string;
  amount?: number;
  actor_id?: number;
  occurred_at: Rfc3339String;
  metadata?: Record<string, unknown>;
};

export type UpdateClientPlanRequest = {
  plan_id: number;
};

export type UpdateClientStatusRequest = {
  status: "active" | "inactive" | "suspended";
};

export type ClientListResponse = ApiResponse<Client[]>;
export type ClientPlanResponse = ApiResponse<ClientActivePlan>;
export type ClientStatusResponse = ApiResponse<{
  id: number;
  status: string;
  is_active: boolean;
}>;
export type ClientActivityResponse = ApiResponse<ClientActivityEntry[]>;
