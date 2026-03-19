/** @format */

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SettingsStickyActionBar } from "../shared/SettingsStickyActionBar";
import type { EmailTemplateFormState } from "../../types/forms";
import {
  settingsFieldClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";

type FeatureEmailTemplateEditorCardProps = {
  form: EmailTemplateFormState;
  placeholders: string[];
  disabled: boolean;
  dirty: boolean;
  saving: boolean;
  onChange: (next: EmailTemplateFormState) => void;
  onSave: () => void;
};

export function FeatureEmailTemplateEditorCard({
  form,
  placeholders,
  disabled,
  dirty,
  saving,
  onChange,
  onSave,
}: FeatureEmailTemplateEditorCardProps) {
  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-1">
          <h2 className={settingsSectionTitleClassName}>Editor Template</h2>
          <p className={settingsMutedTextClassName}>
            Perbarui subject dan body template aktif dengan placeholder yang konsisten.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-template-subject">Subject Email</Label>
          <Input
            id="email-template-subject"
            name="email_template_subject"
            autoComplete="off"
            value={form.subject}
            disabled={disabled}
            className={`${settingsFieldClassName} font-medium`}
            onChange={(event) => onChange({ ...form, subject: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email-template-body">Body Email</Label>
          <Textarea
            id="email-template-body"
            name="email_template_body"
            autoComplete="off"
            value={form.body}
            disabled={disabled}
            rows={10}
            placeholder="Tulis konten email di sini…"
            className={`h-56 ${settingsFieldClassName} font-mono text-sm`}
            onChange={(event) => onChange({ ...form, body: event.target.value })}
          />
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 dark:border-slate-800 dark:bg-slate-900/60">
          <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
            Placeholder Tersedia:
          </p>
          <div className="flex flex-wrap gap-2">
            {placeholders.map((placeholder) => (
              <Badge
                key={placeholder}
                className="border-transparent bg-white font-mono text-[11px] text-slate-700 dark:bg-slate-950 dark:text-slate-300"
              >
                {`{{${placeholder}}}`}
              </Badge>
            ))}
          </div>
        </div>
        <SettingsStickyActionBar
          onSave={onSave}
          saveLabel="Simpan Template"
          dirty={dirty}
          saveDisabled={disabled || !dirty || saving}
          saving={saving}
        />
      </CardContent>
    </Card>
  );
}
