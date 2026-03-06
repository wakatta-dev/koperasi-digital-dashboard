/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useSession } from "next-auth/react";
import { useSupportEmailActions, useSupportEmailTemplates } from "@/hooks/queries";
import { FeatureEmailTemplateEditorCard } from "../features/FeatureEmailTemplateEditorCard";
import { FeatureEmailTemplateSelectorCard } from "../features/FeatureEmailTemplateSelectorCard";
import { FeatureEmailTestCard } from "../features/FeatureEmailTestCard";
import { SettingsErrorBanner } from "../shared/SettingsErrorBanner";
import { SettingsReadOnlyAlert } from "../shared/SettingsReadOnlyAlert";
import { SettingsSectionHeading } from "../shared/SettingsSectionHeading";
import { isDeepEqual } from "../../lib/forms";
import { canManageTenantSettings } from "../../lib/settings";
import type { EmailTemplateFormState } from "../../types/forms";

const emptyTemplate: EmailTemplateFormState = {
  subject: "",
  body: "",
};

export function EmailCommunicationSettingsPage() {
  const { data: session } = useSession();
  const canManage = canManageTenantSettings((session?.user as { role?: string } | undefined)?.role);
  const templatesQuery = useSupportEmailTemplates();
  const { saveTemplate, sendTestEmail } = useSupportEmailActions();
  const templates = useMemo(() => templatesQuery.data ?? [], [templatesQuery.data]);

  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [form, setForm] = useState<EmailTemplateFormState>(emptyTemplate);
  const [testRecipient, setTestRecipient] = useState("");
  const [testVariables, setTestVariables] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!templates.length) {
      setSelectedTemplateId("");
      return;
    }
    if (!selectedTemplateId || !templates.some((item) => String(item.id) === selectedTemplateId)) {
      setSelectedTemplateId(String(templates[0].id));
    }
  }, [selectedTemplateId, templates]);

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

  useEffect(() => {
    setForm(initialTemplateForm);
  }, [initialTemplateForm]);

  useEffect(() => {
    const nextVariables: Record<string, string> = {};
    for (const placeholder of selectedTemplate?.placeholders ?? []) {
      nextVariables[placeholder] = "";
    }
    setTestVariables(nextVariables);
  }, [selectedTemplate]);

  return (
    <div className="max-w-4xl space-y-6">
      <SettingsSectionHeading
        title="Komunikasi Email"
        description="Manajemen template email dan pengujian komunikasi untuk platform."
      />

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

      <FeatureEmailTemplateEditorCard
        form={form}
        placeholders={selectedTemplate?.placeholders ?? []}
        disabled={!canManage || !selectedTemplate}
        dirty={!isDeepEqual(form, initialTemplateForm)}
        saving={saveTemplate.isPending}
        onChange={setForm}
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
        onRecipientChange={setTestRecipient}
        onVariableChange={(key, value) =>
          setTestVariables((prev) => ({ ...prev, [key]: value }))
        }
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
                setTestRecipient("");
                setTestVariables(
                  Object.fromEntries(
                    (selectedTemplate.placeholders ?? []).map((placeholder) => [placeholder, ""])
                  )
                );
              },
            }
          )
        }
      />
    </div>
  );
}
