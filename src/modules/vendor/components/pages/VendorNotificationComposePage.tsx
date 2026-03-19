/** @format */

"use client";

import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { sendSupportEmail } from "@/services/api";
import { useAdminTenants, useSupportEmailTemplates } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
import { VendorPageHeader } from "../VendorPageHeader";

type AudienceMode = "all" | "business_type" | "manual";

export function VendorNotificationComposePage() {
  const [audienceMode, setAudienceMode] = useState<AudienceMode>("all");
  const [businessType, setBusinessType] = useState("koperasi");
  const [selectedTenantIds, setSelectedTenantIds] = useState<string[]>([]);
  const [templateId, setTemplateId] = useState("");
  const [campaignLabel, setCampaignLabel] = useState("");
  const [message, setMessage] = useState("");

  const tenantsQuery = useAdminTenants({ limit: 100 });
  const templatesQuery = useSupportEmailTemplates();
  const tenants = useMemo(() => tenantsQuery.data?.data?.items ?? [], [tenantsQuery.data?.data?.items]);
  const templates = useMemo(() => templatesQuery.data ?? [], [templatesQuery.data]);

  const availableRecipients = useMemo(() => {
    const withEmail = tenants.filter((tenant) => Boolean(tenant.contact_email));
    if (audienceMode === "all") return withEmail;
    if (audienceMode === "business_type") {
      return withEmail.filter((tenant) => tenant.business_type === businessType);
    }
    return withEmail.filter((tenant) => selectedTenantIds.includes(String(tenant.id)));
  }, [audienceMode, businessType, selectedTenantIds, tenants]);

  const selectedTemplate = useMemo(
    () => templates.find((item) => String(item.id) === templateId),
    [templateId, templates]
  );

  const sendBroadcast = useMutation({
    mutationFn: async () => {
      if (!templateId) throw new Error("Template email wajib dipilih.");
      if (availableRecipients.length === 0) {
        throw new Error("Tidak ada recipient yang bisa dikirim.");
      }

      const results: { sent: number; failed: number } = { sent: 0, failed: 0 };

      for (const tenant of availableRecipients) {
        try {
          await ensureSuccess(
            await sendSupportEmail({
              to: tenant.contact_email as string,
              template_id: Number(templateId),
              variables: {
                tenant_name: tenant.display_name || tenant.name,
                business_type: tenant.business_type,
                domain: tenant.domain,
                campaign_label: campaignLabel || "Vendor Broadcast",
                message,
              },
            })
          );
          results.sent += 1;
        } catch {
          results.failed += 1;
        }
      }

      return results;
    },
    onSuccess: (result) => {
      if (result.sent > 0) {
        toast.success(`Broadcast terkirim ke ${result.sent} tenant.`);
      }
      if (result.failed > 0) {
        toast.warning(`${result.failed} tenant gagal dikirim.`);
      }
    },
    onError: (error) => {
      toast.error((error as Error).message || "Gagal mengirim broadcast.");
    },
  });

  return (
    <div className="space-y-6">
      <VendorPageHeader
        title="Compose Notification"
        description="Broadcast vendor berbasis support email template ke tenant terpilih dari admin tenant management."
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(320px,1fr)]">
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>Broadcast Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Audience Mode</Label>
                <Select
                  value={audienceMode}
                  onValueChange={(value) => setAudienceMode(value as AudienceMode)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih audience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tenant</SelectItem>
                    <SelectItem value="business_type">Per Tipe Tenant</SelectItem>
                    <SelectItem value="manual">Pilih Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Template Email</Label>
                <Select value={templateId} onValueChange={setTemplateId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={String(template.id)}>
                        {template.name} ({template.code})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {audienceMode === "business_type" ? (
              <div className="space-y-2">
                <Label>Tipe Tenant</Label>
                <Select value={businessType} onValueChange={setBusinessType}>
                  <SelectTrigger className="max-w-xs">
                    <SelectValue placeholder="Pilih tipe tenant" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendor">Vendor</SelectItem>
                    <SelectItem value="koperasi">Koperasi</SelectItem>
                    <SelectItem value="bumdes">BUMDes</SelectItem>
                    <SelectItem value="umkm">UMKM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ) : null}

            {audienceMode === "manual" ? (
              <div className="space-y-3">
                <Label>Pilih Tenant Manual</Label>
                <div className="max-h-72 space-y-2 overflow-y-auto rounded-lg border p-3">
                  {tenants
                    .filter((tenant) => tenant.contact_email)
                    .map((tenant) => {
                      const checked = selectedTenantIds.includes(String(tenant.id));
                      return (
                        <div
                          key={tenant.id}
                          className="flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2"
                        >
                          <Checkbox
                            checked={checked}
                            onCheckedChange={(next) => {
                              const id = String(tenant.id);
                              setSelectedTenantIds((current) =>
                                next ? [...current, id] : current.filter((item) => item !== id)
                              );
                            }}
                          />
                          <div className="space-y-1">
                            <div className="font-medium">
                              {tenant.display_name || tenant.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {tenant.contact_email} · {tenant.business_type} · {tenant.domain || "-"}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="campaign-label">Campaign Label</Label>
              <Input
                id="campaign-label"
                placeholder="Contoh: Maret 2026 Billing Reminder"
                value={campaignLabel}
                onChange={(event) => setCampaignLabel(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-message">Custom Message</Label>
              <Textarea
                id="campaign-message"
                placeholder="Pesan tambahan yang dikirim sebagai variable template."
                value={message}
                onChange={(event) => setMessage(event.target.value)}
              />
            </div>

            <div className="flex justify-end">
              <Button
                disabled={
                  sendBroadcast.isPending ||
                  templatesQuery.isPending ||
                  tenantsQuery.isPending
                }
                onClick={() => sendBroadcast.mutate()}
              >
                Kirim Broadcast
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Recipient Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-lg border px-4 py-3">
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  Candidate Recipients
                </div>
                <div className="mt-1 text-2xl font-semibold">{availableRecipients.length}</div>
              </div>
              <div className="rounded-lg border px-4 py-3 text-muted-foreground">
                Hanya tenant dengan `contact_email` yang akan ikut broadcast. Saat ini composer
                memuat maksimal 100 tenant dari admin endpoint yang tersedia.
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70">
            <CardHeader>
              <CardTitle>Template Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {selectedTemplate ? (
                <>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Subject
                    </div>
                    <div className="mt-1 font-medium">{selectedTemplate.subject}</div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Body
                    </div>
                    <div className="mt-1 whitespace-pre-wrap rounded-lg bg-muted p-3 text-muted-foreground">
                      {selectedTemplate.body}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">
                      Placeholders
                    </div>
                    <div className="mt-1 text-muted-foreground">
                      {selectedTemplate.placeholders.length
                        ? selectedTemplate.placeholders.join(", ")
                        : "Tidak ada placeholder terdaftar."}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-lg border border-dashed px-4 py-6 text-muted-foreground">
                  Pilih template email untuk melihat preview.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
