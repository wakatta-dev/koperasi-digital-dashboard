/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Info,
  LockKeyhole,
  Monitor,
  PencilLine,
  RefreshCw,
  Save,
  Smartphone,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { ensureSuccess } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  confirmLandingTemplateSelect,
  getLandingEditorState,
  listLandingTemplates,
  publishLanding,
  saveLandingDraft,
  selectLandingTemplate,
  uploadLandingMedia,
} from "@/services/landing-page";
import {
  TemplateOne,
  TemplateThree,
  TemplateTwo,
} from "@/modules/landing/template";
import { TemplatePreviewFrame } from "./components/TemplatePreviewFrame";
import type {
  LandingEditorState,
  LandingTemplateFieldSchema,
  LandingTemplateSectionSchema,
  LandingTemplateSummary,
} from "@/types/landing-page";

type SaveState = "idle" | "saving" | "saved" | "error";
type PreviewDevice = "mobile" | "desktop";
type BuilderTab = "content" | "template" | "publish";

const MAX_UPLOAD_SIZE = 2 * 1024 * 1024;
const TEMPLATE_PREVIEW_PRESETS: Array<{
  match: string;
  className: string;
  accentClassName: string;
}> = [
  {
    match: "template-1",
    className: "from-amber-200 via-orange-100 to-rose-100",
    accentClassName: "bg-amber-600/20",
  },
  {
    match: "template-2",
    className: "from-emerald-200 via-lime-100 to-cyan-100",
    accentClassName: "bg-emerald-700/20",
  },
  {
    match: "template-3",
    className: "from-sky-200 via-blue-100 to-indigo-100",
    accentClassName: "bg-blue-700/20",
  },
];

function cloneContent<T>(value: T): T {
  return JSON.parse(JSON.stringify(value ?? null)) as T;
}

function asRecord(value: unknown): Record<string, any> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, any>;
  }
  return {};
}

function getSectionData(
  content: Record<string, any>,
  sectionKey: string,
): Record<string, any> {
  return asRecord(content?.[sectionKey]);
}

function defaultValueForField(field: LandingTemplateFieldSchema): any {
  const type = (field.type || "text").toLowerCase();
  if (type === "boolean") return false;
  if (type === "number") return 0;
  if (type === "repeater") return [];
  return "";
}

function buildRepeaterItem(fields: LandingTemplateFieldSchema[] = []) {
  const item: Record<string, any> = {};
  fields.forEach((field) => {
    item[field.key] = defaultValueForField(field);
  });
  return item;
}

function changedSections(
  schema: LandingTemplateSectionSchema[],
  draft: Record<string, any>,
  published: Record<string, any>,
): string[] {
  return schema
    .map((section) => section.key)
    .filter(
      (key) =>
        JSON.stringify(draft?.[key] ?? {}) !==
        JSON.stringify(published?.[key] ?? {}),
    );
}

