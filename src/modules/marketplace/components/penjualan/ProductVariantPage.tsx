/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Plus, Save, Trash2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  useInventoryProduct,
  useInventoryVariants,
} from "@/hooks/queries/inventory";
import { QK } from "@/hooks/queries/queryKeys";
import { ensureSuccess } from "@/lib/api";
import { ConfirmActionDialog } from "@/modules/marketplace/components/shared/ConfirmActionDialog";
import { mapInventoryProduct } from "@/modules/inventory/utils";
import {
  archiveInventoryVariantGroup,
  archiveInventoryVariantOption,
  createInventoryVariantGroup,
  createInventoryVariantOption,
  updateInventoryVariantOption,
} from "@/services/api";
import type { InventoryProductVariantsResponse } from "@/types/api/inventory";

type AttributeGroup = {
  id?: number;
  label: string;
  values: string[];
  inputValue: string;
};

type VariantRow = {
  id: string;
  optionId?: number;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
};

export type ProductVariantPageProps = Readonly<{
  id: string;
}>;

const fallbackAttributes: AttributeGroup[] = [];

const resolveAttributeLabels = (
  variantsData?: InventoryProductVariantsResponse,
): string[] => {
  const groups = variantsData?.variant_groups ?? [];
  if (groups.length > 0) {
    return [...groups]
      .sort(
        (a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name),
      )
      .map((group) => group.name);
  }

  const options = variantsData?.options ?? [];
  const labels = new Set<string>();
  options.forEach((option) => {
    const attributes = option.attributes ?? {};
    Object.keys(attributes).forEach((key) => labels.add(key));
  });

  if (labels.size > 0) {
    return Array.from(labels);
  }

  return fallbackAttributes.map((attr) => attr.label);
};

const buildAttributesFromVariants = (
  variantsData?: InventoryProductVariantsResponse,
): AttributeGroup[] => {
  const labels = resolveAttributeLabels(variantsData);
  const options = variantsData?.options ?? [];
  const groups = variantsData?.variant_groups ?? [];
  const groupMap = new Map<string, number>();
  groups.forEach((group) => {
    groupMap.set(group.name, group.id);
  });

  if (options.length === 0 && labels.length === 0) return [];

  const map = new Map<string, Set<string>>();
  labels.forEach((label) => map.set(label, new Set()));

  options.forEach((option) => {
    const attributes = option.attributes ?? {};
    labels.forEach((label) => {
      const value = resolveAttributeValue(attributes, label);
      if (value) {
        map.get(label)?.add(value);
      }
    });
  });

  const attributes = labels.map((label) => ({
    id: groupMap.get(label),
    label,
    values: Array.from(map.get(label) ?? []),
    inputValue: "",
  }));

  return attributes.length > 0 ? attributes : [];
};

const buildRowsFromVariants = (
  variantsData?: InventoryProductVariantsResponse,
  basePrice = 0,
  attributeLabels?: string[],
): VariantRow[] => {
  const options = variantsData?.options ?? [];
  if (options.length === 0) return [];
  const labels =
    attributeLabels && attributeLabels.length > 0
      ? attributeLabels
      : resolveAttributeLabels(variantsData);

  return options.map((option) => {
    const attributes = option.attributes ?? {};
    const values = labels
      .map((label) => resolveAttributeValue(attributes, label))
      .filter(Boolean);
    const name = values.length > 0 ? values.join(" / ") : option.sku;
    const description = labels
      .map((label) => {
        const value = resolveAttributeValue(attributes, label);
        return value ? `${label}: ${value}` : null;
      })
      .filter(Boolean)
      .join(", ");
    return {
      id: String(option.id),
      optionId: option.id,
      name,
      description,
      sku: option.sku,
      price: option.price_override ?? basePrice,
      stock: option.stock,
      attributes,
    };
  });
};

const normalizeAttributeKey = (value: string) =>
  value
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, "");

