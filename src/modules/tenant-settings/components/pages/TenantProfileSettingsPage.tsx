/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useSupportProfileActions, useSupportProfileSettings } from "@/hooks/queries";
import { isDeepEqual } from "../../lib/forms";
import { asInputString, canManageTenantSettings } from "../../lib/settings";
import type {
  ProfileContactDomainFormState,
  ProfileIdentityFormState,
} from "../../types/forms";
import { FeatureTenantProfileContactDomainCard } from "../features/FeatureTenantProfileContactDomainCard";
import { FeatureTenantProfileIdentityCard } from "../features/FeatureTenantProfileIdentityCard";
import { SettingsErrorBanner } from "../shared/SettingsErrorBanner";
import { SettingsReadOnlyAlert } from "../shared/SettingsReadOnlyAlert";
import { SettingsSectionHeading } from "../shared/SettingsSectionHeading";

const emptyIdentity: ProfileIdentityFormState = {
  business_name: "",
  business_type: "",
  business_category: "",
  description: "",
  logo_url: "",
};

const emptyContactDomain: ProfileContactDomainFormState = {
  contact_email: "",
  contact_phone: "",
  address: "",
  domain: "",
  custom_domain: "",
};

export function TenantProfileSettingsPage() {
  const { data: session } = useSession();
  const canManage = canManageTenantSettings((session?.user as { role?: string } | undefined)?.role);
  const profileQuery = useSupportProfileSettings();
  const { saveIdentity, saveContactDomain } = useSupportProfileActions();
  const [identityForm, setIdentityForm] = useState<ProfileIdentityFormState>(emptyIdentity);
  const [contactDomainForm, setContactDomainForm] =
    useState<ProfileContactDomainFormState>(emptyContactDomain);

  const identityInitial = useMemo<ProfileIdentityFormState>(
    () => ({
      business_name: asInputString(profileQuery.data?.identity.business_name),
      business_type: asInputString(profileQuery.data?.identity.business_type),
      business_category: asInputString(profileQuery.data?.identity.business_category),
      description: asInputString(profileQuery.data?.identity.description),
      logo_url: asInputString(profileQuery.data?.identity.logo_url),
    }),
    [profileQuery.data]
  );

  const contactDomainInitial = useMemo<ProfileContactDomainFormState>(
    () => ({
      contact_email: asInputString(profileQuery.data?.contact_domain.contact_email),
      contact_phone: asInputString(profileQuery.data?.contact_domain.contact_phone),
      address: asInputString(profileQuery.data?.contact_domain.address),
      domain: asInputString(profileQuery.data?.contact_domain.domain),
      custom_domain: asInputString(profileQuery.data?.contact_domain.custom_domain),
    }),
    [profileQuery.data]
  );

  useEffect(() => {
    setIdentityForm(identityInitial);
  }, [identityInitial]);

  useEffect(() => {
    setContactDomainForm(contactDomainInitial);
  }, [contactDomainInitial]);

  const isIdentityDirty = !isDeepEqual(identityForm, identityInitial);
  const isContactDomainDirty = !isDeepEqual(contactDomainForm, contactDomainInitial);

  return (
    <div className="max-w-5xl space-y-8">
      <SettingsSectionHeading
        title="Profil Tenant"
        description="Kelola informasi dasar, kontak, dan pengaturan domain untuk tenant Anda."
      />

      {!canManage ? (
        <SettingsReadOnlyAlert message="Anda tidak memiliki izin untuk mengedit profil tenant. Hubungi administrator sistem untuk meminta akses." />
      ) : null}

      {profileQuery.error ? (
        <SettingsErrorBanner message={(profileQuery.error as Error).message} />
      ) : null}

      <FeatureTenantProfileIdentityCard
        value={identityForm}
        disabled={!canManage || profileQuery.isLoading}
        dirty={isIdentityDirty}
        saving={saveIdentity.isPending}
        onChange={setIdentityForm}
        onReset={() => setIdentityForm(identityInitial)}
        onSave={() =>
          saveIdentity.mutate({
            ...identityForm,
            expected_updated_at: profileQuery.data?.identity.updated_at,
          })
        }
      />

      <FeatureTenantProfileContactDomainCard
        value={contactDomainForm}
        disabled={!canManage || profileQuery.isLoading}
        dirty={isContactDomainDirty}
        saving={saveContactDomain.isPending}
        onChange={setContactDomainForm}
        onReset={() => setContactDomainForm(contactDomainInitial)}
        onSave={() =>
          saveContactDomain.mutate({
            contact_email: contactDomainForm.contact_email,
            contact_phone: contactDomainForm.contact_phone,
            address: contactDomainForm.address,
            custom_domain: contactDomainForm.custom_domain,
            expected_updated_at: profileQuery.data?.contact_domain.updated_at,
          })
        }
      />
    </div>
  );
}
