/** @format */

"use client";

import { useMemo, useState } from "react";
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
import { TenantSettingsShell } from "../shared/TenantSettingsShell";

export function TenantProfileSettingsPage() {
  const { data: session } = useSession();
  const canManage = canManageTenantSettings((session?.user as { role?: string } | undefined)?.role);
  const profileQuery = useSupportProfileSettings();
  const { saveIdentity, saveContactDomain } = useSupportProfileActions();
  const [identityDraft, setIdentityDraft] = useState<ProfileIdentityFormState | null>(null);
  const [contactDomainDraft, setContactDomainDraft] =
    useState<ProfileContactDomainFormState | null>(null);

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

  const identityForm = identityDraft ?? identityInitial;
  const contactDomainForm = contactDomainDraft ?? contactDomainInitial;

  const isIdentityDirty = identityDraft ? !isDeepEqual(identityDraft, identityInitial) : false;
  const isContactDomainDirty = contactDomainDraft
    ? !isDeepEqual(contactDomainDraft, contactDomainInitial)
    : false;

  return (
    <TenantSettingsShell
      sectionId="profil-tenant"
      title="Profil Tenant"
      description="Kelola informasi dasar, kontak utama, dan konfigurasi domain tenant dari satu area yang lebih terstruktur."
      summaryTitle="Ringkasan Identitas"
      summaryDescription="Bacaan cepat sebelum Anda memperbarui profil usaha dan domain tenant."
      summaryItems={[
        {
          label: "Nama Usaha",
          value: identityForm.business_name || "Belum diisi",
          helper: identityForm.business_category || "Kategori bisnis belum diatur",
        },
        {
          label: "Domain Aktif",
          value: contactDomainForm.custom_domain || contactDomainForm.domain || "Belum aktif",
          helper: contactDomainForm.contact_email || "Email kontak belum diisi",
        },
        {
          label: "Jenis Tenant",
          value: identityForm.business_type || "-",
          helper: canManage ? "Dapat diedit oleh role Anda" : "Anda sedang dalam mode read-only",
        },
      ]}
    >
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
        onChange={setIdentityDraft}
        onReset={() => setIdentityDraft(null)}
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
        onChange={setContactDomainDraft}
        onReset={() => setContactDomainDraft(null)}
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
    </TenantSettingsShell>
  );
}
