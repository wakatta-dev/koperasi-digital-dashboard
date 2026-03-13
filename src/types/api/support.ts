/** @format */

import type { ApiResponse, Rfc3339String } from "./common";

export type TenantFeatureFlags = Partial<{
  pos_enabled: boolean;
  inventory_enabled: boolean;
  marketplace_enabled: boolean;
  asset_rental_enabled: boolean;
  reports_enabled: boolean;
}>;

export type TenantOperationalConfigs = Partial<{
  asset_rental: {
    approval_required?: boolean;
    default_slot_minutes?: number;
    min_dp_percent?: number;
    grace_period_hours?: number;
    late_fee_per_hour?: number;
  };
  marketplace: {
    manual_payment_window_min?: number;
    auto_cancel_unpaid_hours?: number;
    low_stock_threshold?: number;
    allow_guest_checkout?: boolean;
  };
  accounting: {
    invoice_prefix?: string;
    fiscal_year_start_month?: number;
    default_payment_terms_days?: number;
    period_lock_after_days?: number;
  };
  [key: string]: unknown;
}>;

export interface SupportGlobalConfig {
  timezone_default: string;
  currency_default: string;
  locale_default: string;
  email_sender: string;
  feature_flags_default: Record<string, boolean>;
  updated_at?: Rfc3339String;
}

export interface SupportTenantConfig {
  tenant_id: number;
  business_name: string;
  business_type: string;
  domain?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  business_category?: string;
  description?: string;
  timezone: string;
  currency: string;
  locale?: string;
  theme?: string;
  custom_domain?: string;
  domain_verified_at?: Rfc3339String;
  feature_flags: TenantFeatureFlags;
  configs?: TenantOperationalConfigs;
  updated_at?: Rfc3339String;
}

export interface SupportProfileIdentitySection {
  business_name: string;
  business_type: string;
  business_category?: string;
  description?: string;
  logo_url?: string;
  updated_at?: Rfc3339String;
}

export interface SupportProfileContactDomainSection {
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  domain?: string;
  custom_domain?: string;
  domain_verified_at?: Rfc3339String;
  updated_at?: Rfc3339String;
}

export interface SupportProfileSettings {
  tenant_id: number;
  identity: SupportProfileIdentitySection;
  contact_domain: SupportProfileContactDomainSection;
}

export interface SupportOperationalPreferencesSection {
  timezone: string;
  currency: string;
  locale: string;
  theme: string;
  updated_at?: Rfc3339String;
}

export interface SupportOperationalModulesSection {
  feature_flags: TenantFeatureFlags;
  updated_at?: Rfc3339String;
}

export interface SupportAssetRentalSettingsSection {
  approval_required: boolean;
  default_slot_minutes: number;
  min_dp_percent: number;
  grace_period_hours: number;
  late_fee_per_hour: number;
  updated_at?: Rfc3339String;
}

export interface SupportMarketplaceSettings {
  manual_payment_window_min: number;
  auto_cancel_unpaid_hours: number;
  low_stock_threshold: number;
  allow_guest_checkout: boolean;
}

export interface SupportAccountingSettings {
  invoice_prefix: string;
  fiscal_year_start_month: number;
  default_payment_terms_days: number;
  period_lock_after_days: number;
}

export interface SupportMarketplaceAccountingSection {
  marketplace: SupportMarketplaceSettings;
  accounting: SupportAccountingSettings;
  updated_at?: Rfc3339String;
}

export interface SupportOperationalSettings {
  tenant_id: number;
  preferences: SupportOperationalPreferencesSection;
  modules: SupportOperationalModulesSection;
  asset_rental: SupportAssetRentalSettingsSection;
  marketplace_accounting: SupportMarketplaceAccountingSection;
}

export interface SupportReadinessItem {
  key: string;
  label: string;
  status: "ready" | "missing";
  state?: "draft" | "active" | "blocked" | "ready";
  message?: string;
  source?: string;
}

export interface SupportReadinessDomain {
  domain: string;
  label: string;
  status: "ready" | "missing";
  state?: "draft" | "active" | "blocked" | "ready";
  ready_count: number;
  missing_count: number;
  items: SupportReadinessItem[];
}

export interface SupportCriticalFlowGate {
  key: string;
  label: string;
  requirement_codes: string[];
  evidence_type: string;
  owner: string;
  status: "passed" | "blocker";
  blocker: boolean;
  message?: string;
  source?: string;
}

export interface SupportCriticalFlow {
  key: string;
  label: string;
  domain: string;
  status: "ready" | "blocked";
  blocker_count: number;
  gates: SupportCriticalFlowGate[];
}

