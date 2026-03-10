/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SupportEmailTemplate } from "@/types/api";
import {
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";

type FeatureEmailTemplateSelectorCardProps = {
  templates: SupportEmailTemplate[];
  selectedTemplateId: string;
  disabled: boolean;
  onSelect: (value: string) => void;
};

export function FeatureEmailTemplateSelectorCard({
  templates,
  selectedTemplateId,
  disabled,
  onSelect,
}: FeatureEmailTemplateSelectorCardProps) {
  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <CardContent className="p-6">
        <div className="mb-4 space-y-1">
          <h2 className={settingsSectionTitleClassName}>Pilih Template</h2>
          <p className={settingsMutedTextClassName}>
            Tentukan template aktif yang ingin ditinjau, diubah, dan diuji.
          </p>
        </div>
        <div className="w-full md:w-1/2">
          <Label htmlFor="active-template">Template Aktif</Label>
          <Select value={selectedTemplateId} disabled={disabled} onValueChange={onSelect}>
            <SelectTrigger id="active-template" className="border-slate-300 dark:border-slate-700">
              <SelectValue placeholder="Pilih template email" />
            </SelectTrigger>
            <SelectContent>
              {templates.map((template, index) => (
                <SelectItem key={`${template.id}-${index}`} value={String(template.id)}>
                  {template.name} ({template.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
