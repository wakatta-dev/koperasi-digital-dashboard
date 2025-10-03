/** @format */

"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/hooks/queries/roles";
import { useUserRoles, useUserActions } from "@/hooks/queries/users";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useConfirm } from "@/hooks/use-confirm";

type Props = { userId: number; trigger: React.ReactNode };

export function UserRolesDialog({ userId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { data: roles = [] } = useRoles({ limit: 200 });
  const { data: userRoles = [] } = useUserRoles(userId);
  const { assign, removeRole } = useUserActions();
  const [roleId, setRoleId] = useState<string>("");
  const confirm = useConfirm();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>Manage Roles</SheetTitle>
          <SheetDescription>Tambah atau hapus role pada user ini.</SheetDescription>
        </SheetHeader>

        <div className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <Select value={roleId} onValueChange={setRoleId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Pilih role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r: any) => (
                  <SelectItem key={r.id} value={String(r.id)}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="button" onClick={async () => { if (!roleId) return; const ok = await confirm({ variant: "create", title: "Tambah role ke user?", description: `Role ${roles.find((r: any) => String(r.id) === roleId)?.name ?? roleId} akan diberikan.`, confirmText: "Tambah" }); if (!ok) return; await assign.mutateAsync({ userId, roleId }); setRoleId(""); }}>Tambah</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(userRoles ?? []).map((ur: any) => (
              <Badge key={ur.id} variant="outline" className="flex items-center gap-2">
                <span>{ur.role?.name ?? ur.name ?? ur.id}</span>
                <button className="text-red-600 text-xs" onClick={async () => {
                  const ok = await confirm({ variant: "delete", title: "Hapus role dari user?", description: `${ur.role?.name ?? ur.name ?? ur.id} akan dicabut.`, confirmText: "Hapus" });
                  if (!ok) return;
                  await removeRole.mutateAsync({ userId, roleId: ur.id });
                }}>hapus</button>
              </Badge>
            ))}
            {!userRoles?.length && (
              <div className="text-xs text-muted-foreground italic">Belum ada role</div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