export interface SupportSystemReadiness {
  tenant_id: number;
  status: "ready" | "missing";
  state?: "draft" | "active" | "blocked" | "ready";
  checked_at: Rfc3339String;
  foundation_items: SupportReadinessItem[];
  domains: SupportReadinessDomain[];
  modules?: SupportReadinessModule[];
  critical_flows: SupportCriticalFlow[];
}

export interface SupportReadinessPolicyTraceStep {
  scope: string;
  label: string;
  has_value: boolean;
  selected: boolean;
  enforcement_state?: string;
}

export interface SupportReadinessEffectivePolicy {
  policy_key: string;
  policy_name: string;
  effective_value: unknown;
  source_scope: string;
  source_label: string;
  enforcement_state: "active" | "draft" | string;
  resolution_chain?: SupportReadinessPolicyTraceStep[];
}

export interface SupportReadinessModule {
  module_key: string;
  label: string;
  enabled: boolean;
  status: "ready" | "missing";
  state: "draft" | "active" | "blocked" | "ready";
  exception_summary?: {
    count: number;
    active_count: number;
    latest_status?: string;
    governance_source?: string;
    owner_label?: string;
    reason?: string;
    exception_code?: string;
    updated_at?: Rfc3339String;
  };
  blocker_reasons?: string[];
  corrective_actions?: string[];
  expected_outputs?: string[];
  verified_outputs?: string[];
  missing_outputs?: string[];
  effective_policies?: SupportReadinessEffectivePolicy[];
}

export interface SupportBootstrapRunDiagnostics {
  run_id: number;
  status: string;
  trigger_type: string;
  preset_key: string;
  repair_target?: string;
  error_message?: string;
  started_at?: Rfc3339String;
  finished_at?: Rfc3339String;
}

export interface SupportDiagnostics {
  tenant_id: number;
  status: "ready" | "missing";
  state: "draft" | "active" | "blocked" | "ready";
  checked_at: Rfc3339String;
  modules: SupportReadinessModule[];
  bootstrap_run?: SupportBootstrapRunDiagnostics;
}

export interface SupportPolicyDefinitionItem {
  policy_key: string;
  policy_name: string;
  description?: string;
  policy_class: string;
  allowed_scopes?: string[];
  default_source: string;
  value_type: string;
  validation_rules?: Record<string, unknown>;
  management_roles?: string[];
  reviewer_roles?: string[];
}

export interface SupportPolicyDefinitions {
  tenant_id: number;
  items: SupportPolicyDefinitionItem[];
}

export interface SectionConcurrencyRequest {
  expected_updated_at?: Rfc3339String;
}

export interface UpdateSupportProfileIdentityRequest extends SectionConcurrencyRequest {
  business_name?: string;
  business_type?: string;
  business_category?: string;
  description?: string;
  logo_url?: string;
}

export interface UpdateSupportProfileContactDomainRequest extends SectionConcurrencyRequest {
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  custom_domain?: string;
}

export interface UpdateSupportOperationalPreferencesRequest extends SectionConcurrencyRequest {
  timezone?: string;
  currency?: string;
  locale?: string;
  theme?: string;
}

export interface UpdateSupportOperationalModulesRequest extends SectionConcurrencyRequest {
  feature_flags?: TenantFeatureFlags;
}

export interface UpdateSupportOperationalAssetRentalRequest extends SectionConcurrencyRequest {
  approval_required?: boolean;
  default_slot_minutes?: number;
  min_dp_percent?: number;
  grace_period_hours?: number;
  late_fee_per_hour?: number;
}

export interface UpdateSupportOperationalMarketplaceAccountingRequest
  extends SectionConcurrencyRequest {
  marketplace?: Partial<SupportMarketplaceSettings>;
  accounting?: Partial<SupportAccountingSettings>;
}

export interface UpdateSupportTenantConfigRequest {
  timezone?: string;
  currency?: string;
  locale?: string;
  theme?: string;
  custom_domain?: string;
  business_name?: string;
  business_type?: string;
  business_category?: string;
  description?: string;
  address?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  feature_flags?: TenantFeatureFlags;
  configs?: TenantOperationalConfigs;
}

export interface SupportEmailTemplate {
  id: number;
  code: string;
  name: string;
  category: string;
  subject: string;
  body: string;
  placeholders: string[];
  version: number;
  updated_at: Rfc3339String;
  metadata?: Record<string, unknown>;
}

export interface SendSupportEmailRequest {
  to: string;
  template_id: number;
  variables?: Record<string, unknown>;
}

export interface SupportEmailLog {
  id: number;
  tenant_id?: number;
  recipient: string;
  template_id: number;
  template_code: string;
  template_version: number;
  status: string;
  error?: string;
  metadata?: Record<string, unknown>;
  created_at?: Rfc3339String;
}

