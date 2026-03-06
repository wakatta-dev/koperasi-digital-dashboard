/** @format */

import type {
  SupportAccountingSettings,
  SupportAssetRentalSettingsSection,
  SupportMarketplaceSettings,
  SupportOperationalModulesSection,
  SupportOperationalPreferencesSection,
  SupportEmailTemplate,
} from "@/types/api";

export type ProfileIdentityFormState = {
  business_name: string;
  business_type: string;
  business_category: string;
  description: string;
  logo_url: string;
};

export type ProfileContactDomainFormState = {
  contact_email: string;
  contact_phone: string;
  address: string;
  domain: string;
  custom_domain: string;
};

export type OperationalPreferencesFormState = SupportOperationalPreferencesSection;

export type OperationalModulesFormState = SupportOperationalModulesSection["feature_flags"];

export type AssetRentalPolicyFormState = SupportAssetRentalSettingsSection;

export type MarketplaceAccountingFormState = {
  marketplace: SupportMarketplaceSettings;
  accounting: SupportAccountingSettings;
};

export type EmailTemplateFormState = Pick<SupportEmailTemplate, "subject" | "body">;
