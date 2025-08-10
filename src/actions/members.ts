/** @format */

"use server";

import { apiFetch } from "./api";
import { API_ENDPOINTS } from "@/constants/api";

export interface Member {
  id: string;
  user_id: string;
  membership_number: string;
  status: string;
  joined_at: string;
  updated_at: string;
}

export async function fetchMembers(): Promise<Member[]> {
  return (await apiFetch(API_ENDPOINTS.members.list)) as Member[];
}

export async function registerMember(payload: {
  membership_number: string;
  user_id: string;
  status: string;
}) {
  return apiFetch(API_ENDPOINTS.members.register, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMemberContributions(id: string | number) {
  return apiFetch(API_ENDPOINTS.members.contributions(id));
}