const resolveAttributeValue = (
  attributes: Record<string, string>,
  label: string,
): string => {
  if (attributes[label]) return attributes[label];
  const normalized = normalizeAttributeKey(label);
  const match = Object.entries(attributes).find(
    ([key]) => normalizeAttributeKey(key) === normalized,
  );
  return match?.[1] ?? "";
};

const buildVariantKey = (
  labels: string[],
  attributes: Record<string, string>,
): string =>
  labels
    .map((label) =>
      resolveAttributeValue(attributes, label).trim().toLowerCase(),
    )
    .join("||");

const buildCombinationRows = (
  attributes: AttributeGroup[],
  basePrice: number,
): VariantRow[] => {
  const labels = attributes.map((attr) => attr.label);
  const valuesList = attributes.map((attr) => attr.values);

  if (
    valuesList.length === 0 ||
    valuesList.some((values) => values.length === 0)
  ) {
    return [];
  }

  const combos: string[][] = valuesList.reduce(
    (acc, values) =>
      acc.flatMap((prev) => values.map((value) => [...prev, value])),
    [[] as string[]],
  );

  return combos.map((values, index) => {
    const attributeMap: Record<string, string> = {};
    labels.forEach((label, idx) => {
      attributeMap[label] = values[idx];
    });
    const name = values.join(" / ");
    const description = labels
      .map((label, idx) => `${label}: ${values[idx]}`)
      .join(", ");
    const sku = `SKU-AUTO-${String(index + 1).padStart(2, "0")}`;
    return {
      id: `combo-${index + 1}`,
      name,
      description,
      sku,
      price: basePrice,
      stock: 0,
      attributes: attributeMap,
    };
  });
};

const mergeVariantRows = (
  currentRows: VariantRow[],
  combinationRows: VariantRow[],
  attributes: AttributeGroup[],
): VariantRow[] => {
  const labels = attributes.map((attr) => attr.label);
  if (labels.length === 0) return currentRows;

  const existingMap = new Map<string, VariantRow>();
  currentRows.forEach((row) => {
    existingMap.set(buildVariantKey(labels, row.attributes), row);
  });

  const merged = combinationRows.map((row) => {
    const key = buildVariantKey(labels, row.attributes);
    return existingMap.get(key) ?? row;
  });

  const mergedKeys = new Set(
    merged.map((row) => buildVariantKey(labels, row.attributes)),
  );
  const extras = currentRows.filter(
    (row) => !mergedKeys.has(buildVariantKey(labels, row.attributes)),
  );

  return [...merged, ...extras];
};

