/** @format */

"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QK } from "@/hooks/queries/queryKeys";
import { showToastError, showToastSuccess } from "@/lib/toast";
import {
  createAssetMasterData,
  deleteAssetMasterData,
  updateAssetMasterData,
} from "@/services/api/assets";
import type {
  AssetMasterDataItem,
  AssetMasterDataKind,
} from "@/types/api/asset-rental";

import { AssetRentalFeatureDemoShell } from "./stitch/AssetRentalFeatureDemoShell";
import { useAssetMasterData } from "../hooks/use-asset-master-data";

type SectionConfig = {
  kind: AssetMasterDataKind;
  title: string;
  description: string;
};

const sections: SectionConfig[] = [
  {
    kind: "CATEGORY",
    title: "Kategori Aset",
    description: "Daftar kategori untuk form tambah/edit aset.",
  },
  {
    kind: "LOCATION",
    title: "Lokasi Aset",
    description: "Daftar lokasi utama penyimpanan atau penggunaan aset.",
  },
  {
    kind: "STATUS",
    title: "Status Aset",
    description: "Daftar status operasional aset (mis. Tersedia, Dipinjam).",
  },
];

function normalizeItems(items: AssetMasterDataItem[]) {
  return items
    .slice()
    .sort(
      (a, b) => a.sort_order - b.sort_order || a.value.localeCompare(b.value)
    );
}

