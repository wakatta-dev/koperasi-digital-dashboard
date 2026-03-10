/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useSupportEmailActions, useSupportEmailTemplates } from "@/hooks/queries";
import { FeatureEmailTemplateEditorCard } from "../features/FeatureEmailTemplateEditorCard";
import { FeatureEmailTemplateSelectorCard } from "../features/FeatureEmailTemplateSelectorCard";
import { FeatureEmailTestCard } from "../features/FeatureEmailTestCard";
import { SettingsErrorBanner } from "../shared/SettingsErrorBanner";
import { SettingsReadOnlyAlert } from "../shared/SettingsReadOnlyAlert";
import { TenantSettingsShell } from "../shared/TenantSettingsShell";
import { isDeepEqual } from "../../lib/forms";
import { buildQueryString, canManageTenantSettings } from "../../lib/settings";
import type { EmailTemplateFormState } from "../../types/forms";

export function EmailCommunicationSettingsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const canManage = canManageTenantSettings((session?.user as { role?: string } | undefined)?.role);
  const templatesQuery = useSupportEmailTemplates();
  const { saveTemplate, sendTestEmail } = useSupportEmailActions();
  const templates = useMemo(() => templatesQuery.data ?? [], [templatesQuery.data]);
  const requestedTemplateId = searchParams.get("template") ?? "";

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [draftTemplateId, setDraftTemplateId] = useState("");
  const [formDraft, setFormDraft] = useState<EmailTemplateFormState | null>(null);
  const [testStateTemplateId, setTestStateTemplateId] = useState("");
  const [testRecipientDraft, setTestRecipientDraft] = useState("");
  const [testVariablesDraft, setTestVariablesDraft] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!templates.length) {
      setSelectedTemplateId("");
      return;
    }
    if (requestedTemplateId && templates.some((item) => String(item.id) === requestedTemplateId)) {
      if (selectedTemplateId !== requestedTemplateId) {
        setSelectedTemplateId(requestedTemplateId);
      }
      return;
    }
    if (!selectedTemplateId || !templates.some((item) => String(item.id) === selectedTemplateId)) {
      setSelectedTemplateId(String(templates[0].id));
    }
  }, [requestedTemplateId, selectedTemplateId, templates]);

  useEffect(() => {
    if (!selectedTemplateId) {
      return;
    }
    const nextQuery = buildQueryString(searchParams, { template: selectedTemplateId });
    if (nextQuery === searchParams.toString()) {
      return;
    }
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, { scroll: false });
  }, [pathname, router, searchParams, selectedTemplateId]);

  const selectedTemplate = useMemo(
    () => templates.find((item) => String(item.id) === selectedTemplateId) ?? null,
    [selectedTemplateId, templates]
  );

  const initialTemplateForm = useMemo<EmailTemplateFormState>(
    () => ({
      subject: selectedTemplate?.subject ?? "",
      body: selectedTemplate?.body ?? "",
    }),
    [selectedTemplate]
  );

  const defaultTestVariables = useMemo(
    () =>
      Object.fromEntries(
        (selectedTemplate?.placeholders ?? []).map((placeholder) => [placeholder, ""])
      ),
    [selectedTemplate]
  );
  const form = draftTemplateId === selectedTemplateId && formDraft ? formDraft : initialTemplateForm;
  const testRecipient =
    testStateTemplateId === selectedTemplateId ? testRecipientDraft : "";
  const testVariables =
    testStateTemplateId === selectedTemplateId ? testVariablesDraft : defaultTestVariables;
  const isTemplateDirty =
    draftTemplateId === selectedTemplateId && formDraft
      ? !isDeepEqual(formDraft, initialTemplateForm)
      : false;

  return (
    <TenantSettingsShell
      sectionId="komunikasi-email"
      title="Komunikasi Email"
      description="Kelola template sistem dan uji pengiriman email tenant dengan alur yang lebih jelas dari pemilihan template hingga verifikasi hasil."
      summaryTitle="Status Template"
      summaryDescription="Ringkasan cepat jumlah template, template aktif, dan kebutuhan placeholder."
      summaryItems={[
        {
          label: "Template Tersedia",
          value: `${templates.length} Template`,
          helper: templatesQuery.isLoading ? "Sedang memuat template…" : "Template sistem tenant",
        },
        {
          label: "Template Aktif",
          value: selectedTemplate?.name || "Belum dipilih",
          helper: selectedTemplate?.code || "Pilih template dari daftar",
        },
        {
          label: "Placeholder",
          value: `${selectedTemplate?.placeholders?.length ?? 0} Variabel`,
          helper: canManage ? "Template dapat diperbarui" : "Mode read-only untuk role Anda",
        },
      ]}
    >
      {!canManage ? (
        <SettingsReadOnlyAlert message="Beberapa pengaturan sistem email core dilindungi dan tidak dapat dimodifikasi tanpa eskalasi hak istimewa." />
      ) : null}

      {templatesQuery.error ? (
        <SettingsErrorBanner message={(templatesQuery.error as Error).message} />
      ) : null}

      <FeatureEmailTemplateSelectorCard
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        disabled={!canManage || templatesQuery.isLoading}
        onSelect={setSelectedTemplateId}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <FeatureEmailTemplateEditorCard
          form={form}
          placeholders={selectedTemplate?.placeholders ?? []}
          disabled={!canManage || !selectedTemplate}
          dirty={isTemplateDirty}
          saving={saveTemplate.isPending}
          onChange={(next) => {
            setDraftTemplateId(selectedTemplateId);
            setFormDraft(next);
          }}
          onSave={() =>
            selectedTemplate &&
            saveTemplate.mutate({
              id: selectedTemplate.id,
              subject: form.subject,
              body: form.body,
            })
          }
        />

        <FeatureEmailTestCard
          recipient={testRecipient}
          placeholders={selectedTemplate?.placeholders ?? []}
          variables={testVariables}
          disabled={!canManage || !selectedTemplate}
          sending={sendTestEmail.isPending}
          onRecipientChange={(value) => {
            setTestStateTemplateId(selectedTemplateId);
            setTestRecipientDraft(value);
          }}
          onVariableChange={(key, value) => {
            setTestStateTemplateId(selectedTemplateId);
            setTestVariablesDraft((prev) => ({
              ...(testStateTemplateId === selectedTemplateId ? prev : defaultTestVariables),
              [key]: value,
            }));
          }}
          onSend={() =>
            selectedTemplate &&
            sendTestEmail.mutate(
              {
                to: testRecipient,
                template_id: selectedTemplate.id,
                variables: testVariables,
              },
              {
                onSuccess: () => {
                  setTestStateTemplateId(selectedTemplateId);
                  setTestRecipientDraft("");
                  setTestVariablesDraft(defaultTestVariables);
                },
              }
            )
          }
        />
      </div>
    </TenantSettingsShell>
  );
}
