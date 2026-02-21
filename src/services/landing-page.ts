/** @format */

import { API_PREFIX, api } from "@/services/api/base";
import type { ApiResponse } from "@/types/api";
import type {
  LandingEditorState,
  LandingPageConfig,
  LandingPageMediaResponse,
  LandingPublishPayload,
  LandingSaveDraftPayload,
  LandingTemplateSelectPayload,
  LandingTemplateSelectResponse,
  LandingTemplateSummary,
} from "@/types/landing-page";

const BASE = `${API_PREFIX}/landingpage`;

export function getLandingPagePublic(): Promise<ApiResponse<LandingPageConfig>> {
  return api.get<LandingPageConfig>(BASE);
}

export function getLandingEditorState(): Promise<ApiResponse<LandingEditorState>> {
  return api.get<LandingEditorState>(`${BASE}/admin/editor-state`);
}

export function listLandingTemplates(): Promise<ApiResponse<LandingTemplateSummary[]>> {
  return api.get<LandingTemplateSummary[]>(`${BASE}/admin/templates`);
}

export function selectLandingTemplate(
  payload: LandingTemplateSelectPayload
): Promise<ApiResponse<LandingTemplateSelectResponse>> {
  return api.post<LandingTemplateSelectResponse>(`${BASE}/admin/template/select`, payload);
}

export function confirmLandingTemplateSelect(
  payload: LandingTemplateSelectPayload
): Promise<ApiResponse<LandingTemplateSelectResponse>> {
  return api.post<LandingTemplateSelectResponse>(
    `${BASE}/admin/template/select/confirm`,
    payload
  );
}

export function saveLandingDraft(
  payload: LandingSaveDraftPayload
): Promise<ApiResponse<LandingEditorState>> {
  return api.put<LandingEditorState>(`${BASE}/admin/draft`, payload);
}

export function publishLanding(
  payload: LandingPublishPayload
): Promise<ApiResponse<LandingEditorState>> {
  return api.post<LandingEditorState>(`${BASE}/admin/publish`, payload);
}

export function uploadLandingMedia(
  formData: FormData
): Promise<ApiResponse<LandingPageMediaResponse>> {
  return api.post<LandingPageMediaResponse>(`${BASE}/admin/media`, formData, {
    headers: {},
  });
}