export interface SupportActivityLogItem {
  id: number;
  timestamp: Rfc3339String;
  actor_id: number;
  actor_label: string;
  module: string;
  action: string;
  entity_type: string;
  entity_id: number;
  old_status?: string;
  new_status?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
  request_id?: string;
}

export interface SupportActivityLogList {
  items: SupportActivityLogItem[];
}

export interface SupportActivityLogParams {
  cursor?: string | number;
  limit?: number;
  from?: string;
  to?: string;
  actor_id?: string | number;
  module?: string;
  action?: string;
}

export interface SupportOperationalExceptionContextParams {
  domain: "marketplace" | "rental";
  source_id: string | number;
  reference?: string;
  attention_scope?: "operasional" | "pembayaran" | "accounting";
  summary?: string;
}

export interface SupportOperationalExceptionNote {
  id: number;
  action: string;
  status: "none" | "active" | "resolved" | "escalated" | string;
  message: string;
  owner_label?: string;
  next_step?: string;
  actor_label: string;
  timestamp: Rfc3339String;
}

export interface SupportOperationalExceptionAuditEntry {
  id: number;
  action: string;
  old_status?: "none" | "active" | "resolved" | "escalated" | string;
  new_status?: "none" | "active" | "resolved" | "escalated" | string;
  reason?: string;
  actor_label: string;
  request_id?: string;
  timestamp: Rfc3339String;
}

export interface SupportOperationalExceptionContext {
  record_id?: number;
  domain: "marketplace" | "rental";
  source_id: number;
  reference?: string;
  attention_scope?: "operasional" | "pembayaran" | "accounting";
  summary?: string;
  scope_label?: string;
  governance_source?: string;
  exception_code?: string;
  severity?: "low" | "medium" | "high" | string;
  recommended_action?: string;
  status:
    | "none"
    | "active"
    | "approved"
    | "rejected"
    | "closed"
    | "resolved"
    | "escalated"
    | string;
  owner_label?: string;
  reviewer_label?: string;
  owner_roles?: string[];
  reviewer_roles?: string[];
  support_roles?: string[];
  next_step?: string;
  last_message?: string;
  updated_at?: Rfc3339String;
  notes: SupportOperationalExceptionNote[];
  audit_entries: SupportOperationalExceptionAuditEntry[];
}

export interface CreateSupportOperationalExceptionNoteRequest {
  domain: "marketplace" | "rental";
  source_id: number;
  reference?: string;
  attention_scope?: "operasional" | "pembayaran" | "accounting";
  summary?: string;
  owner_label: string;
  next_step: string;
  message: string;
}

export interface UpdateSupportOperationalExceptionDecisionRequest {
  domain: "marketplace" | "rental";
  source_id: number;
  reference?: string;
  attention_scope?: "operasional" | "pembayaran" | "accounting";
  summary?: string;
  owner_label?: string;
  next_step?: string;
  message: string;
  status: "approved" | "rejected" | "closed" | "resolved" | "escalated";
}

export type SupportGlobalConfigResponse = ApiResponse<SupportGlobalConfig>;
export type SupportTenantConfigResponse = ApiResponse<SupportTenantConfig>;
export type UpdateSupportTenantConfigResponse = ApiResponse<SupportTenantConfig>;
export type SupportProfileSettingsResponse = ApiResponse<SupportProfileSettings>;
export type SupportProfileIdentityResponse = ApiResponse<SupportProfileIdentitySection>;
export type SupportProfileContactDomainResponse = ApiResponse<SupportProfileContactDomainSection>;
export type SupportOperationalSettingsResponse = ApiResponse<SupportOperationalSettings>;
export type SupportPolicyDefinitionsResponse = ApiResponse<SupportPolicyDefinitions>;
export type SupportSystemReadinessResponse = ApiResponse<SupportSystemReadiness>;
export type SupportDiagnosticsResponse = ApiResponse<SupportDiagnostics>;
export type SupportOperationalPreferencesResponse = ApiResponse<SupportOperationalPreferencesSection>;
export type SupportOperationalModulesResponse = ApiResponse<SupportOperationalModulesSection>;
export type SupportOperationalAssetRentalResponse = ApiResponse<SupportAssetRentalSettingsSection>;
export type SupportOperationalMarketplaceAccountingResponse =
  ApiResponse<SupportMarketplaceAccountingSection>;
export type SupportEmailTemplatesResponse = ApiResponse<SupportEmailTemplate[]>;
export type SupportEmailTemplateResponse = ApiResponse<SupportEmailTemplate>;
export type SupportEmailSendResponse = ApiResponse<SupportEmailLog>;
export type SupportActivityLogResponse = ApiResponse<SupportActivityLogList>;
export type SupportOperationalExceptionContextResponse =
  ApiResponse<SupportOperationalExceptionContext>;
