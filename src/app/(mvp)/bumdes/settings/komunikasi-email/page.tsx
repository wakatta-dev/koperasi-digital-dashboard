/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useSupportEmailActions, useSupportEmailTemplates } from "@/hooks/queries";
import { canManageSettings } from "../helpers";

export default function SettingsKomunikasiEmailPage() {
  const { data: session } = useSession();
  const canManage = canManageSettings((session?.user as any)?.role);
  const templatesQuery = useSupportEmailTemplates();
  const { saveTemplate, sendTestEmail } = useSupportEmailActions();
  const templates = useMemo(() => templatesQuery.data ?? [], [templatesQuery.data]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [testRecipient, setTestRecipient] = useState("");

  useEffect(() => {
    if (!templates.length) {
      setSelectedTemplateId("");
      return;
    }
    if (!selectedTemplateId) {
      setSelectedTemplateId(String(templates[0].id));
      return;
    }
    if (!templates.some((item) => String(item.id) === selectedTemplateId)) {
      setSelectedTemplateId(String(templates[0].id));
    }
  }, [selectedTemplateId, templates]);

  const selectedTemplate = useMemo(
    () => templates.find((item) => String(item.id) === selectedTemplateId) ?? null,
    [selectedTemplateId, templates]
  );

  useEffect(() => {
    if (!selectedTemplate) return;
    setSubject(selectedTemplate.subject ?? "");
    setBody(selectedTemplate.body ?? "");
  }, [selectedTemplate]);

  const isDirty = Boolean(
    selectedTemplate &&
      (subject !== (selectedTemplate.subject ?? "") || body !== (selectedTemplate.body ?? ""))
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Komunikasi Email</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Kelola template email tenant dan lakukan pengiriman email uji.
        </p>
      </div>

      {!canManage ? (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="mr-2 inline h-4 w-4" />
          Mode baca saja: hanya admin tenant yang dapat mengubah template email.
        </div>
      ) : null}

      {templatesQuery.error ? (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {(templatesQuery.error as Error).message}
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Template Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="max-w-md space-y-2">
            <Label>Pilih Template</Label>
            <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih template email" />
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

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                disabled={!canManage || !selectedTemplate}
              />
            </div>
            <div className="space-y-2">
              <Label>Body</Label>
              <Textarea
                value={body}
                onChange={(event) => setBody(event.target.value)}
                disabled={!canManage || !selectedTemplate}
                rows={10}
              />
            </div>
          </div>

          <div className="rounded-md border bg-slate-50 p-3 text-sm text-slate-700">
            <div className="mb-2 font-medium">Placeholder tersedia:</div>
            <div className="flex flex-wrap gap-2">
              {(selectedTemplate?.placeholders ?? []).map((placeholder) => (
                <span
                  key={placeholder}
                  className="rounded bg-white px-2 py-1 text-xs text-slate-600 ring-1 ring-slate-200"
                >
                  {`{{${placeholder}}}`}
                </span>
              ))}
              {(selectedTemplate?.placeholders ?? []).length === 0 ? (
                <span className="text-xs text-slate-500">Tidak ada placeholder.</span>
              ) : null}
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              onClick={() =>
                selectedTemplate &&
                saveTemplate.mutate({
                  id: selectedTemplate.id,
                  subject,
                  body,
                })
              }
              disabled={!canManage || !selectedTemplate || !isDirty || saveTemplate.isPending}
            >
              {saveTemplate.isPending ? "Menyimpan..." : "Simpan Template"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kirim Email Uji</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 md:max-w-lg">
          <div className="space-y-2">
            <Label htmlFor="test-email">Penerima</Label>
            <Input
              id="test-email"
              type="email"
              placeholder="admin@desa.id"
              value={testRecipient}
              onChange={(event) => setTestRecipient(event.target.value)}
              disabled={!canManage}
            />
          </div>
          <Button
            type="button"
            onClick={() =>
              selectedTemplate &&
              sendTestEmail.mutate({
                to: testRecipient,
                template_id: selectedTemplate.id,
                variables: {
                  name: "Admin BUMDes",
                  tenant_name: "Tenant BUMDes",
                  verify_link: "https://example.com/verify",
                  new_email: "new-email@example.com",
                  reason: "Testing",
                  message: "Ini email uji dari halaman settings.",
                },
              })
            }
            disabled={
              !canManage ||
              !selectedTemplate ||
              !testRecipient.trim() ||
              sendTestEmail.isPending
            }
          >
            {sendTestEmail.isPending ? "Mengirim..." : "Kirim Email Uji"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
