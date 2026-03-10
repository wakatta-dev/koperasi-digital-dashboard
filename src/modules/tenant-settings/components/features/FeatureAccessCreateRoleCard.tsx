/** @format */

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  settingsFieldClassName,
  settingsMutedTextClassName,
  settingsSectionTitleClassName,
  settingsSurfaceClassName,
} from "../../lib/settings";

type FeatureAccessCreateRoleCardProps = {
  name: string;
  description: string;
  disabled: boolean;
  saving: boolean;
  onNameChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onCreate: () => void;
};

export function FeatureAccessCreateRoleCard({
  name,
  description,
  disabled,
  saving,
  onNameChange,
  onDescriptionChange,
  onCreate,
}: FeatureAccessCreateRoleCardProps) {
  return (
    <Card className={`${settingsSurfaceClassName} overflow-hidden`}>
      <CardContent className="p-6">
        <div className="mb-4 space-y-1">
          <h2 className={settingsSectionTitleClassName}>Tambah Role Baru</h2>
          <p className={settingsMutedTextClassName}>
            Buat role kustom untuk mengelompokkan akses operasional dengan lebih presisi.
          </p>
        </div>
        <div className="flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full flex-1 space-y-2">
            <Label htmlFor="new-role-name">Nama Role Baru</Label>
            <Input
              id="new-role-name"
              name="new_role_name"
              autoComplete="off"
              value={name}
              placeholder="Contoh: Auditor Internal"
              className={settingsFieldClassName}
              disabled={disabled}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </div>
          <div className="w-full flex-1 space-y-2 md:flex-[2]">
            <Label htmlFor="new-role-description">Deskripsi</Label>
            <Input
              id="new-role-description"
              name="new_role_description"
              autoComplete="off"
              value={description}
              placeholder="Tugas dan cakupan akses secara singkat…"
              className={settingsFieldClassName}
              disabled={disabled}
              onChange={(event) => onDescriptionChange(event.target.value)}
            />
          </div>
          <Button
            type="button"
            className="whitespace-nowrap bg-slate-950 text-white hover:bg-slate-800 focus-visible:ring-slate-900 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 dark:focus-visible:ring-slate-100"
            disabled={disabled || !name.trim() || saving}
            onClick={onCreate}
          >
            <Plus aria-hidden="true" className="mr-2 h-4 w-4" />
            {saving ? "Menambah…" : "Tambah Role"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