export function ProductVariantPage({ id }: ProductVariantPageProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const { data } = useInventoryProduct(id);
  const { data: variantsData } = useInventoryVariants(id);
  const product = useMemo(
    () => (data ? mapInventoryProduct(data) : null),
    [data],
  );
  const basePrice = product?.price ?? 0;
  const [saving, setSaving] = useState(false);
  const [bulkPriceOpen, setBulkPriceOpen] = useState(false);
  const [bulkPriceValue, setBulkPriceValue] = useState("");
  const [bulkStockOpen, setBulkStockOpen] = useState(false);
  const [bulkStockValue, setBulkStockValue] = useState("");
  const [newAttributeOpen, setNewAttributeOpen] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState("");

  const initialAttributes = useMemo(
    () => buildAttributesFromVariants(variantsData),
    [variantsData],
  );
  const [attributes, setAttributes] =
    useState<AttributeGroup[]>(initialAttributes);
  const [deleteTarget, setDeleteTarget] = useState<VariantRow | null>(null);

  const initialRows = useMemo(
    () =>
      buildRowsFromVariants(
        variantsData,
        basePrice,
        initialAttributes.map((attr) => attr.label),
      ),
    [variantsData, basePrice, initialAttributes],
  );
  const [variantRows, setVariantRows] = useState<VariantRow[]>(initialRows);

  useEffect(() => {
    const nextAttributes = buildAttributesFromVariants(variantsData);
    setAttributes(nextAttributes);
    setVariantRows(
      buildRowsFromVariants(
        variantsData,
        basePrice,
        nextAttributes.map((attr) => attr.label),
      ),
    );
  }, [variantsData, basePrice]);

  const createGroupMutation = useMutation({
    mutationFn: async (payload: { name: string; sort_order?: number }) =>
      ensureSuccess(await createInventoryVariantGroup(id, payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.inventory.variants(id) });
      toast.success("Atribut berhasil ditambahkan");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menambahkan atribut");
    },
  });

  const archiveGroupMutation = useMutation({
    mutationFn: async (groupId: number) =>
      ensureSuccess(await archiveInventoryVariantGroup(id, groupId)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.inventory.variants(id) });
      toast.success("Atribut berhasil dihapus");
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menghapus atribut");
    },
  });

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.optionId) {
      try {
        await ensureSuccess(
          await archiveInventoryVariantOption(id, deleteTarget.optionId),
        );
        setVariantRows((prev) =>
          prev.filter((row) => row.id !== deleteTarget.id),
        );
        qc.invalidateQueries({ queryKey: QK.inventory.variants(id) });
        toast.success("Varian berhasil dihapus");
      } catch (err: any) {
        toast.error(err?.message || "Gagal menghapus varian");
      } finally {
        setDeleteTarget(null);
      }
      return;
    }
    setVariantRows((prev) => prev.filter((row) => row.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleAddValue = (index: number) => {
    let nextAttributes: AttributeGroup[] | null = null;
    let hasNewValue = false;
    setAttributes((prev) => {
      const next = prev.map((attr, idx) => {
        if (idx !== index) return attr;
        const value = attr.inputValue.trim();
        if (!value || attr.values.includes(value)) {
          return { ...attr, inputValue: "" };
        }
        hasNewValue = true;
        return {
          ...attr,
          values: [...attr.values, value],
          inputValue: "",
        };
      });
      nextAttributes = next;
      return next;
    });

    if (!hasNewValue || !nextAttributes) return;

    const combinationRows = buildCombinationRows(nextAttributes, basePrice);
    let newRows: VariantRow[] = [];
    setVariantRows((current) => {
      const labels = nextAttributes?.map((attr) => attr.label) ?? [];
      const existingKeys = new Set(
        current.map((row) => buildVariantKey(labels, row.attributes)),
      );
      newRows = combinationRows.filter(
        (row) => !existingKeys.has(buildVariantKey(labels, row.attributes)),
      );
      return mergeVariantRows(current, combinationRows, nextAttributes ?? []);
    });

    const attribute = nextAttributes[index];
    if (attribute && !attribute.id) {
      ensureAttributeGroup(attribute, index)
        .then((groupId) => {
          const updated = (nextAttributes ?? []).map((attr, idx) =>
            idx === index ? { ...attr, id: groupId } : attr,
          );
          if (newRows.length > 0) {
            createOptionsForRows(newRows, updated);
          }
        })
        .catch(() => undefined);
      return;
    }
    if (newRows.length > 0) {
      createOptionsForRows(newRows, nextAttributes);
    }
  };

  const handleRemoveValue = (index: number, value: string) => {
    setAttributes((prev) => {
      const next = prev.map((attr, idx) =>
        idx === index
          ? { ...attr, values: attr.values.filter((item) => item !== value) }
          : attr,
      );
      const combinationRows = buildCombinationRows(next, basePrice);
      setVariantRows((current) =>
        mergeVariantRows(current, combinationRows, next),
      );
      return next;
    });
  };

  const handleRemoveAttribute = (index: number) => {
    const target = attributes[index];
    if (!target) return;

    const removeLocal = () => {
      setAttributes((prev) => {
        const removed = prev[index];
        const next = prev.filter((_, idx) => idx !== index);
        if (!removed) return prev;

        setVariantRows((current) => {
          const cleaned = current.map((row) => {
            const nextAttributes = { ...row.attributes };
            delete nextAttributes[removed.label];
            Object.keys(nextAttributes).forEach((key) => {
              if (
                normalizeAttributeKey(key) ===
                normalizeAttributeKey(removed.label)
              ) {
                delete nextAttributes[key];
              }
            });

            const labels = next.map((attr) => attr.label);
            const values = labels
              .map((label) => resolveAttributeValue(nextAttributes, label))
              .filter(Boolean);
            const name = values.length > 0 ? values.join(" / ") : row.sku;
            const description = labels
              .map((label) => {
                const value = resolveAttributeValue(nextAttributes, label);
                return value ? `${label}: ${value}` : null;
              })
              .filter(Boolean)
              .join(", ");

            return {
              ...row,
              attributes: nextAttributes,
              name,
              description,
            };
          });

          const combinationRows = buildCombinationRows(next, basePrice);
          return mergeVariantRows(cleaned, combinationRows, next);
        });

        return next;
      });
    };

    if (target.id) {
      archiveGroupMutation.mutate(target.id, {
        onSuccess: removeLocal,
      });
      return;
    }
    removeLocal();
  };

  const handleChangeInput = (index: number, value: string) => {
    setAttributes((prev) =>
      prev.map((attr, idx) =>
        idx === index ? { ...attr, inputValue: value } : attr,
      ),
    );
  };

  const updateRow = (rowId: string, patch: Partial<VariantRow>) => {
    setVariantRows((prev) =>
      prev.map((row) => (row.id === rowId ? { ...row, ...patch } : row)),
    );
  };

  const handleApplyBulkPrice = () => {
    const value = Number(bulkPriceValue);
    if (Number.isNaN(value) || value < 0) {
      toast.error("Harga harus berupa angka >= 0");
      return;
    }
    setVariantRows((prev) => prev.map((row) => ({ ...row, price: value })));
    setBulkPriceOpen(false);
  };

  const handleApplyBulkStock = () => {
    const value = Number(bulkStockValue);
    if (Number.isNaN(value) || value < 0) {
      toast.error("Stok harus berupa angka >= 0");
      return;
    }
    setVariantRows((prev) => prev.map((row) => ({ ...row, stock: value })));
    setBulkStockOpen(false);
  };

  const handleCreateAttribute = async () => {
    const name = newAttributeName.trim();
    if (!name) {
      toast.error("Nama atribut wajib diisi");
      return;
    }
    const group = await createGroupMutation.mutateAsync({
      name,
      sort_order: attributes.length,
    });
    setAttributes((prev) => [
      ...prev,
      { id: group.id, label: group.name, values: [], inputValue: "" },
    ]);
    setNewAttributeName("");
    setNewAttributeOpen(false);
  };

  const ensureAttributeGroup = async (attribute: AttributeGroup, index: number) => {
    if (attribute.id) return attribute.id;
    const group = await createGroupMutation.mutateAsync({
      name: attribute.label,
      sort_order: index,
    });
    setAttributes((prev) =>
      prev.map((attr, idx) =>
        idx === index ? { ...attr, id: group.id, label: group.name } : attr
      )
    );
    return group.id;
  };

  const createOptionsForRows = async (
    rows: VariantRow[],
    currentAttributes: AttributeGroup[]
  ) => {
    if (rows.length === 0) return;
    const primaryGroupId = currentAttributes.find((attr) => attr.id)?.id;
    if (!primaryGroupId) {
      toast.error("Buat atribut terlebih dahulu sebelum menambah varian.");
      return;
    }

    try {
      const created = await Promise.all(
        rows.map((row) =>
          createInventoryVariantOption(id, primaryGroupId, {
            sku: row.sku.trim(),
            attributes: row.attributes,
            price_override: row.price,
            stock: row.stock,
            track_stock: true,
          }).then(ensureSuccess)
        )
      );
      const labels = currentAttributes.map((attr) => attr.label);
      const createdMap = new Map(
        created.map((option) => [
          buildVariantKey(labels, option.attributes ?? {}),
          option,
        ])
      );
      setVariantRows((prev) =>
        prev.map((row) => {
          const key = buildVariantKey(labels, row.attributes);
          const option = createdMap.get(key);
          if (!option) return row;
          return {
            ...row,
            id: String(option.id),
            optionId: option.id,
            sku: option.sku,
            price: option.price_override ?? row.price,
            stock: option.stock,
            attributes: option.attributes ?? row.attributes,
          };
        })
      );
      qc.invalidateQueries({ queryKey: QK.inventory.variants(id) });
    } catch (err: any) {
      toast.error(err?.message || "Gagal menambahkan varian");
    }
  };

  const handleSaveVariants = async () => {
    const groupId = attributes.find((attr) => attr.id)?.id;
    if (!groupId) {
      toast.error(
        "Tambahkan atribut terlebih dahulu sebelum menyimpan varian.",
      );
      return;
    }

    const invalidRow = variantRows.find(
      (row) =>
        row.sku.trim() === "" ||
        Number.isNaN(row.price) ||
        row.price < 0 ||
        Number.isNaN(row.stock) ||
        row.stock < 0,
    );
    if (invalidRow) {
      toast.error("Periksa SKU, harga, dan stok pada daftar varian.");
      return;
    }

    setSaving(true);
    try {
      const tasks = variantRows.map((row) => {
        const payload = {
          sku: row.sku.trim(),
          attributes: row.attributes,
          price_override: row.price,
          stock: row.stock,
          track_stock: true,
        };
        if (row.optionId) {
          return updateInventoryVariantOption(id, row.optionId, payload).then(
            ensureSuccess,
          );
        }
        return createInventoryVariantOption(id, groupId, payload).then(
          ensureSuccess,
        );
      });
      await Promise.all(tasks);
      qc.invalidateQueries({ queryKey: QK.inventory.variants(id) });
      toast.success("Varian berhasil disimpan");
    } catch (err: any) {
      toast.error(err?.message || "Gagal menyimpan varian");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-8 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Tambah Varian Produk
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tambahkan variasi baru untuk produk {product?.name ?? ""}.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push(`/bumdes/marketplace/inventory/${id}`)}
            className="px-5 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSaveVariants}
            disabled={saving}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {saving ? "Menyimpan..." : "Simpan Varian"}
          </Button>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Atribut Varian
          </h3>
          <div className="space-y-6">
            {attributes.map((attribute, index) => (
              <div
                key={attribute.label}
                className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-900 dark:text-white">
                    {attribute.label}
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleRemoveAttribute(index)}
                    className="text-xs text-red-500 hover:text-red-600 font-medium h-auto px-0"
                  >
                    Hapus Atribut
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {attribute.values.map((value) => (
                    <span
                      key={value}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200"
                    >
                      {value}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveValue(index, value)}
                        className="h-5 w-5 ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={attribute.inputValue}
                    onChange={(event) =>
                      handleChangeInput(index, event.target.value)
                    }
                    placeholder="Masukkan nilai baru (contoh: Gold)..."
                    className="flex-1 text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleAddValue(index)}
                    className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600"
                  >
                    Tambah
                  </Button>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="ghost"
              onClick={() => setNewAttributeOpen(true)}
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors mt-2 h-auto px-0"
            >
              <Plus className="h-4 w-4" />
              Tambah Atribut Lain (mis. Ukuran, RAM)
            </Button>
          </div>
        </section>

        <section className="bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Daftar Varian
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Kelola detail untuk setiap kombinasi varian.
              </p>
            </div>
            <div className="flex gap-2 text-xs">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setBulkPriceOpen(true)}
                className="p-0 h-auto text-xs font-medium text-indigo-600 hover:underline"
              >
                Terapkan harga ke semua
              </Button>
              <span className="text-gray-300">|</span>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setBulkStockOpen(true)}
                className="p-0 h-auto text-xs font-medium text-indigo-600 hover:underline"
              >
                Terapkan stok ke semua
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table className="w-full text-left">
              <TableHeader className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
                <TableRow>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-20 text-center">
                    Gambar
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Nama Varian
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-48">
                    SKU
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-48">
                    Harga Jual
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-28">
                    Stok
                  </TableHead>
                  <TableHead className="px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-16 text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-gray-700">
                {variantRows.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="px-6 py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                    >
                      Belum ada varian. Tambahkan nilai atribut untuk membuat
                      kombinasi.
                    </TableCell>
                  </TableRow>
                ) : (
                  variantRows.map((row) => (
                    <TableRow
                      key={row.id}
                      className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                    >
                      <TableCell className="px-6 py-4">
                        <div className="w-12 h-12 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-50 dark:bg-gray-800 cursor-pointer hover:border-indigo-600 dark:hover:border-indigo-600 transition-colors">
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {row.name}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {row.description}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Input
                          value={row.sku}
                          onChange={(event) =>
                            updateRow(row.id, { sku: event.target.value })
                          }
                          className="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus-visible:ring-indigo-600 focus-visible:border-indigo-600 py-1.5"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                            Rp
                          </span>
                          <Input
                            value={row.price}
                            onChange={(event) =>
                              updateRow(row.id, {
                                price: Number(event.target.value) || 0,
                              })
                            }
                            className="w-full pl-9 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus-visible:ring-indigo-600 focus-visible:border-indigo-600 py-1.5"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Input
                          type="number"
                          value={row.stock}
                          onChange={(event) =>
                            updateRow(row.id, {
                              stock: Number(event.target.value) || 0,
                            })
                          }
                          className="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus-visible:ring-indigo-600 focus-visible:border-indigo-600 py-1.5"
                        />
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteTarget(row)}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Menampilkan {variantRows.length} kombinasi varian dari total{" "}
              {variantRows.length} kombinasi.
            </p>
          </div>
        </section>
      </div>

      <Dialog open={newAttributeOpen} onOpenChange={setNewAttributeOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Tambah Atribut Baru
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama atribut
            </label>
            <Input
              value={newAttributeName}
              onChange={(event) => setNewAttributeName(event.target.value)}
              placeholder="Contoh: Ukuran, RAM, Warna"
              className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewAttributeOpen(false)}
              className="px-4 py-2 text-sm"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleCreateAttribute}
              disabled={createGroupMutation.isPending}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm"
            >
              {createGroupMutation.isPending ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkPriceOpen} onOpenChange={setBulkPriceOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Terapkan Harga ke Semua Varian
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Harga jual (Rp)
            </label>
            <Input
              type="number"
              value={bulkPriceValue}
              onChange={(event) => setBulkPriceValue(event.target.value)}
              placeholder="Masukkan harga"
              className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBulkPriceOpen(false)}
              className="px-4 py-2 text-sm"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleApplyBulkPrice}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm"
            >
              Terapkan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={bulkStockOpen} onOpenChange={setBulkStockOpen}>
        <DialogContent className="max-w-md">
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Terapkan Stok ke Semua Varian
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jumlah stok
            </label>
            <Input
              type="number"
              value={bulkStockValue}
              onChange={(event) => setBulkStockValue(event.target.value)}
              placeholder="Masukkan stok"
              className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setBulkStockOpen(false)}
              className="px-4 py-2 text-sm"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleApplyBulkStock}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 text-sm"
            >
              Terapkan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmActionDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeleteTarget(null);
        }}
        title="Hapus Varian?"
        description={
          deleteTarget ? (
            <>
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {deleteTarget.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </>
          ) : null
        }
        confirmLabel="Hapus Varian"
        onConfirm={handleConfirmDelete}
        tone="destructive"
      />
    </div>
  );
}
