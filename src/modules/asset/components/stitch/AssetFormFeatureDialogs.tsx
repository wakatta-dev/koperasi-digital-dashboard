/** @format */

"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

import { AssetCreateFormFeature } from "./AssetCreateFormFeature";
import { AssetEditFormFeature } from "./AssetEditFormFeature";

export function AssetFormFeatureDialogs() {
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button className="bg-indigo-600 text-white hover:bg-indigo-700" onClick={() => setCreateOpen(true)}>
          Simpan Aset
        </Button>
        <Button variant="outline" className="border-slate-300" onClick={() => setEditOpen(true)}>
          Simpan Perubahan
        </Button>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 bg-slate-50 sm:max-w-4xl">
          <DialogTitle>Tambah Aset</DialogTitle>
          <AssetCreateFormFeature onCancel={() => setCreateOpen(false)} onSubmit={() => setCreateOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-200 bg-slate-50 sm:max-w-4xl">
          <DialogTitle>Edit Aset</DialogTitle>
          <AssetEditFormFeature onCancel={() => setEditOpen(false)} onSubmit={() => setEditOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
