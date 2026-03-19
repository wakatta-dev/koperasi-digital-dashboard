/** @format */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  useSupportEmailActions,
  useSupportEmailTemplates,
} from "@/hooks/queries";
import { FeatureEmailTemplateEditorCard } from "../features/FeatureEmailTemplateEditorCard";
import { FeatureEmailTemplateSelectorCard } from "../features/FeatureEmailTemplateSelectorCard";
import { FeatureEmailTestCard } from "../features/FeatureEmailTestCard";
import { SettingsErrorBanner } from "../shared/SettingsErrorBanner";
import { SettingsReadOnlyAlert } from "../shared/SettingsReadOnlyAlert";
import { TenantSettingsShell } from "../shared/TenantSettingsShell";
import { isDeepEqual } from "../../lib/forms";
import { buildQueryString, canManageTenantSettings } from "../../lib/settings";
import type { EmailTemplateFormState } from "../../types/forms";

type EmailCommunicationSettingsPageProps = {
  queryString?: string;
};

export function EmailCommunicationSettingsPage({
  queryString = "",
}: EmailCommunicationSettingsPageProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useMemo(
    () => new URLSearchParams(queryString),
    [queryString],
  );
  const { data: session } = useSession();
  const canManage = canManageTenantSettings(
    (session?.user as { role?: string } | undefined)?.role,
  );
  const templatesQuery = useSupportEmailTemplates();
  const { saveTemplate, sendTestEmail } = useSupportEmailActions();
  const templates = useMemo(
    () => templatesQuery.data ?? [],
    [templatesQuery.data],
  );
  const requestedTemplateId = searchParams.get("template") ?? "";
  const [editorState, setEditorState] = useState<{
    selectedTemplateId: string;
    draftTemplateId: string;
    formDraft: EmailTemplateFormState | null;
  }>({
    selectedTemplateId: "",
    draftTemplateId: "",
    formDraft: null,
  });
  const [testState, setTestState] = useState<{
    templateId: string;
    recipient: string;
    variables: Record<string, string>;
  }>({
    templateId: "",
    recipient: "",
    variables: {},
  });
  const { selectedTemplateId, draftTemplateId, formDraft } = editorState;
  const {
    templateId: testStateTemplateId,
    recipient: testRecipientDraft,
    variables: testVariablesDraft,
  } = testState;

  const patchEditorState = useCallback(
    updates:
      | Partial<typeof editorState>
      | ((current: typeof editorState) => typeof editorState),
  ) => {
    setEditorState((current) =>
      typeof updates === "function"
        ? updates(current)
        : { ...current, ...updates },
    );
  }, []);

  const patchTestState = (
    updates:
      | Partial<typeof testState>
      | ((current: typeof testState) => typeof testState),
  ) => {
    setTestState((current) =>
      typeof updates === "function"
        ? updates(current)
        : { ...current, ...updates },
    );
  };

  const syncTemplateQuery = useCallback(
    (templateId: string) => {
      const nextQuery = buildQueryString(searchParams, {
        template: templateId || null,
      });
      if (nextQuery === searchParams.toString()) {
        return;
      }
      router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, searchParams],
  );

  const handleSelectTemplate = useCallback(
    (templateId: string) => {
      patchEditorState({ selectedTemplateId: templateId });
      syncTemplateQuery(templateId);
    },
    [patchEditorState, syncTemplateQuery],
  );

  useEffect(() => {
    let nextTemplateId = selectedTemplateId;
    if (!templates.length) {
      nextTemplateId = "";
    } else if (
      requestedTemplateId &&
      templates.some((item) => String(item.id) === requestedTemplateId)
    ) {
      nextTemplateId = requestedTemplateId;
    } else if (
      !selectedTemplateId ||
      !templates.some((item) => String(item.id) === selectedTemplateId)
    ) {
      nextTemplateId = String(templates[0].id);
    }
    if (nextTemplateId === selectedTemplateId) {
      return;
    }
    patchEditorState({ selectedTemplateId: nextTemplateId });
    if (nextTemplateId) {
      syncTemplateQuery(nextTemplateId);
    }
  }, [requestedTemplateId, selectedTemplateId, syncTemplateQuery, templates]);

  const selectedTemplate = useMemo(
    () =>
      templates.find((item) => String(item.id) === selectedTemplateId) ?? null,
    [selectedTemplateId, templates],
  );

  const initialTemplateForm = useMemo<EmailTemplateFormState>(
    () => ({
      subject: selectedTemplate?.subject ?? "",
      body: selectedTemplate?.body ?? "",
    }),
    [selectedTemplate],
  );

  const defaultTestVariables = useMemo(
    () =>
      Object.fromEntries(
        (selectedTemplate?.placeholders ?? []).map((placeholder) => [
          placeholder,
          "",
        ]),
      ),
    [selectedTemplate],
  );
  const form =
    draftTemplateId === selectedTemplateId && formDraft
      ? formDraft
      : initialTemplateForm;
  const testRecipient =
    testStateTemplateId === selectedTemplateId ? testRecipientDraft : "";
  const testVariables =
    testStateTemplateId === selectedTemplateId
      ? testVariablesDraft
      : defaultTestVariables;
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
          helper: templatesQuery.isLoading
            ? "Sedang memuat template…"
            : "Template sistem tenant",
        },
        {
          label: "Template Aktif",
          value: selectedTemplate?.name || "Belum dipilih",
          helper: selectedTemplate?.code || "Pilih template dari daftar",
        },
        {
          label: "Placeholder",
          value: `${selectedTemplate?.placeholders?.length ?? 0} Variabel`,
          helper: canManage
            ? "Template dapat diperbarui"
            : "Mode read-only untuk role Anda",
        },
      ]}
    >
      {!canManage ? (
        <SettingsReadOnlyAlert message="Beberapa pengaturan sistem email core dilindungi dan tidak dapat dimodifikasi tanpa eskalasi hak istimewa." />
      ) : null}

      {templatesQuery.error ? (
        <SettingsErrorBanner
          message={(templatesQuery.error as Error).message}
        />
      ) : null}

      <FeatureEmailTemplateSelectorCard
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        disabled={!canManage || templatesQuery.isLoading}
        onSelect={handleSelectTemplate}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <FeatureEmailTemplateEditorCard
          form={form}
          placeholders={selectedTemplate?.placeholders ?? []}
          disabled={!canManage || !selectedTemplate}
          dirty={isTemplateDirty}
          saving={saveTemplate.isPending}
          onChange={(next) => {
            patchEditorState({
              draftTemplateId: selectedTemplateId,
              formDraft: next,
            });
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
            patchTestState({
              templateId: selectedTemplateId,
              recipient: value,
            });
          }}
          onVariableChange={(key, value) => {
            patchTestState((current) => ({
              templateId: selectedTemplateId,
              recipient:
                current.templateId === selectedTemplateId
                  ? current.recipient
                  : "",
              variables: {
                ...(current.templateId === selectedTemplateId
                  ? current.variables
                  : defaultTestVariables),
                [key]: value,
              },
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
                  patchTestState({
                    templateId: selectedTemplateId,
                    recipient: "",
                    variables: defaultTestVariables,
                  });
                },
              },
            )
          }
        />
      </div>
    </TenantSettingsShell>
  );
}
