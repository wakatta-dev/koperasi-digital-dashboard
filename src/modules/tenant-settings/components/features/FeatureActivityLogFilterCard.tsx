/** @format */

import { RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { settingsSurfaceClassName } from "../../lib/settings";

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
  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <CardContent className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Aktivitas</h2>
          <Button type="button" variant="ghost" size="sm" className="h-8 px-3 text-xs" onClick={onReset}>
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset Filter
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          <div className="space-y-2">
            <Label>Module</Label>
            <Select value={module} disabled={disabled} onValueChange={onModuleChange}>
              <SelectTrigger className="border-gray-300 dark:border-gray-700">
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
            <Label>Action</Label>
            <Select value={action} disabled={disabled} onValueChange={onActionChange}>
              <SelectTrigger className="border-gray-300 dark:border-gray-700">
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
              value={actorId}
              placeholder="Contoh: user:12"
              className="border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
              disabled={disabled}
              onChange={(event) => onActorIdChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Dari Tanggal</Label>
            <Input
              type="date"
              value={fromDate}
              className="border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
              disabled={disabled}
              onChange={(event) => onFromDateChange(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Sampai Tanggal</Label>
            <Input
              type="date"
              value={toDate}
              className="border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
              disabled={disabled}
              onChange={(event) => onToDateChange(event.target.value)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