export function AssetMasterDataPage() {
  const queryClient = useQueryClient();
  const masterDataQuery = useAssetMasterData();

  const [newValues, setNewValues] = useState<Record<AssetMasterDataKind, string>>({
    CATEGORY: "",
    LOCATION: "",
    STATUS: "",
  });
  const [editing, setEditing] = useState<AssetMasterDataItem | null>(null);
  const [editValue, setEditValue] = useState("");

  const dataByKind = useMemo(() => {
    const data = masterDataQuery.data;
    return {
      CATEGORY: normalizeItems(data?.categories ?? []),
      LOCATION: normalizeItems(data?.locations ?? []),
      STATUS: normalizeItems(data?.statuses ?? []),
    } satisfies Record<AssetMasterDataKind, AssetMasterDataItem[]>;
  }, [masterDataQuery.data]);

  const invalidateMasterData = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: QK.assetRental.masterData() }),
      queryClient.invalidateQueries({ queryKey: ["asset-rental", "assets"] }),
    ]);
  };

  const createMutation = useMutation({
    mutationFn: async (args: { kind: AssetMasterDataKind; value: string }) => {
      const response = await createAssetMasterData({
        kind: args.kind,
        value: args.value,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal menambah master data");
      }
      return response.data;
    },
    onSuccess: async () => {
      await invalidateMasterData();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (args: { id: number; value: string }) => {
      const response = await updateAssetMasterData(args.id, {
        value: args.value,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || "Gagal memperbarui master data");
      }
      return response.data;
    },
    onSuccess: async () => {
      await invalidateMasterData();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await deleteAssetMasterData(id);
      if (!response.success) {
        throw new Error(response.message || "Gagal menghapus master data");
      }
      return true;
    },
    onSuccess: async () => {
      await invalidateMasterData();
    },
  });

  const isBusy =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  const handleCreate = async (kind: AssetMasterDataKind) => {
    const value = (newValues[kind] ?? "").trim();
    if (!value) {
      showToastError("Input belum lengkap", "Nilai master data wajib diisi.");
      return;
    }

    try {
      await createMutation.mutateAsync({ kind, value });
      setNewValues((prev) => ({ ...prev, [kind]: "" }));
      showToastSuccess("Berhasil", "Master data berhasil ditambahkan.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menambah master data";
      showToastError("Gagal menyimpan", message);
    }
  };

  const handleUpdate = async () => {
    if (!editing) return;

    const value = editValue.trim();
    if (!value) {
      showToastError("Input belum lengkap", "Nilai master data wajib diisi.");
      return;
    }

    try {
      await updateMutation.mutateAsync({ id: editing.id, value });
      setEditing(null);
      setEditValue("");
      showToastSuccess("Berhasil", "Master data berhasil diperbarui.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal memperbarui master data";
      showToastError("Gagal memperbarui", message);
    }
  };

  const handleDelete = async (item: AssetMasterDataItem) => {
    try {
      await deleteMutation.mutateAsync(item.id);
      showToastSuccess("Berhasil", "Master data berhasil dihapus.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Gagal menghapus master data";
      showToastError("Gagal menghapus", message);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 text-foreground">
      <AssetRentalFeatureDemoShell
        title="Master Data Asset & Rental"
        description="Kelola data referensi kategori, lokasi, dan status agar form aset konsisten dengan database."
        activeItem="Master Data"
      >
        {masterDataQuery.isLoading ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
            Memuat master data aset...
          </div>
        ) : null}

        {masterDataQuery.isError ? (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
            {(masterDataQuery.error as Error).message}
          </div>
        ) : null}

        {!masterDataQuery.isLoading && !masterDataQuery.isError ? (
          <div className="space-y-4">
            {sections.map((section) => {
              const items = dataByKind[section.kind];
              return (
                <section
                  key={section.kind}
                  className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">{section.title}</h4>
                    <p className="text-sm text-slate-500">{section.description}</p>
                  </div>

                  <div className="flex gap-2">
                    <Input
                      placeholder="Tambah nilai baru"
                      value={newValues[section.kind]}
                      onChange={(event) =>
                        setNewValues((prev) => ({
                          ...prev,
                          [section.kind]: event.target.value,
                        }))
                      }
                      disabled={isBusy}
                    />
                    <Button
                      type="button"
                      className="bg-indigo-600 text-white hover:bg-indigo-700"
                      disabled={isBusy}
                      onClick={() => handleCreate(section.kind)}
                    >
                      Tambah
                    </Button>
                  </div>

                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <Table>
                      <TableHeader className="bg-slate-50">
                        <TableRow>
                          <TableHead className="px-4">Nilai</TableHead>
                          <TableHead className="px-4">Status</TableHead>
                          <TableHead className="px-4">Urutan</TableHead>
                          <TableHead className="px-4 text-right">Aksi</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {items.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={4}
                              className="px-4 py-6 text-center text-sm text-slate-500"
                            >
                              Belum ada data.
                            </TableCell>
                          </TableRow>
                        ) : null}
                        {items.map((item) => {
                          const isEditing = editing?.id === item.id;
                          return (
                            <TableRow key={item.id} className="bg-white">
                              <TableCell className="px-4">
                                {isEditing ? (
                                  <Input
                                    value={editValue}
                                    onChange={(event) => setEditValue(event.target.value)}
                                    disabled={isBusy}
                                  />
                                ) : (
                                  <span className="text-sm text-slate-900">{item.value}</span>
                                )}
                              </TableCell>
                              <TableCell className="px-4 text-sm text-slate-600">
                                {item.is_active ? "Aktif" : "Nonaktif"}
                              </TableCell>
                              <TableCell className="px-4 text-sm text-slate-600">
                                {item.sort_order}
                              </TableCell>
                              <TableCell className="px-4 text-right">
                                {isEditing ? (
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        setEditing(null);
                                        setEditValue("");
                                      }}
                                      disabled={isBusy}
                                    >
                                      Batal
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      className="bg-indigo-600 text-white hover:bg-indigo-700"
                                      onClick={handleUpdate}
                                      disabled={isBusy}
                                    >
                                      Simpan
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                                      onClick={() => {
                                        setEditing(item);
                                        setEditValue(item.value);
                                      }}
                                      disabled={isBusy}
                                    >
                                      <Edit3 className="mr-1.5 h-3.5 w-3.5" />
                                      Ubah
                                    </Button>
                                    <Button
                                      type="button"
                                      size="sm"
                                      variant="outline"
                                      className="border-red-200 text-red-600 hover:bg-red-50"
                                      onClick={() => handleDelete(item)}
                                      disabled={isBusy}
                                    >
                                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                                      Hapus
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </section>
              );
            })}
          </div>
        ) : null}
      </AssetRentalFeatureDemoShell>
    </div>
  );
}
