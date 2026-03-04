/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSupportTenantConfig, useSupportTenantConfigActions } from "@/hooks/queries";
import { canManageSettings } from "../helpers";

type ProfileFormState = {
  business_name: string;
  business_type: string;
  business_category: string;
  description: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  domain: string;
  custom_domain: string;
  logo_url: string;
};

const EMPTY_FORM: ProfileFormState = {
  business_name: "",
  business_type: "",
  business_category: "",
  description: "",
  contact_email: "",
  contact_phone: "",
  address: "",
  domain: "",
  custom_domain: "",
  logo_url: "",
};

export default function SettingsProfilTenantPage() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const canManage = canManageSettings(role);
  const configQuery = useSupportTenantConfig();
  const { saveTenantConfig } = useSupportTenantConfigActions();
  const [form, setForm] = useState<ProfileFormState>(EMPTY_FORM);

  useEffect(() => {
    const data = configQuery.data;
    if (!data) return;
    setForm({
      business_name: data.business_name ?? "",
      business_type: data.business_type ?? "",
      business_category: data.business_category ?? "",
      description: data.description ?? "",
      contact_email: data.contact_email ?? "",
      contact_phone: data.contact_phone ?? "",
      address: data.address ?? "",
      domain: data.domain ?? "",
      custom_domain: data.custom_domain ?? "",
      logo_url: data.logo_url ?? "",
    });
  }, [configQuery.data]);

  const isBusy = saveTenantConfig.isPending || configQuery.isLoading;
  const isDirty = useMemo(() => {
    const data = configQuery.data;
    if (!data) return false;
    return (
      form.business_name !== (data.business_name ?? "") ||
      form.business_type !== (data.business_type ?? "") ||
      form.business_category !== (data.business_category ?? "") ||
      form.description !== (data.description ?? "") ||
      form.contact_email !== (data.contact_email ?? "") ||
      form.contact_phone !== (data.contact_phone ?? "") ||
      form.address !== (data.address ?? "") ||
      form.custom_domain !== (data.custom_domain ?? "") ||
      form.logo_url !== (data.logo_url ?? "")
    );
  }, [configQuery.data, form]);

  const onSave = async () => {
    await saveTenantConfig.mutateAsync({
      business_name: form.business_name,
      business_type: form.business_type,
      business_category: form.business_category,
      description: form.description,
      contact_email: form.contact_email,
      contact_phone: form.contact_phone,
      address: form.address,
      custom_domain: form.custom_domain,
      logo_url: form.logo_url,
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profil Tenant</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Kelola identitas, kontak, branding, dan domain tenant BUMDes.
        </p>
      </div>

      {!canManage ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mr-2 inline h-4 w-4" />
          Mode baca saja: hanya admin tenant yang dapat mengubah profil.
        </div>
      ) : null}

      {configQuery.error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {(configQuery.error as Error).message}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Identitas Usaha</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="business_name">Nama Usaha</Label>
            <Input
              id="business_name"
              value={form.business_name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, business_name: event.target.value }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_type">Jenis Tenant</Label>
            <Input id="business_type" value={form.business_type} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business_category">Kategori Bisnis</Label>
            <Input
              id="business_category"
              value={form.business_category}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, business_category: event.target.value }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              value={form.logo_url}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, logo_url: event.target.value }))
              }
              disabled={!canManage || isBusy}
              placeholder="https://..."
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              disabled={!canManage || isBusy}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kontak dan Domain</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="contact_email">Email Kontak</Label>
            <Input
              id="contact_email"
              value={form.contact_email}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contact_email: event.target.value }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Telepon Kontak</Label>
            <Input
              id="contact_phone"
              value={form.contact_phone}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, contact_phone: event.target.value }))
              }
              disabled={!canManage || isBusy}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="domain">Domain Aktif</Label>
            <Input id="domain" value={form.domain} disabled />
          </div>
          <div className="space-y-2">
            <Label htmlFor="custom_domain">Custom Domain</Label>
            <Input
              id="custom_domain"
              value={form.custom_domain}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, custom_domain: event.target.value }))
              }
              disabled={!canManage || isBusy}
              placeholder="contoh: bumdes.desa.id"
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="address">Alamat</Label>
            <Textarea
              id="address"
              value={form.address}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, address: event.target.value }))
              }
              disabled={!canManage || isBusy}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            if (!configQuery.data) return;
            setForm({
              business_name: configQuery.data.business_name ?? "",
              business_type: configQuery.data.business_type ?? "",
              business_category: configQuery.data.business_category ?? "",
              description: configQuery.data.description ?? "",
              contact_email: configQuery.data.contact_email ?? "",
              contact_phone: configQuery.data.contact_phone ?? "",
              address: configQuery.data.address ?? "",
              domain: configQuery.data.domain ?? "",
              custom_domain: configQuery.data.custom_domain ?? "",
              logo_url: configQuery.data.logo_url ?? "",
            });
          }}
          disabled={!isDirty || isBusy}
        >
          Reset
        </Button>
        <Button
          type="button"
          onClick={onSave}
          disabled={!canManage || !isDirty || isBusy}
        >
          {saveTenantConfig.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </div>
  );
}

