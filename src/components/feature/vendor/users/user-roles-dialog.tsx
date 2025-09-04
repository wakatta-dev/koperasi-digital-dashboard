/** @format */

"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRoles } from "@/hooks/queries/roles";
import { useUserRoles, useUserActions } from "@/hooks/queries/users";
import { Badge } from "@/components/ui/badge";

type Props = { userId: number; trigger: React.ReactNode };

export function UserRolesDialog({ userId, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const { data: roles = [] } = useRoles({ limit: 200 });
  const { data: userRoles = [] } = useUserRoles(userId);
  const { assign, removeRole } = useUserActions();
  const [roleId, setRoleId] = useState<string>("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Roles</DialogTitle>
          <DialogDescription>Tambah atau hapus role pada user ini.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <select className="border rounded px-2 py-1 flex-1" value={roleId} onChange={(e) => setRoleId(e.target.value)}>
              <option value="">Pilih role</option>
              {roles.map((r: any) => (
                <option key={r.id} value={String(r.id)}>{r.name}</option>
              ))}
            </select>
            <Button type="button" onClick={async () => { if (!roleId) return; await assign.mutateAsync({ userId, roleId }); setRoleId(""); }}>Tambah</Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(userRoles ?? []).map((ur: any) => (
              <Badge key={ur.id} variant="outline" className="flex items-center gap-2">
                <span>{ur.role?.name ?? ur.name ?? ur.id}</span>
                <button className="text-red-600 text-xs" onClick={() => removeRole.mutate({ userId, roleId: ur.id })}>hapus</button>
              </Badge>
            ))}
            {!userRoles?.length && (
              <div className="text-xs text-muted-foreground italic">Belum ada role</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

