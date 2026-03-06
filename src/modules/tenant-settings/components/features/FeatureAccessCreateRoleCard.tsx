/** @format */

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { settingsSurfaceClassName } from "../../lib/settings";

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
        <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
          Tambah Role Baru
        </h2>
        <div className="flex flex-col items-end gap-4 md:flex-row">
          <div className="w-full flex-1 space-y-2">
            <Label htmlFor="new-role-name">Nama Role Baru</Label>
            <Input
              id="new-role-name"
              value={name}
              placeholder="Contoh: Auditor Internal"
              className="border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
              disabled={disabled}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </div>
          <div className="w-full flex-1 space-y-2 md:flex-[2]">
            <Label htmlFor="new-role-description">Deskripsi</Label>
            <Input
              id="new-role-description"
              value={description}
              placeholder="Tugas dan cakupan akses secara singkat..."
              className="border-gray-300 focus-visible:border-indigo-600 focus-visible:ring-indigo-600/30 dark:border-gray-700"
              disabled={disabled}
              onChange={(event) => onDescriptionChange(event.target.value)}
            />
          </div>
          <Button
            type="button"
            className="whitespace-nowrap bg-indigo-600 text-white hover:bg-indigo-500 focus-visible:ring-indigo-600"
            disabled={disabled || !name.trim() || saving}
            onClick={onCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            {saving ? "Menambah..." : "Tambah Role"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

