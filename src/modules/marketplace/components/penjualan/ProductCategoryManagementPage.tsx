/** @format */

"use client";

import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInventoryCategories } from "@/hooks/queries/inventory";
import { QK } from "@/hooks/queries/queryKeys";
import { ConfirmActionDialog } from "@/modules/marketplace/components/shared/ConfirmActionDialog";
import { ensureSuccess } from "@/lib/api";
import {
  createInventoryCategory,
  deleteInventoryCategory,
  updateInventoryCategory,
} from "@/services/api";

type CategoryItem = {
  id: number;
  name: string;
  count: number;
};

export function ProductCategoryManagementPage() {
  const qc = useQueryClient();
  const { data, isLoading, isError } = useInventoryCategories();
  const [searchValue, setSearchValue] = useState("");
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [renameTarget, setRenameTarget] = useState<CategoryItem | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<CategoryItem | null>(null);

  const categories = useMemo(() => {
    const items = (data ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      count: item.count,
    }));
    if (!searchValue.trim()) return items;
    const keyword = searchValue.toLowerCase();
    return items.filter((item) => item.name.toLowerCase().includes(keyword));
  }, [data, searchValue]);

  const invalidateLists = () => {
    qc.invalidateQueries({ queryKey: QK.inventory.categories() });
    qc.invalidateQueries({ queryKey: QK.inventory.lists() });
  };

  const createMutation = useMutation({
    mutationFn: async (vars: { name: string }) =>
      ensureSuccess(await createInventoryCategory({ name: vars.name })),
    onSuccess: () => {
      invalidateLists();
      toast.success("Kategori berhasil ditambahkan.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menambahkan kategori.");
    },
  });

  const renameMutation = useMutation({
    mutationFn: async (vars: { id: number; name: string }) =>
      ensureSuccess(await updateInventoryCategory(vars.id, { name: vars.name })),
    onSuccess: (_data, vars) => {
      invalidateLists();
      toast.success(`Kategori diperbarui menjadi "${vars.name}".`);
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal memperbarui kategori.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (vars: { id: number }) =>
      ensureSuccess(await deleteInventoryCategory(vars.id)),
    onSuccess: () => {
      invalidateLists();
      toast.success("Kategori berhasil dihapus.");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menghapus kategori.");
    },
  });

  const handleOpenRename = (item: CategoryItem) => {
    setRenameTarget(item);
    setRenameValue(item.name);
  };

  const handleConfirmRename = async () => {
    if (!renameTarget) return;
    const nextName = renameValue.trim();
    if (!nextName) {
      toast.error("Nama kategori baru wajib diisi.");
      return;
    }
    if (nextName === renameTarget.name) {
      setRenameTarget(null);
      return;
    }
    await renameMutation.mutateAsync({ id: renameTarget.id, name: nextName });
    setRenameTarget(null);
  };

  const handleConfirmClear = async () => {
    if (!deleteTarget) return;
    await deleteMutation.mutateAsync({ id: deleteTarget.id });
    setDeleteTarget(null);
  };

  const handleCreateCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) {
      toast.error("Nama kategori wajib diisi.");
      return;
    }
    await createMutation.mutateAsync({ name });
    setNewCategoryName("");
    setNewCategoryOpen(false);
  };

  const busy =
    renameMutation.isPending || deleteMutation.isPending || createMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manajemen Kategori Produk
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola kategori produk berdasarkan data inventaris yang ada.
          </p>
        </div>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:max-w-sm">
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Cari kategori
            </label>
            <Input
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="Cari nama kategori..."
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
            />
          </div>
          <Button
            type="button"
            onClick={() => setNewCategoryOpen(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm"
          >
            Tambah Kategori
          </Button>
        </div>

        <div className="overflow-x-auto">
          <Table className="w-full text-left">
            <TableHeader className="bg-gray-50 dark:bg-gray-800/50">
              <TableRow>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                  Nama Kategori
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-40">
                  Jumlah Produk
                </TableHead>
                <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right">
                  Aksi
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Memuat kategori...
                  </TableCell>
                </TableRow>
              ) : null}
              {isError ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-10 text-center text-sm text-red-500"
                  >
                    Gagal memuat kategori.
                  </TableCell>
                </TableRow>
              ) : null}
              {!isLoading && !isError && categories.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={3}
                    className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                  >
                    Belum ada kategori yang tersedia.
                  </TableCell>
                </TableRow>
              ) : null}
              {!isLoading &&
                !isError &&
                categories.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                      {item.name}
                    </TableCell>
                    <TableCell className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      {item.count} produk
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenRename(item)}
                        disabled={busy}
                        className="text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Ubah
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteTarget(item)}
                        disabled={busy}
                        className="text-red-500 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={Boolean(renameTarget)}
        onOpenChange={() => setRenameTarget(null)}
      >
        <DialogContent className="max-w-md">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Ubah Nama Kategori
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama kategori baru
            </label>
            <Input
              value={renameValue}
              onChange={(event) => setRenameValue(event.target.value)}
              placeholder="Masukkan nama kategori baru"
              className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Perubahan akan diterapkan ke seluruh produk pada kategori
              tersebut.
            </p>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRenameTarget(null)}
              className="px-4 py-2 text-sm"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleConfirmRename}
              disabled={busy}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm"
            >
              {renameMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={newCategoryOpen} onOpenChange={setNewCategoryOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Tambah Kategori Baru
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama kategori
            </label>
            <Input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              placeholder="Masukkan nama kategori"
              className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewCategoryOpen(false)}
              className="px-4 py-2 text-sm"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleCreateCategory}
              disabled={busy}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm"
            >
              {createMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
        title="Hapus Kategori?"
        description={
          deleteTarget ? (
            <>
              Semua produk dengan kategori{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {deleteTarget.name}
              </span>{" "}
              akan dihapus kategorinya. Tindakan ini tidak dapat dibatalkan.
            </>
          ) : null
        }
        confirmLabel="Hapus Kategori"
        onConfirm={handleConfirmClear}
        tone="destructive"
      />
    </div>
  );
}
