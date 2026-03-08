/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  CreateSupportOperationalExceptionNoteRequest,
  SupportOperationalExceptionContextParams,
  SupportOperationalExceptionContextResponse,
  UpdateSupportOperationalExceptionDecisionRequest,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

function buildQuery(params: SupportOperationalExceptionContextParams) {
  const search = new URLSearchParams({
    domain: params.domain,
    source_id: String(params.source_id),
  });

  if (params.reference) {
    search.set("reference", params.reference);
  }
  if (params.attention_scope) {
    search.set("attention_scope", params.attention_scope);
  }
  if (params.summary) {
    search.set("summary", params.summary);
  }

  return search.toString();
}

export function getSupportOperationalExceptionContext(
  params: SupportOperationalExceptionContextParams
): Promise<SupportOperationalExceptionContextResponse> {
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.support.operationalExceptionsContext}?${buildQuery(params)}`
  );
}

export function createSupportOperationalExceptionNote(
  payload: CreateSupportOperationalExceptionNoteRequest
): Promise<SupportOperationalExceptionContextResponse> {
  return api.post(
    `${API_PREFIX}${API_ENDPOINTS.support.operationalExceptionsNotes}`,
    payload
  );
}

export function updateSupportOperationalExceptionDecision(
  payload: UpdateSupportOperationalExceptionDecisionRequest
): Promise<SupportOperationalExceptionContextResponse> {
  return api.post(
    `${API_PREFIX}${API_ENDPOINTS.support.operationalExceptionsDecision}`,
    payload
  );
}
