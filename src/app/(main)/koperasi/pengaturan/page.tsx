/** @format */

"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function PengaturanPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [audit, setAudit] = useState<any[]>([]);
  const [newRole, setNewRole] = useState<string>("");
  const [assign, setAssign] = useState<{user?: string; role?: string}>({});

  // TODO integrate API: fetch roles, permissions, audit logs
  useEffect(() => {
    setRoles([{name:'admin'},{name:'manager'},{name:'teller'}]);
    setAudit([]);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Pengaturan</h2>
        <p className="text-muted-foreground">Role, permission, dan audit log</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Role</CardTitle>
            <CardDescription>Kelola peran pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input placeholder="Nama role" value={newRole} onChange={(e) => setNewRole(e.target.value)} />
                <Button onClick={() => setNewRole("")}>Tambah</Button>
              </div>
              <ul className="text-sm space-y-1">
                {roles.map((r) => (
                  <li key={r.name} className="flex items-center justify-between p-2 border rounded">
                    <span>{r.name}</span>
                    <Button variant="outline" size="sm">Hapus</Button>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permission</CardTitle>
            <CardDescription>Atur akses berdasarkan role</CardDescription>
          </CardHeader>
          <CardContent>
            {/* TODO integrate API: list permissions & mapping */}
            <div className="text-sm text-muted-foreground italic">Pengaturan permission akan ditampilkan di sini.</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assign Role</CardTitle>
            <CardDescription>Set peran untuk pengguna</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <Input placeholder="User ID/Email" value={assign.user || ''} onChange={(e) => setAssign((s) => ({...s, user: e.target.value}))} />
              <Select onValueChange={(v) => setAssign((s) => ({...s, role: v}))}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((r) => (
                    <SelectItem key={r.name} value={r.name}>{r.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button disabled={!assign.user || !assign.role}>Simpan</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Audit Log</CardTitle>
          <CardDescription>Aktivitas penting pada sistem</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {audit.map((a, i) => (
              <div key={i} className="text-sm p-2 border rounded">{a.message}</div>
            ))}
            {!audit.length && (
              <div className="text-sm text-muted-foreground italic">Belum ada audit log</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

