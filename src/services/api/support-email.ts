/** @format */

import { API_ENDPOINTS } from "@/constants/api";
import type {
  SendSupportEmailRequest,
  SupportEmailSendResponse,
  SupportEmailTemplateResponse,
  SupportEmailTemplatesResponse,
} from "@/types/api";
import { api, API_PREFIX } from "./base";

export function listSupportEmailTemplates(): Promise<SupportEmailTemplatesResponse> {
  return api.get(
    `${API_PREFIX}${API_ENDPOINTS.support.emailTemplates}`,
  );
}

export function updateSupportEmailTemplate(
  templateId: string | number,
  payload: { subject: string; body: string }
): Promise<SupportEmailTemplateResponse> {
  return api.patch(
    `${API_PREFIX}${API_ENDPOINTS.support.emailTemplate(templateId)}`,
    payload
  );
}

export function sendSupportEmail(
  payload: SendSupportEmailRequest
): Promise<SupportEmailSendResponse> {
  return api.post(
    `${API_PREFIX}${API_ENDPOINTS.support.emailSend}`,
    payload
  );
}

