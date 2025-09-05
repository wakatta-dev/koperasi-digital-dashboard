/** @format */
"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Row = {
  id: number | string;
  name: string;
  type?: string;
  domain?: string;
  is_active?: boolean;
};

export function ClientsListClient({ rows }: { rows: Row[] }) {
  const [selected, setSelected] = useState<Row | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((t) => (
            <TableRow key={String(t.id)}>
              <TableCell>{t.name}</TableCell>
              <TableCell className="capitalize">{t.type}</TableCell>
              <TableCell>{t.domain}</TableCell>
              <TableCell>
                <Badge variant={t.is_active ? "default" : "secondary"}>
                  {t.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelected(t)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Client Detail</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div>
                  <div className="text-muted-foreground">Name</div>
                  <div className="font-medium">{selected.name}</div>
                </div>
                <div>
                  <div className="text-muted-foreground">Type</div>
                  <div className="font-medium capitalize">
                    {selected.type ?? "-"}
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="text-muted-foreground">Domain</div>
                  <div className="font-medium">{selected.domain ?? "-"}</div>
                </div>
              </div>
              <div>
                <Badge variant={selected.is_active ? "default" : "secondary"}>
                  {selected.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
              {/* TODO integrate API: load users, modules, and allow status updates */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
