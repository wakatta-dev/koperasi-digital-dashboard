/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SupportEmailTemplate } from "@/types/api";
import { settingsSurfaceClassName } from "../../lib/settings";

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
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">Pilih Template</h2>
        <div className="w-full md:w-1/2">
          <Label>Template Aktif</Label>
          <Select value={selectedTemplateId} disabled={disabled} onValueChange={onSelect}>
            <SelectTrigger className="border-gray-300 dark:border-gray-700">
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
      </CardContent>
    </Card>
  );
}

