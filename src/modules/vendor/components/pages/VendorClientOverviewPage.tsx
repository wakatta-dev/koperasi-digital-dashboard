/** @format */

"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAdminTenantActions, useAdminTenantDetail } from "@/hooks/queries";
import type { AdminTenantUpdateProfileRequest } from "@/types/api";
import {
  formatVendorDateTime,
  normalizeTenantStatus,
  tenantStatusBadgeClass,
} from "../../utils/format";

type VendorClientOverviewPageProps = {
  tenantId: string;
};

type TenantBusinessType = NonNullable<AdminTenantUpdateProfileRequest["business_type"]>;

export function VendorClientOverviewPage({
  tenantId,
}: VendorClientOverviewPageProps) {
  const detailQuery = useAdminTenantDetail(tenantId);
  const actions = useAdminTenantActions();
  const tenant = detailQuery.data?.data?.tenant;

  const [profileForm, setProfileForm] = useState({
    name: "",
    display_name: "",
    contact_email: "",
    business_type: "koperasi" as TenantBusinessType,
    address: "",
    timezone: "",
    currency: "",
  });
  const [statusForm, setStatusForm] = useState({
    status: "ACTIVE" as "ACTIVE" | "DEACTIVATED",
    reason: "",
    note: "",
  });

  useEffect(() => {
    if (!tenant) return;
    setProfileForm({
      name: tenant.name ?? "",
      display_name: tenant.display_name ?? "",
      contact_email: tenant.contact_email ?? "",
      business_type: ((["vendor", "koperasi", "umkm", "bumdes"] as const).includes(
        tenant.business_type as TenantBusinessType
      )
        ? (tenant.business_type as TenantBusinessType)
        : "koperasi") as TenantBusinessType,
      address: tenant.address ?? "",
      timezone: tenant.configuration?.timezone ?? "",
      currency: tenant.configuration?.currency ?? "",
    });
    setStatusForm({
      status: normalizeTenantStatus(tenant.status, tenant.is_active) === "ACTIVE"
        ? "ACTIVE"
        : "DEACTIVATED",
      reason: "",
      note: "",
    });
  }, [tenant]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.7fr)_minmax(300px,1fr)]">
      <Card>
        <CardHeader>
          <CardTitle>Profil Tenant</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenant-name">Nama Tenant</Label>
              <Input
                id="tenant-name"
                value={profileForm.name}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    name: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-display-name">Display Name</Label>
              <Input
                id="tenant-display-name"
                value={profileForm.display_name}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    display_name: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-email">Email Kontak</Label>
              <Input
                id="tenant-email"
                value={profileForm.contact_email}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    contact_email: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Tipe Bisnis</Label>
              <Select
                value={profileForm.business_type}
                onValueChange={(value) =>
                  setProfileForm((current) => ({
                    ...current,
                    business_type: value as typeof current.business_type,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tipe bisnis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vendor">Vendor</SelectItem>
                  <SelectItem value="koperasi">Koperasi</SelectItem>
                  <SelectItem value="bumdes">BUMDes</SelectItem>
                  <SelectItem value="umkm">UMKM</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-timezone">Timezone</Label>
              <Input
                id="tenant-timezone"
                value={profileForm.timezone}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    timezone: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-currency">Currency</Label>
              <Input
                id="tenant-currency"
                value={profileForm.currency}
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    currency: event.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tenant-address">Alamat</Label>
            <Textarea
              id="tenant-address"
              value={profileForm.address}
              onChange={(event) =>
                setProfileForm((current) => ({
                  ...current,
                  address: event.target.value,
                }))
              }
            />
          </div>
          <div className="flex justify-end">
            <Button
              disabled={actions.updateProfile.isPending}
              onClick={() =>
                actions.updateProfile.mutate({
                  tenantId,
                  payload: {
                    ...profileForm,
                  },
                })
              }
            >
              Simpan Profil
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Tenant</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2">
              <span className="text-sm text-muted-foreground">Status Saat Ini</span>
              <Badge className={tenantStatusBadgeClass(tenant?.status, tenant?.is_active)}>
                {normalizeTenantStatus(tenant?.status, tenant?.is_active)}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label>Status Baru</Label>
              <Select
                value={statusForm.status}
                onValueChange={(value) =>
                  setStatusForm((current) => ({
                    ...current,
                    status: value as "ACTIVE" | "DEACTIVATED",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE</SelectItem>
                  <SelectItem value="DEACTIVATED">DEACTIVATED</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-reason">Reason</Label>
              <Input
                id="tenant-reason"
                value={statusForm.reason}
                onChange={(event) =>
                  setStatusForm((current) => ({
                    ...current,
                    reason: event.target.value,
                  }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenant-note">Note</Label>
              <Textarea
                id="tenant-note"
                value={statusForm.note}
                onChange={(event) =>
                  setStatusForm((current) => ({
                    ...current,
                    note: event.target.value,
                  }))
                }
              />
            </div>
            <Button
              className="w-full"
              disabled={actions.updateStatus.isPending}
              onClick={() =>
                actions.updateStatus.mutate({
                  tenantId,
                  payload: statusForm,
                })
              }
            >
              Update Status
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Domain</span>
              <span className="font-medium">{tenant?.domain || "-"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Legal Entity</span>
              <span className="font-medium">{tenant?.legal_entity || "-"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Business Sector</span>
              <span className="font-medium">{tenant?.business_sector || "-"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Updated</span>
              <span className="font-medium">{formatVendorDateTime(tenant?.updated_at)}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