function formatEpoch(value?: number) {
  if (!value) return "-";
  const date = new Date(value * 1000);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatRelativeEpoch(value?: number) {
  if (!value) return "-";
  const now = Date.now();
  const ms = value * 1000;
  const diff = now - ms;
  if (!Number.isFinite(diff) || diff < 0) return formatEpoch(value);
  const minutes = Math.floor(diff / (60 * 1000));
  if (minutes < 1) return "baru saja";
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} hari lalu`;
  return formatEpoch(value);
}

function getTemplateLabel(template: LandingTemplateSummary | undefined) {
  if (!template) return "-";
  return `${template.name} (${template.code})`;
}

function getTemplatePreviewPreset(templateCode: string) {
  const lowerCode = (templateCode || "").toLowerCase();
  return (
    TEMPLATE_PREVIEW_PRESETS.find((preset) =>
      lowerCode.includes(preset.match),
    ) ?? {
      className: "from-slate-200 via-slate-100 to-zinc-100",
      accentClassName: "bg-slate-700/20",
    }
  );
}

function getTemplateComponent(templateCode: string | undefined) {
  const selectedTemplateCode = (templateCode ?? "").toLowerCase();
  if (selectedTemplateCode === "template-2") {
    return TemplateTwo;
  }
  if (selectedTemplateCode === "template-3") {
    return TemplateThree;
  }
  return TemplateOne;
}

export function LandingPageManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSwitchingTemplate, setIsSwitchingTemplate] = useState(false);
  const [editorState, setEditorState] = useState<LandingEditorState | null>(
    null,
  );
  const [templates, setTemplates] = useState<LandingTemplateSummary[]>([]);
  const [draftContent, setDraftContent] = useState<Record<string, any>>({});
  const [selectedSectionKey, setSelectedSectionKey] = useState<string>("");
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>("desktop");
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [builderTab, setBuilderTab] = useState<BuilderTab>("content");
  const [previewHost, setPreviewHost] = useState("bumdes.3portals.id");
  const [previewTemplate, setPreviewTemplate] =
    useState<LandingTemplateSummary | null>(null);

  const schemaSections = useMemo(
    () => editorState?.section_schema?.sections ?? [],
    [editorState],
  );

  const selectedSection = useMemo(
    () => schemaSections.find((section) => section.key === selectedSectionKey),
    [schemaSections, selectedSectionKey],
  );

  const changedSectionKeys = useMemo(
    () =>
      changedSections(
        schemaSections,
        draftContent,
        editorState?.published_content ?? {},
      ),
    [schemaSections, draftContent, editorState?.published_content],
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPreviewHost(window.location.host);
    }
  }, []);

  const hydrateState = (next: LandingEditorState) => {
    setEditorState(next);
    setDraftContent(cloneContent(next.draft_content ?? {}));
    setIsDirty(false);
    setSaveState("idle");

    if (!selectedSectionKey) {
      setSelectedSectionKey(next.section_schema?.sections?.[0]?.key ?? "");
      return;
    }

    const exists = next.section_schema?.sections?.some(
      (section) => section.key === selectedSectionKey,
    );
    if (!exists) {
      setSelectedSectionKey(next.section_schema?.sections?.[0]?.key ?? "");
    }
  };

  const loadManagementState = async () => {
    setIsLoading(true);
    try {
      const [stateRes, templatesRes] = await Promise.all([
        getLandingEditorState(),
        listLandingTemplates(),
      ]);
      const stateData = ensureSuccess(stateRes);
      const templateData = ensureSuccess(templatesRes);
      hydrateState(stateData);
      setTemplates(templateData ?? []);
    } catch (err: any) {
      toast.error(err?.message || "Gagal memuat landing page management");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadManagementState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setFieldValue = (
    sectionKey: string,
    fieldKey: string,
    value: any,
    repeaterIndex?: number,
    repeaterItemKey?: string,
  ) => {
    setDraftContent((prev) => {
      const next = cloneContent(prev ?? {});
      const sectionValue = getSectionData(next, sectionKey);

      if (typeof repeaterIndex === "number" && repeaterItemKey) {
        const list = Array.isArray(sectionValue[fieldKey])
          ? [...sectionValue[fieldKey]]
          : [];
        const currentItem =
          list[repeaterIndex] && typeof list[repeaterIndex] === "object"
            ? { ...list[repeaterIndex] }
            : {};
        currentItem[repeaterItemKey] = value;
        list[repeaterIndex] = currentItem;
        sectionValue[fieldKey] = list;
      } else {
        sectionValue[fieldKey] = value;
      }

      next[sectionKey] = sectionValue;
      return next;
    });
    setIsDirty(true);
    if (saveState !== "idle") {
      setSaveState("idle");
    }
  };

  const addRepeaterItem = (
    sectionKey: string,
    field: LandingTemplateFieldSchema,
  ) => {
    const itemFields = field.item_fields ?? [];
    setDraftContent((prev) => {
      const next = cloneContent(prev ?? {});
      const sectionValue = getSectionData(next, sectionKey);
      const list = Array.isArray(sectionValue[field.key])
        ? [...sectionValue[field.key]]
        : [];
      if (
        typeof field.max_items === "number" &&
        list.length >= field.max_items
      ) {
        return prev;
      }
      list.push(buildRepeaterItem(itemFields));
      sectionValue[field.key] = list;
      next[sectionKey] = sectionValue;
      return next;
    });
    setIsDirty(true);
  };

  const removeRepeaterItem = (
    sectionKey: string,
    fieldKey: string,
    index: number,
  ) => {
    setDraftContent((prev) => {
      const next = cloneContent(prev ?? {});
      const sectionValue = getSectionData(next, sectionKey);
      const list = Array.isArray(sectionValue[fieldKey])
        ? [...sectionValue[fieldKey]]
        : [];
      list.splice(index, 1);
      sectionValue[fieldKey] = list;
      next[sectionKey] = sectionValue;
      return next;
    });
    setIsDirty(true);
  };

  const handleImageUpload = async (
    sectionKey: string,
    fieldKey: string,
    file: File,
    repeaterIndex?: number,
    repeaterItemKey?: string,
  ) => {
    if (!file) return;
    if (file.size > MAX_UPLOAD_SIZE) {
      toast.error("Ukuran file melebihi 2MB");
      return;
    }

    const body = new FormData();
    body.append("file", file);
    body.append("section", sectionKey);
    body.append("variant", repeaterItemKey || fieldKey);

    try {
      const uploaded = ensureSuccess(await uploadLandingMedia(body));
      setFieldValue(
        sectionKey,
        fieldKey,
        uploaded.url,
        repeaterIndex,
        repeaterItemKey,
      );
      toast.success("Gambar berhasil diunggah");
    } catch (err: any) {
      toast.error(err?.message || "Gagal upload gambar");
    }
  };

  const handleSaveDraft = async () => {
    if (!editorState) return;
    setSaveState("saving");
    try {
      const nextState = ensureSuccess(
        await saveLandingDraft({
          expected_draft_version: editorState.draft_version,
          draft_content: cloneContent(draftContent),
        }),
      );
      hydrateState(nextState);
      setSaveState("saved");
      toast.success("Draft tersimpan");
    } catch (err: any) {
      setSaveState("error");
      toast.error(err?.message || "Gagal menyimpan draft");
    }
  };

  const handlePublish = async () => {
    if (!editorState) return;
    if (isDirty) {
      toast.error("Simpan draft terlebih dahulu sebelum publish");
      return;
    }
    setIsPublishing(true);
    try {
      const nextState = ensureSuccess(
        await publishLanding({
          expected_draft_version: editorState.draft_version,
        }),
      );
      hydrateState(nextState);
      toast.success("Landing page berhasil dipublish");
    } catch (err: any) {
      toast.error(err?.message || "Gagal publish landing page");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleTemplateSelect = async (templateId: number) => {
    setIsSwitchingTemplate(true);
    try {
      const result = ensureSuccess(
        await selectLandingTemplate({
          template_id: templateId,
          force_replace: false,
        }),
      );

      if (result.requires_confirmation) {
        const confirmed = window.confirm(
          "Mengganti template akan me-reset draft ke konten default template baru. Lanjutkan?",
        );
        if (!confirmed) {
          return;
        }

        const confirmedResult = ensureSuccess(
          await confirmLandingTemplateSelect({
            template_id: templateId,
            force_replace: true,
          }),
        );

        if (confirmedResult.editor_state) {
          hydrateState(confirmedResult.editor_state);
        } else {
          await loadManagementState();
        }

        toast.success("Template berhasil diganti");
        return;
      }

      if (result.editor_state) {
        hydrateState(result.editor_state);
      } else {
        await loadManagementState();
      }

      toast.success("Template berhasil dipilih");
    } catch (err: any) {
      toast.error(err?.message || "Gagal memilih template");
    } finally {
      setIsSwitchingTemplate(false);
    }
  };

  const renderSimpleField = (
    sectionKey: string,
    field: LandingTemplateFieldSchema,
    value: any,
    repeaterIndex?: number,
    repeaterItemKey?: string,
  ) => {
    const fieldType = (field.type || "text").toLowerCase();
    const label = field.label || field.key;

    const onFieldChange = (nextValue: any) => {
      setFieldValue(
        sectionKey,
        repeaterItemKey ? repeaterItemKey : field.key,
        nextValue,
        repeaterIndex,
        repeaterItemKey ? field.key : undefined,
      );
    };

    if (fieldType === "textarea") {
      return (
        <div
          key={`${field.key}-${repeaterIndex ?? "root"}`}
          className="space-y-2"
        >
          <label className="text-sm font-medium">
            {label}
            {field.required ? " *" : ""}
          </label>
          <Textarea
            value={typeof value === "string" ? value : ""}
            onChange={(event) => onFieldChange(event.target.value)}
            rows={4}
          />
        </div>
      );
    }

    if (fieldType === "boolean") {
      return (
        <div
          key={`${field.key}-${repeaterIndex ?? "root"}`}
          className="flex items-center justify-between rounded-lg border p-3"
        >
          <div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">
              Aktifkan/nonaktifkan nilai ini
            </p>
          </div>
          <Switch checked={Boolean(value)} onCheckedChange={onFieldChange} />
        </div>
      );
    }

    if (fieldType === "number") {
      return (
        <div
          key={`${field.key}-${repeaterIndex ?? "root"}`}
          className="space-y-2"
        >
          <label className="text-sm font-medium">
            {label}
            {field.required ? " *" : ""}
          </label>
          <Input
            type="number"
            value={typeof value === "number" ? String(value) : ""}
            onChange={(event) => {
              const parsed = Number(event.target.value);
              onFieldChange(Number.isFinite(parsed) ? parsed : 0);
            }}
          />
        </div>
      );
    }

    if (fieldType === "image") {
      const currentURL = typeof value === "string" ? value : "";
      return (
        <div
          key={`${field.key}-${repeaterIndex ?? "root"}`}
          className="space-y-2"
        >
          <label className="text-sm font-medium">
            {label}
            {field.required ? " *" : ""}
          </label>
          <Input
            value={currentURL}
            placeholder="https://..."
            onChange={(event) => onFieldChange(event.target.value)}
          />
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              handleImageUpload(
                sectionKey,
                repeaterItemKey ? repeaterItemKey : field.key,
                file,
                repeaterIndex,
                repeaterItemKey ? field.key : undefined,
              );
              event.target.value = "";
            }}
          />
          {currentURL ? (
            <div className="overflow-hidden rounded-md border bg-muted/30">
              <img
                src={currentURL}
                alt={label}
                className="h-28 w-full object-cover"
                loading="lazy"
              />
            </div>
          ) : null}
          <p className="text-xs text-muted-foreground">Maksimal 2MB</p>
        </div>
      );
    }

    return (
      <div
        key={`${field.key}-${repeaterIndex ?? "root"}`}
        className="space-y-2"
      >
        <label className="text-sm font-medium">
          {label}
          {field.required ? " *" : ""}
        </label>
        <Input
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onFieldChange(event.target.value)}
        />
      </div>
    );
  };

  const renderSectionEditor = (section: LandingTemplateSectionSchema) => {
    const sectionData = getSectionData(draftContent, section.key);

    return (
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">
            {section.label || section.key}
          </h3>
          <p className="text-sm text-muted-foreground">
            Perubahan hanya disimpan lokal sampai Anda klik Simpan Draft.
          </p>
        </div>

        {section.fields.map((field) => {
          const fieldType = (field.type || "text").toLowerCase();
          const value = sectionData[field.key];

          if (fieldType !== "repeater") {
            return renderSimpleField(section.key, field, value);
          }

          const list = Array.isArray(value) ? value : [];
          const itemFields = field.item_fields ?? [];
          const maxItems =
            typeof field.max_items === "number" ? field.max_items : undefined;
          const minItems =
            typeof field.min_items === "number" ? field.min_items : 0;
          const canAddItem = maxItems ? list.length < maxItems : true;

          return (
            <Card key={field.key} className="gap-4">
              <CardHeader>
                <CardTitle className="text-base">
                  {field.label || field.key}
                </CardTitle>
                <CardDescription>
                  Kelola daftar item. Anda bisa menambah atau menghapus item.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Total item: {list.length}
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addRepeaterItem(section.key, field)}
                    disabled={!canAddItem}
                  >
                    Tambah Item
                  </Button>
                </div>

                {list.length === 0 && (
                  <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                    Belum ada item.
                  </p>
                )}

                {list.map((item, index) => {
                  const itemMap = item && typeof item === "object" ? item : {};
                  return (
                    <Card key={`${field.key}-${index}`} className="gap-3">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-sm">
                          Item #{index + 1}
                        </CardTitle>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            removeRepeaterItem(section.key, field.key, index)
                          }
                          disabled={list.length <= minItems}
                        >
                          Hapus
                        </Button>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {itemFields.map((itemField) =>
                          renderSimpleField(
                            section.key,
                            itemField,
                            itemMap[itemField.key],
                            index,
                            field.key,
                          ),
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Landing Page Management</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Memuat data management landing page...
            </p>
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!editorState) {
    return (
      <section className="space-y-4">
        <h1 className="text-2xl font-bold">Landing Page Management</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              State editor tidak tersedia.
            </p>
            <Button
              type="button"
              className="mt-3"
              onClick={loadManagementState}
            >
              Muat Ulang
            </Button>
          </CardContent>
        </Card>
      </section>
    );
  }

  const lastUpdatedAt =
    editorState.last_draft_saved_at || editorState.last_published_at;
  const hasUnpublishedBanner = editorState.has_unpublished_changes;
  const saveStateLabel =
    saveState === "saved"
      ? "Draft tersimpan"
      : saveState === "saving"
        ? "Menyimpan draft..."
        : saveState === "error"
          ? "Gagal simpan draft"
          : isDirty
            ? "Perubahan lokal belum disimpan"
            : "Sinkron";
  const SelectedTemplateComponent = getTemplateComponent(
    editorState.template?.code,
  );
  const PreviewTemplateComponent = previewTemplate
    ? getTemplateComponent(previewTemplate.code)
    : null;

  return (
    <>
      <section className="flex min-h-[calc(100vh-9rem)] flex-col overflow-hidden rounded-xl border border-border bg-background shadow-sm">
        <div className="sticky top-0 z-20 border-b bg-background/95 px-4 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/85 md:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge
                  className={cn(
                    "gap-1.5 border px-2.5 py-0.5",
                    hasUnpublishedBanner
                      ? "border-amber-200 bg-amber-50 text-amber-700"
                      : "border-emerald-200 bg-emerald-50 text-emerald-700",
                  )}
                >
                  <span
                    className={cn(
                      "inline-block h-1.5 w-1.5 rounded-full",
                      hasUnpublishedBanner ? "bg-amber-500" : "bg-emerald-500",
                    )}
                  />
                  {hasUnpublishedBanner ? "Draft" : "Published"}
                </Badge>
                <span className="text-xs text-muted-foreground lg:border-l lg:pl-2">
                  Terakhir diperbarui: {formatRelativeEpoch(lastUpdatedAt)}
                </span>
              </div>

              {hasUnpublishedBanner ? (
                <p className="flex items-center gap-1.5 text-xs text-amber-600">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Ada perubahan yang belum dipublikasikan
                </p>
              ) : null}

              {isDirty ? (
                <p className="flex items-center gap-1.5 text-xs text-rose-600">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Perubahan lokal belum disimpan, klik Simpan Draft di Builder.
                </p>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center rounded-lg border bg-muted/40 p-1">
                <button
                  type="button"
                  className={cn(
                    "rounded-md p-1.5 text-muted-foreground transition-colors",
                    previewDevice === "mobile"
                      ? "bg-background text-foreground shadow-sm"
                      : "hover:text-foreground",
                  )}
                  onClick={() => setPreviewDevice("mobile")}
                  aria-label="Mode mobile"
                >
                  <Smartphone className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className={cn(
                    "rounded-md p-1.5 text-muted-foreground transition-colors",
                    previewDevice === "desktop"
                      ? "bg-background text-foreground shadow-sm"
                      : "hover:text-foreground",
                  )}
                  onClick={() => setPreviewDevice("desktop")}
                  aria-label="Mode desktop"
                >
                  <Monitor className="h-4 w-4" />
                </button>
              </div>

              <div className="hidden h-8 w-px bg-border sm:block" />

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={handlePublish}
                  disabled={isPublishing || isDirty}
                >
                  <Upload className="h-4 w-4" />
                  {isPublishing ? "Publishing..." : "Publish"}
                </Button>
                <Button
                  type="button"
                  className="gap-2"
                  onClick={() => {
                    setBuilderTab("content");
                    setIsBuilderOpen(true);
                  }}
                >
                  <PencilLine className="h-4 w-4" />
                  Edit di Builder
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span>
              Template aktif: {getTemplateLabel(editorState.template)}
            </span>
            <span>Draft v{editorState.draft_version}</span>
            <span>Published v{editorState.published_version}</span>
            <span>Status: {saveStateLabel}</span>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-muted/30 p-4 md:p-6">
          <div
            className={cn(
              "mx-auto flex h-full min-h-[520px] flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl",
              previewDevice === "mobile" ? "max-w-[420px]" : "w-full",
            )}
          >
            <div className="flex items-center gap-3 border-b bg-muted/60 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
              </div>

              <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-md border bg-background px-3 py-1 text-xs text-muted-foreground">
                <LockKeyhole className="h-3.5 w-3.5" />
                <span className="truncate">{previewHost}</span>
              </div>

              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </div>

            <div className="grow h-0">
              <TemplatePreviewFrame
                title={`Preview ${editorState.template.code || editorState.template.id}`}
                resetKey={`${previewDevice}-${editorState.template.id}`}
                className="block h-full w-full"
              >
                <SelectedTemplateComponent
                  key={editorState.template.code || editorState.template.id}
                  content={draftContent}
                />
              </TemplatePreviewFrame>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            <span>
              Ini adalah pratinjau{" "}
              {previewDevice === "desktop" ? "desktop" : "mobile"}. Klik Edit di
              Builder untuk mengubah konten.
            </span>
          </div>
        </div>
      </section>

      <Sheet open={isBuilderOpen} onOpenChange={setIsBuilderOpen}>
        <SheetContent
          side="right"
          className="w-full max-w-none gap-0 overflow-hidden p-0 sm:max-w-none md:w-[980px]"
        >
          <SheetHeader className="border-b px-5 py-4">
            <SheetTitle>Landing Page Builder</SheetTitle>
            <SheetDescription>
              Pilih template, edit konten section, lalu simpan draft sebelum
              publish.
            </SheetDescription>
          </SheetHeader>

          <Tabs
            value={builderTab}
            onValueChange={(value) => setBuilderTab(value as BuilderTab)}
            className="flex min-h-0 flex-1 flex-col overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
              <TabsList>
                <TabsTrigger value="content">Konten</TabsTrigger>
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="publish">Publish</TabsTrigger>
              </TabsList>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{saveStateLabel}</Badge>
                <Button
                  type="button"
                  variant="outline"
                  className="gap-2"
                  onClick={handleSaveDraft}
                  disabled={saveState === "saving"}
                >
                  <Save className="h-4 w-4" />
                  {saveState === "saving" ? "Menyimpan..." : "Simpan Draft"}
                </Button>
                <Button
                  type="button"
                  className="gap-2"
                  onClick={handlePublish}
                  disabled={isPublishing || isDirty}
                >
                  <Upload className="h-4 w-4" />
                  {isPublishing ? "Publishing..." : "Publish"}
                </Button>
              </div>
            </div>

            <TabsContent
              value="template"
              className="mt-0 min-h-0 flex-1 overflow-hidden"
            >
              <div className="h-full overflow-y-auto px-4 py-4">
                <div className="grid gap-4 pb-6 md:grid-cols-2 xl:grid-cols-3">
                  {templates.length === 0 ? (
                    <Card className="md:col-span-2 xl:col-span-3">
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          Belum ada template aktif.
                        </p>
                      </CardContent>
                    </Card>
                  ) : null}

                  {templates.map((template) => {
                    const active = template.id === editorState.template.id;
                    const preset = getTemplatePreviewPreset(template.code);
                    return (
                      <Card
                        key={template.id}
                        className={cn(
                          "group overflow-hidden gap-0 border-border/80 pt-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl",
                          active &&
                            "border-primary/70 shadow-lg shadow-primary/10",
                        )}
                      >
                        <div className="relative aspect-[16/10] overflow-hidden border-b bg-muted">
                          {template.preview_image_url ? (
                            <img
                              src={template.preview_image_url}
                              alt={`Preview ${template.name}`}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                            />
                          ) : (
                            <div
                              className={cn(
                                "relative h-full w-full bg-gradient-to-br",
                                preset.className,
                              )}
                            >
                              <div
                                className={cn(
                                  "absolute -top-10 -right-10 h-32 w-32 rounded-full blur-xl",
                                  preset.accentClassName,
                                )}
                              />
                              <div
                                className={cn(
                                  "absolute -bottom-12 -left-8 h-32 w-32 rounded-full blur-xl",
                                  preset.accentClassName,
                                )}
                              />
                              <div className="absolute inset-0 flex items-end p-4">
                                <p className="rounded-md bg-white/75 px-2 py-1 text-[11px] font-medium text-foreground/85 backdrop-blur-sm">
                                  Placeholder preview
                                </p>
                              </div>
                            </div>
                          )}

                          <div className="absolute left-3 top-3 flex items-center gap-2">
                            {active ? (
                              <Badge variant="default">Aktif</Badge>
                            ) : null}
                            {!template.preview_image_url ? (
                              <Badge variant="secondary">
                                Belum ada gambar
                              </Badge>
                            ) : null}
                          </div>

                          <div className="absolute right-3 top-3">
                            <Button
                              type="button"
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 bg-background/80 hover:bg-background"
                              onClick={() => setPreviewTemplate(template)}
                              aria-label={`Preview ${template.name}`}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <CardHeader className="py-2">
                          <CardTitle className="text-base leading-tight">
                            {template.name}
                          </CardTitle>
                          <CardDescription className="min-h-10">
                            {template.description || "Template landing page"}
                          </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-3 text-sm text-muted-foreground">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge variant="outline">
                              {template.category || "-"}
                            </Badge>
                            <Badge variant="outline" className="font-mono">
                              {template.code}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 pt-1">
                            <Button
                              type="button"
                              variant="outline"
                              className="gap-2"
                              onClick={() => setPreviewTemplate(template)}
                            >
                              <Eye className="h-4 w-4" />
                              Preview
                            </Button>
                            <Button
                              type="button"
                              variant={active ? "secondary" : "default"}
                              disabled={active || isSwitchingTemplate}
                              onClick={() => handleTemplateSelect(template.id)}
                            >
                              {active ? "Template Aktif" : "Gunakan Template"}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="content"
              className="mt-0 min-h-0 flex-1 overflow-hidden"
            >
              <div className="grid h-full min-h-0 md:grid-cols-[230px_1fr]">
                <div className="overflow-y-auto border-b px-3 py-3 md:border-r md:border-b-0">
                  <div>
                    <div className="space-y-2 pb-6">
                      {schemaSections.length === 0 ? (
                        <p className="rounded-md border border-dashed p-3 text-sm text-muted-foreground">
                          Belum ada section schema.
                        </p>
                      ) : null}

                      {schemaSections.map((section) => {
                        const isChanged = changedSectionKeys.includes(
                          section.key,
                        );
                        return (
                          <button
                            key={section.key}
                            type="button"
                            className={cn(
                              "w-full rounded-md border px-3 py-2 text-left text-sm",
                              selectedSectionKey === section.key
                                ? "border-primary bg-primary/5"
                                : "border-border",
                              isChanged && "border-amber-200 bg-amber-50/60",
                            )}
                            onClick={() => setSelectedSectionKey(section.key)}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span>{section.label || section.key}</span>
                              {isChanged ? (
                                <span className="inline-flex h-2 w-2 rounded-full bg-amber-500" />
                              ) : null}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="h-full overflow-y-auto p-4 pb-10">
                  {selectedSection ? (
                    renderSectionEditor(selectedSection)
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Pilih section terlebih dahulu.
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent
              value="publish"
              className="mt-0 min-h-0 flex-1 overflow-hidden"
            >
              <div className="h-full overflow-y-auto p-4 pb-10">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">
                      Ringkasan Publish
                    </CardTitle>
                    <CardDescription>
                      Pastikan draft sudah disimpan sebelum melakukan publish.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium">Section berubah</p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {changedSectionKeys.length === 0 ? (
                          <span className="text-sm text-muted-foreground">
                            Tidak ada perubahan.
                          </span>
                        ) : (
                          changedSectionKeys.map((key) => (
                            <Badge key={key} variant="outline">
                              {key}
                            </Badge>
                          ))
                        )}
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-1.5">
                        {isDirty ? (
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        )}
                        Draft tersimpan: {isDirty ? "Belum" : "Ya"}
                      </p>
                      <p>Draft version: {editorState.draft_version}</p>
                      <p>Published version: {editorState.published_version}</p>
                      <p>
                        Last draft:{" "}
                        {formatEpoch(editorState.last_draft_saved_at)}
                      </p>
                      <p>
                        Last publish:{" "}
                        {formatEpoch(editorState.last_published_at)}
                      </p>
                    </div>

                    <Button
                      type="button"
                      onClick={handlePublish}
                      disabled={isPublishing || isDirty}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      {isPublishing ? "Publishing..." : "Publish Sekarang"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      <Dialog
        open={Boolean(previewTemplate)}
        onOpenChange={(open) => {
          if (!open) {
            setPreviewTemplate(null);
          }
        }}
      >
        <DialogContent className="!flex h-[92dvh] max-h-[92dvh] flex-col overflow-hidden p-0 sm:h-[90dvh] sm:max-h-[90dvh] sm:max-w-[96vw]">
          {previewTemplate ? (
            <div className="flex min-h-0 flex-1 flex-col">
              <div className="shrink-0 border-b p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-4">
                    <DialogHeader className="space-y-1 text-left">
                      <DialogTitle>{previewTemplate.name}</DialogTitle>
                      <DialogDescription>
                        {previewTemplate.description || "Template landing page"}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant="secondary">
                        {previewTemplate.category || "-"}
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        {previewTemplate.code}
                      </Badge>
                      {previewTemplate.id !== editorState.template.id ? (
                        <Badge variant="outline">
                          Preview default template
                        </Badge>
                      ) : (
                        <Badge variant="outline">Preview draft saat ini</Badge>
                      )}
                    </div>
                  </div>

                  <Button
                    type="button"
                    className="mt-8"
                    disabled={
                      isSwitchingTemplate ||
                      previewTemplate.id === editorState.template.id
                    }
                    onClick={async () => {
                      await handleTemplateSelect(previewTemplate.id);
                      setPreviewTemplate(null);
                    }}
                  >
                    {previewTemplate.id === editorState.template.id
                      ? "Template Aktif"
                      : "Gunakan Template Ini"}
                  </Button>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-hidden p-4 sm:p-5">
                <div className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-muted/30">
                  <div className="flex items-center gap-3 border-b bg-background px-4 py-2">
                    <div className="flex gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-md border bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
                      <LockKeyhole className="h-3.5 w-3.5" />
                      <span className="truncate">
                        {previewHost}/preview/{previewTemplate.code}
                      </span>
                    </div>
                  </div>

                  <div className="min-h-0 flex-1 overflow-hidden bg-background">
                    {PreviewTemplateComponent ? (
                      <TemplatePreviewFrame
                        title={`Template ${previewTemplate.code}`}
                        className="h-full w-full"
                        resetKey={`dialog-${previewTemplate.id}`}
                      >
                        <div className="min-h-full [&_.fixed]:!absolute">
                          <PreviewTemplateComponent
                            content={
                              previewTemplate.id === editorState.template.id
                                ? draftContent
                                : undefined
                            }
                          />
                        </div>
                      </TemplatePreviewFrame>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
