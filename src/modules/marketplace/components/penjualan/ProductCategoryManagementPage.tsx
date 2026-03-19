/** @format */

"use client";

import { useMemo, useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableShell } from "@/components/shared/data-display/TableShell";
import {
  useInventoryActions,
  useInventoryCategories,
} from "@/hooks/queries/inventory";
import type { InventoryCategoryResponse } from "@/types/api/inventory";

export type CategoryRow = {
  id: string;
  name: string;
  count: number;
  isActive: boolean;
};

type ProductCategoryManagementPageProps = {
  categories?: CategoryRow[];
  isLoading?: boolean;
  isError?: boolean;
  onToggleActive?: (row: CategoryRow) => void;
  onCreateCategory?: (payload: { name: string }) => Promise<void> | void;
};

function toCategoryRow(category: InventoryCategoryResponse): CategoryRow {
  return {
    id: String(category.id),
    name: category.name,
    count: category.count,
    isActive: category.is_active,
  };
}

export function ProductCategoryManagementPage({
  categories,
  isLoading,
  isError,
  onToggleActive,
  onCreateCategory,
}: ProductCategoryManagementPageProps) {
  const { data, isLoading: queryLoading, isError: queryError } =
    useInventoryCategories();
  const actions = useInventoryActions();
  const [searchValue, setSearchValue] = useState("");
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryError, setNewCategoryError] = useState("");

  const resolvedCategories = useMemo(
    () => categories ?? (data ?? []).map(toCategoryRow),
    [categories, data]
  );
  const resolvedLoading = categories !== undefined ? (isLoading ?? false) : (isLoading ?? queryLoading);
  const resolvedError = categories !== undefined ? (isError ?? false) : (isError ?? queryError);
  const isCreatingCategory = !onCreateCategory && actions.createCategory.isPending;
  const isUpdatingCategory = !onToggleActive && actions.updateCategory.isPending;

  const filteredCategories = useMemo(() => {
    const normalized = searchValue.trim().toLowerCase();
    if (!normalized) return resolvedCategories;
    return resolvedCategories.filter((item) =>
      item.name.toLowerCase().includes(normalized),
    );
  }, [resolvedCategories, searchValue]);

  const handleCreateCategory = async () => {
    const normalizedName = newCategoryName.trim();
    if (!normalizedName) {
      setNewCategoryError("Nama kategori wajib diisi.");
      return;
    }

    setNewCategoryError("");
    if (onCreateCategory) {
      await onCreateCategory({ name: normalizedName });
    } else {
      await actions.createCategory.mutateAsync({ name: normalizedName });
    }

    setNewCategoryName("");
    setNewCategoryOpen(false);
  };

  const handleToggleActive = async (row: CategoryRow) => {
    if (onToggleActive) {
      onToggleActive(row);
      return;
    }

    await actions.updateCategory.mutateAsync({
      id: row.id,
      payload: {
        name: row.name,
        is_active: !row.isActive,
      },
    });
  };

  const columns: ColumnDef<CategoryRow, unknown>[] = [
    {
      id: "name",
      header: "Nama Kategori",
      meta: {
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase",
        cellClassName:
          "px-6 py-4 text-sm font-medium text-gray-900 dark:text-white",
      },
      cell: ({ row }) => row.original.name,
    },
    {
      id: "count",
      header: "Jumlah Produk",
      meta: {
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-40",
        cellClassName: "px-6 py-4 text-sm text-gray-600 dark:text-gray-300",
      },
      cell: ({ row }) => `${row.original.count} produk`,
    },
    {
      id: "status",
      header: "Status",
      meta: {
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-40",
        cellClassName: "px-6 py-4 text-sm",
      },
      cell: ({ row }) => (
        <Badge
          variant={row.original.isActive ? "default" : "secondary"}
          className={
            row.original.isActive
              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300"
          }
        >
          {row.original.isActive ? "Aktif" : "Nonaktif"}
        </Badge>
      ),
    },
    {
      id: "actions",
      header: "Aksi",
      meta: {
        align: "right",
        headerClassName:
          "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase text-right",
        cellClassName: "px-6 py-4 text-right space-x-2",
      },
      cell: ({ row }) => (
        <>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void handleToggleActive(row.original)}
            disabled={isUpdatingCategory}
          >
            {row.original.isActive ? "Nonaktifkan" : "Aktifkan"}
          </Button>
        </>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Manajemen Kategori Produk
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola kategori produk berdasarkan data inventaris yang ada.
          </p>
        </div>
      </div>

      <div className="surface-card p-6 space-y-4">
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
            disabled={isCreatingCategory}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm"
          >
            Tambah Kategori
          </Button>
        </div>

        <div className="overflow-x-auto">
          <TableShell
            tableClassName="w-full text-left"
            columns={columns}
            data={resolvedLoading || resolvedError ? [] : filteredCategories}
            getRowId={(row) => row.id}
            loading={resolvedLoading}
            loadingState="Memuat kategori..."
            emptyState={
              resolvedError
                ? "Gagal memuat kategori."
                : "Belum ada kategori yang tersedia."
            }
            headerClassName="bg-gray-50 dark:bg-gray-800/50"
            bodyClassName="divide-y divide-gray-100 dark:divide-gray-700"
          />
        </div>
      </div>

      <Dialog
        open={newCategoryOpen}
        onOpenChange={(open) => {
          setNewCategoryOpen(open);
          if (!open) {
            setNewCategoryName("");
            setNewCategoryError("");
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tambah kategori produk</DialogTitle>
            <DialogDescription>
              Buat kategori baru agar dapat dipakai pada form produk marketplace.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="new-category-name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Nama kategori
            </label>
            <Input
              id="new-category-name"
              value={newCategoryName}
              onChange={(event) => {
                setNewCategoryName(event.target.value);
                if (newCategoryError) {
                  setNewCategoryError("");
                }
              }}
              placeholder="Contoh: Kerajinan Desa"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleCreateCategory();
                }
              }}
            />
            {newCategoryError ? (
              <p className="text-sm text-red-600 dark:text-red-400">
                {newCategoryError}
              </p>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewCategoryOpen(false)}
              disabled={isCreatingCategory}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={() => void handleCreateCategory()}
              disabled={isCreatingCategory}
            >
              {isCreatingCategory ? "Menyimpan..." : "Simpan kategori"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
