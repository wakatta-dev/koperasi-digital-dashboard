/** @format */

import { RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  settingsFieldClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";

type FeatureActivityLogFilterCardProps = {
  module: string;
  action: string;
  actorId: string;
  fromDate: string;
  toDate: string;
  disabled: boolean;
  onModuleChange: (value: string) => void;
  onActionChange: (value: string) => void;
  onActorIdChange: (value: string) => void;
  onFromDateChange: (value: string) => void;
  onToDateChange: (value: string) => void;
  onReset: () => void;
};

const moduleOptions = [
  { value: "all", label: "Semua Module" },
  { value: "tenant", label: "tenant" },
  { value: "operasional", label: "operasional" },
  { value: "access", label: "access" },
];

const actionOptions = [
  { value: "all", label: "Semua Action" },
  { value: "update_tenant_config", label: "update_tenant_config" },
  { value: "login", label: "login" },
  { value: "create_user", label: "create_user" },
];

export function FeatureActivityLogFilterCard({
  module,
  action,
  actorId,
  fromDate,
  toDate,
  disabled,
  onModuleChange,
  onActionChange,
  onActorIdChange,
  onFromDateChange,
  onToDateChange,
  onReset,
}: FeatureActivityLogFilterCardProps) {
  const activeFilters = [
    module !== "all" ? `Modul: ${module}` : null,
    action !== "all" ? `Action: ${action}` : null,
    actorId ? `Aktor: ${actorId}` : null,
    fromDate ? `Dari: ${fromDate}` : null,
    toDate ? `Sampai: ${toDate}` : null,
  ].filter(Boolean) as string[];

  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <CardContent className="p-6">
        <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <h2 className={settingsSectionTitleClassName}>Filter Aktivitas</h2>
            <p className={settingsMutedTextClassName}>
              Persempit audit trail berdasarkan modul, aksi, aktor, atau rentang tanggal.
            </p>
          </div>
          <Button type="button" variant="ghost" size="sm" className="h-9 px-3 text-xs" onClick={onReset}>
            <RotateCcw aria-hidden="true" className="mr-1 h-4 w-4" />
            Reset Filter
          </Button>
        </div>

        {activeFilters.length ? (
          <div className="mb-5 flex flex-wrap gap-2">
            {activeFilters.map((item, index) => (
              <Badge
                key={`${item}-${index}`}
                className="border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                {item}
              </Badge>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="space-y-2">
            <Label htmlFor="activity-log-module">Module</Label>
            <Select value={module} disabled={disabled} onValueChange={onModuleChange}>
              <SelectTrigger id="activity-log-module" className="border-slate-300 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {moduleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activity-log-action">Action</Label>
            <Select value={action} disabled={disabled} onValueChange={onActionChange}>
              <SelectTrigger id="activity-log-action" className="border-slate-300 dark:border-slate-700">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {actionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Actor ID</Label>
            <Input
              name="activity_actor_id"
              autoComplete="off"
              value={actorId}
              placeholder="Contoh: user:12"
              className={settingsFieldClassName}
              disabled={disabled}
              onChange={(event) => onActorIdChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Dari Tanggal</Label>
            <Input
              type="date"
              name="activity_from_date"
              value={fromDate}
              className={settingsFieldClassName}
              disabled={disabled}
              onChange={(event) => onFromDateChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Sampai Tanggal</Label>
            <Input
              type="date"
              name="activity_to_date"
              value={toDate}
              className={settingsFieldClassName}
              disabled={disabled}
              onChange={(event) => onToDateChange(event.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
