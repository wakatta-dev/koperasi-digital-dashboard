/** @format */

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EmailTemplateFormState } from "../../types/forms";
import { settingsSurfaceClassName } from "../../lib/settings";

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
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Editor Template</h2>
        <div className="space-y-2">
          <Label>Subject Email</Label>
          <Input
            value={form.subject}
            disabled={disabled}
            className="border-gray-300 font-medium focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
            onChange={(event) => onChange({ ...form, subject: event.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Body Email</Label>
          <Textarea
            value={form.body}
            disabled={disabled}
            rows={10}
            placeholder="Tulis konten email di sini..."
            className="h-48 border-gray-300 font-mono text-sm focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
            onChange={(event) => onChange({ ...form, body: event.target.value })}
          />
        </div>
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
          <p className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            Placeholder Tersedia:
          </p>
          <div className="flex flex-wrap gap-2">
            {placeholders.map((placeholder) => (
              <Badge
                key={placeholder}
                className="border-transparent bg-gray-100 font-mono text-[11px] text-gray-800 dark:bg-gray-800 dark:text-gray-300"
              >
                {`{{${placeholder}}}`}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button
            type="button"
            className="bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-600"
            disabled={disabled || !dirty || saving}
            onClick={onSave}
          >
            {saving ? "Menyimpan..." : "Simpan Template"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

