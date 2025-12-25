/** @format */

"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { formatCurrency } from "@/lib/format";
import {
  useInventoryVariantActions,
  useInventoryVariants,
} from "@/hooks/queries/inventory";
import type {
  InventoryVariantGroupResponse,
  InventoryVariantOptionResponse,
} from "@/types/api/inventory";

type Props = {
  productId: string | number;
};

type GroupFormState = {
  name: string;
  sortOrder: string;
  imageUrl: string;
};

type OptionFormState = {
  groupId: string;
  sku: string;
  attributes: string;
  priceOverride: string;
  stock: string;
  trackStock: boolean;
  clearPriceOverride: boolean;
};

const DEFAULT_GROUP_FORM: GroupFormState = {
  name: "",
  sortOrder: "0",
  imageUrl: "",
};

const DEFAULT_OPTION_FORM: OptionFormState = {
  groupId: "",
  sku: "",
  attributes: "",
  priceOverride: "",
  stock: "0",
  trackStock: true,
  clearPriceOverride: false,
};

export function VariantManagement({ productId }: Props) {
  const { data, isLoading, isError, error } = useInventoryVariants(productId);
  const actions = useInventoryVariantActions();
  const [groupForm, setGroupForm] = useState<GroupFormState>(DEFAULT_GROUP_FORM);
  const [editGroupId, setEditGroupId] = useState<number | null>(null);
  const [editGroupForm, setEditGroupForm] = useState<GroupFormState>(DEFAULT_GROUP_FORM);
  const [groupFiles, setGroupFiles] = useState<Record<number, File | null>>({});
  const [groupError, setGroupError] = useState<string | null>(null);

  const [optionForm, setOptionForm] = useState<OptionFormState>(DEFAULT_OPTION_FORM);
  const [editOptionId, setEditOptionId] = useState<number | null>(null);
  const [editOptionForm, setEditOptionForm] = useState<OptionFormState>(DEFAULT_OPTION_FORM);
  const [optionError, setOptionError] = useState<string | null>(null);

  const groups = data?.variant_groups ?? [];
  const options = data?.options ?? [];

  const groupMap = useMemo(() => {
    const map = new Map<number, InventoryVariantGroupResponse>();
    groups.forEach((group) => map.set(group.id, group));
    return map;
  }, [groups]);

  const groupedOptions = useMemo(() => {
    return options.map((option) => ({
      ...option,
      groupName: groupMap.get(option.variant_group_id)?.name ?? "-",
    }));
  }, [options, groupMap]);

  const handleGroupFileChange = (groupId: number, file: File | null) => {
    setGroupFiles((prev) => ({ ...prev, [groupId]: file }));
  };

  const parseAttributes = (raw: string) => {
    if (!raw.trim()) return undefined;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Attributes harus berbentuk objek JSON.");
    }
    const output: Record<string, string> = {};
    Object.entries(parsed as Record<string, unknown>).forEach(([key, value]) => {
      output[key] = String(value ?? "");
    });
    return output;
  };

  const handleCreateGroup = async () => {
    setGroupError(null);
    if (!groupForm.name.trim()) {
      setGroupError("Nama grup wajib diisi.");
      return;
    }
    try {
      await actions.createGroup.mutateAsync({
        productId,
        payload: {
          name: groupForm.name,
          sort_order: Number(groupForm.sortOrder || 0),
          image_url: groupForm.imageUrl || undefined,
        },
      });
      setGroupForm(DEFAULT_GROUP_FORM);
    } catch (err) {
      setGroupError((err as Error)?.message || "Gagal membuat grup varian.");
    }
  };

  const handleEditGroup = (group: InventoryVariantGroupResponse) => {
    setEditGroupId(group.id);
    setEditGroupForm({
      name: group.name,
      sortOrder: String(group.sort_order ?? 0),
      imageUrl: group.image_url ?? "",
    });
  };

  const handleUpdateGroup = async () => {
    if (!editGroupId) return;
    setGroupError(null);
    if (!editGroupForm.name.trim()) {
      setGroupError("Nama grup wajib diisi.");
      return;
    }
    try {
      await actions.updateGroup.mutateAsync({
        productId,
        groupId: editGroupId,
        payload: {
          name: editGroupForm.name,
          sort_order: Number(editGroupForm.sortOrder || 0),
          image_url: editGroupForm.imageUrl || undefined,
        },
      });
      setEditGroupId(null);
    } catch (err) {
      setGroupError((err as Error)?.message || "Gagal memperbarui grup varian.");
    }
  };

  const handleUploadGroupImage = async (groupId: number) => {
    const file = groupFiles[groupId];
    if (!file) return;
    setGroupError(null);
    try {
      await actions.uploadGroupImage.mutateAsync({ productId, groupId, file });
      handleGroupFileChange(groupId, null);
    } catch (err) {
      setGroupError((err as Error)?.message || "Gagal mengunggah foto grup.");
    }
  };

  const handleArchiveGroup = async (groupId: number) => {
    setGroupError(null);
    try {
      await actions.archiveGroup.mutateAsync({ productId, groupId });
    } catch (err) {
      setGroupError((err as Error)?.message || "Gagal mengarsipkan grup varian.");
    }
  };

  const handleCreateOption = async () => {
    setOptionError(null);
    if (!optionForm.groupId) {
      setOptionError("Pilih grup varian terlebih dahulu.");
      return;
    }
    if (!optionForm.sku.trim()) {
      setOptionError("SKU varian wajib diisi.");
      return;
    }
    try {
      const attributes = parseAttributes(optionForm.attributes);
      const priceOverride = optionForm.priceOverride
        ? Number(optionForm.priceOverride)
        : undefined;
      await actions.createOption.mutateAsync({
        productId,
        groupId: optionForm.groupId,
        payload: {
          variant_group_id: Number(optionForm.groupId),
          sku: optionForm.sku,
          attributes,
          price_override: priceOverride,
          stock: Number(optionForm.stock || 0),
          track_stock: optionForm.trackStock,
        },
      });
      setOptionForm(DEFAULT_OPTION_FORM);
    } catch (err) {
      setOptionError((err as Error)?.message || "Gagal membuat opsi varian.");
    }
  };

  const handleEditOption = (option: InventoryVariantOptionResponse) => {
    setEditOptionId(option.id);
    setEditOptionForm({
      groupId: String(option.variant_group_id),
      sku: option.sku,
      attributes: option.attributes ? JSON.stringify(option.attributes, null, 2) : "",
      priceOverride:
        option.price_override !== null && option.price_override !== undefined
          ? String(option.price_override)
          : "",
      stock: String(option.stock ?? 0),
      trackStock: option.track_stock,
      clearPriceOverride: false,
    });
  };

  const handleUpdateOption = async () => {
    if (!editOptionId) return;
    setOptionError(null);
    if (!editOptionForm.sku.trim()) {
      setOptionError("SKU varian wajib diisi.");
      return;
    }
    try {
      const attributes = parseAttributes(editOptionForm.attributes);
      await actions.updateOption.mutateAsync({
        productId,
        optionId: editOptionId,
        payload: {
          sku: editOptionForm.sku,
          attributes,
          price_override: editOptionForm.priceOverride
            ? Number(editOptionForm.priceOverride)
            : undefined,
          clear_price_override: editOptionForm.clearPriceOverride,
          stock: Number(editOptionForm.stock || 0),
          track_stock: editOptionForm.trackStock,
        },
      });
      setEditOptionId(null);
    } catch (err) {
      setOptionError((err as Error)?.message || "Gagal memperbarui opsi varian.");
    }
  };

  const handleArchiveOption = async (optionId: number) => {
    setOptionError(null);
    try {
      await actions.archiveOption.mutateAsync({ productId, optionId });
    } catch (err) {
      setOptionError((err as Error)?.message || "Gagal mengarsipkan opsi varian.");
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-lg border border-border bg-white p-6 shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
        <p className="text-sm text-muted-foreground">Memuat data varian...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Gagal memuat varian: {(error as Error)?.message || "Terjadi kesalahan"}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm dark:border-[#334155] dark:bg-[#1e293b]">
      <div className="border-b border-[#e5e7eb] px-6 py-4 dark:border-[#334155]">
        <h2 className="text-lg font-semibold text-[#111827] dark:text-white">
          Manajemen Varian
        </h2>
        <p className="text-sm text-muted-foreground">
          Kelola grup varian, opsi SKU, dan gambar varian untuk produk ini.
        </p>
      </div>

      <div className="space-y-8 p-6">
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#111827] dark:text-white">
              Grup Varian
            </h3>
            <Badge variant="secondary">{groups.length} grup</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-[2fr_1fr_1fr_auto]">
            <Input
              placeholder="Nama grup (contoh: Warna)"
              value={groupForm.name}
              onChange={(event) =>
                setGroupForm((prev) => ({ ...prev, name: event.target.value }))
              }
            />
            <Input
              placeholder="Urutan"
              type="number"
              value={groupForm.sortOrder}
              onChange={(event) =>
                setGroupForm((prev) => ({
                  ...prev,
                  sortOrder: event.target.value,
                }))
              }
            />
            <Input
              placeholder="URL gambar (opsional)"
              value={groupForm.imageUrl}
              onChange={(event) =>
                setGroupForm((prev) => ({
                  ...prev,
                  imageUrl: event.target.value,
                }))
              }
            />
            <Button onClick={handleCreateGroup} disabled={actions.createGroup.isPending}>
              Tambah Grup
            </Button>
          </div>

          {groupError ? (
            <p className="text-xs text-destructive">{groupError}</p>
          ) : null}

          {groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada grup varian. Tambahkan grup untuk mulai membuat opsi SKU.
            </p>
          ) : (
            <div className="space-y-3">
              {groups.map((group) => (
                <div
                  key={group.id}
                  className="rounded-lg border border-[#e5e7eb] p-4 dark:border-[#334155]"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
                        {group.image_url ? (
                          <img
                            src={group.image_url}
                            alt={group.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-xs text-gray-400">
                            Belum ada gambar
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-[#111827] dark:text-white">
                            {group.name}
                          </p>
                          <Badge variant={group.status === "ACTIVE" ? "default" : "secondary"}>
                            {group.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Urutan: {group.sort_order}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={(event) =>
                          handleGroupFileChange(group.id, event.target.files?.[0] ?? null)
                        }
                        className="w-56"
                      />
                      <Button
                        variant="outline"
                        onClick={() => handleUploadGroupImage(group.id)}
                        disabled={!groupFiles[group.id] || actions.uploadGroupImage.isPending}
                      >
                        Upload Foto
                      </Button>
                      <Button variant="outline" onClick={() => handleEditGroup(group)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleArchiveGroup(group.id)}
                        disabled={group.status !== "ACTIVE" || actions.archiveGroup.isPending}
                      >
                        Arsipkan
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {editGroupId ? (
            <div className="rounded-lg border border-[#e5e7eb] bg-gray-50 p-4 dark:border-[#334155] dark:bg-gray-900/20">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#111827] dark:text-white">
                  Edit Grup Varian
                </h4>
                <Button variant="ghost" size="sm" onClick={() => setEditGroupId(null)}>
                  Tutup
                </Button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Input
                  placeholder="Nama grup"
                  value={editGroupForm.name}
                  onChange={(event) =>
                    setEditGroupForm((prev) => ({
                      ...prev,
                      name: event.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Urutan"
                  type="number"
                  value={editGroupForm.sortOrder}
                  onChange={(event) =>
                    setEditGroupForm((prev) => ({
                      ...prev,
                      sortOrder: event.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="URL gambar"
                  value={editGroupForm.imageUrl}
                  onChange={(event) =>
                    setEditGroupForm((prev) => ({
                      ...prev,
                      imageUrl: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button onClick={handleUpdateGroup} disabled={actions.updateGroup.isPending}>
                  Simpan Perubahan
                </Button>
                <Button variant="outline" onClick={() => setEditGroupId(null)}>
                  Batal
                </Button>
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-[#111827] dark:text-white">
              Opsi Varian (SKU)
            </h3>
            <Badge variant="secondary">{options.length} opsi</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input
              placeholder="SKU varian"
              value={optionForm.sku}
              onChange={(event) =>
                setOptionForm((prev) => ({ ...prev, sku: event.target.value }))
              }
            />
            <select
              value={optionForm.groupId}
              onChange={(event) =>
                setOptionForm((prev) => ({ ...prev, groupId: event.target.value }))
              }
              className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
            >
              <option value="">Pilih grup varian</option>
              {groups.map((group) => (
                <option key={group.id} value={String(group.id)}>
                  {group.name}
                </option>
              ))}
            </select>
            <Input
              placeholder="Harga override (opsional)"
              type="number"
              value={optionForm.priceOverride}
              onChange={(event) =>
                setOptionForm((prev) => ({
                  ...prev,
                  priceOverride: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Stok"
              type="number"
              value={optionForm.stock}
              onChange={(event) =>
                setOptionForm((prev) => ({ ...prev, stock: event.target.value }))
              }
            />
          </div>

          <div className="space-y-3">
            <Textarea
              placeholder='Attributes JSON (contoh: {"size":"L"})'
              value={optionForm.attributes}
              onChange={(event) =>
                setOptionForm((prev) => ({
                  ...prev,
                  attributes: event.target.value,
                }))
              }
              rows={3}
            />
            <div className="flex items-center gap-3">
              <Switch
                checked={optionForm.trackStock}
                onCheckedChange={(checked) =>
                  setOptionForm((prev) => ({ ...prev, trackStock: checked }))
                }
              />
              <span className="text-sm text-muted-foreground">
                Lacak stok untuk opsi ini
              </span>
            </div>
            <Button onClick={handleCreateOption} disabled={actions.createOption.isPending}>
              Tambah Opsi
            </Button>
            {optionError ? (
              <p className="text-xs text-destructive">{optionError}</p>
            ) : null}
          </div>

          {groupedOptions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Belum ada opsi varian. Tambahkan opsi SKU di atas.
            </p>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-[#e5e7eb] dark:border-[#334155]">
              <table className="min-w-full divide-y divide-[#e5e7eb] text-sm dark:divide-[#334155]">
                <thead className="bg-gray-50 dark:bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      SKU
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Grup
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Attributes
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Harga Override
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Stok
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e5e7eb] dark:divide-[#334155]">
                  {groupedOptions.map((option) => (
                    <tr key={option.id}>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {option.sku}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {option.groupName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {option.attributes
                          ? Object.entries(option.attributes)
                              .map(([key, value]) => `${key}: ${value}`)
                              .join(", ")
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {option.price_override !== null &&
                        option.price_override !== undefined
                          ? formatCurrency(option.price_override)
                          : "-"}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {option.track_stock ? option.stock : "Tidak dilacak"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={option.status === "ACTIVE" ? "default" : "secondary"}
                        >
                          {option.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditOption(option)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleArchiveOption(option.id)}
                            disabled={option.status !== "ACTIVE" || actions.archiveOption.isPending}
                          >
                            Arsipkan
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {editOptionId ? (
            <div className="rounded-lg border border-[#e5e7eb] bg-gray-50 p-4 dark:border-[#334155] dark:bg-gray-900/20">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-[#111827] dark:text-white">
                  Edit Opsi Varian
                </h4>
                <Button variant="ghost" size="sm" onClick={() => setEditOptionId(null)}>
                  Tutup
                </Button>
              </div>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Input
                  placeholder="SKU"
                  value={editOptionForm.sku}
                  onChange={(event) =>
                    setEditOptionForm((prev) => ({
                      ...prev,
                      sku: event.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Harga override"
                  type="number"
                  value={editOptionForm.priceOverride}
                  onChange={(event) =>
                    setEditOptionForm((prev) => ({
                      ...prev,
                      priceOverride: event.target.value,
                    }))
                  }
                />
                <Input
                  placeholder="Stok"
                  type="number"
                  value={editOptionForm.stock}
                  onChange={(event) =>
                    setEditOptionForm((prev) => ({
                      ...prev,
                      stock: event.target.value,
                    }))
                  }
                />
                <select
                  value={editOptionForm.groupId}
                  onChange={(event) =>
                    setEditOptionForm((prev) => ({
                      ...prev,
                      groupId: event.target.value,
                    }))
                  }
                  className="h-10 rounded-md border border-input bg-background px-3 text-sm text-foreground"
                  disabled
                >
                  <option value="">Pilih grup varian</option>
                  {groups.map((group) => (
                    <option key={group.id} value={String(group.id)}>
                      {group.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mt-4 space-y-3">
                <Textarea
                  placeholder='Attributes JSON (contoh: {"size":"L"})'
                  value={editOptionForm.attributes}
                  onChange={(event) =>
                    setEditOptionForm((prev) => ({
                      ...prev,
                      attributes: event.target.value,
                    }))
                  }
                  rows={3}
                />
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={editOptionForm.trackStock}
                      onCheckedChange={(checked) =>
                        setEditOptionForm((prev) => ({ ...prev, trackStock: checked }))
                      }
                    />
                    <span className="text-sm text-muted-foreground">
                      Lacak stok
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={editOptionForm.clearPriceOverride}
                      onChange={(event) =>
                        setEditOptionForm((prev) => ({
                          ...prev,
                          clearPriceOverride: event.target.checked,
                        }))
                      }
                      className="h-4 w-4"
                    />
                    Hapus override harga
                  </label>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Button onClick={handleUpdateOption} disabled={actions.updateOption.isPending}>
                  Simpan Perubahan
                </Button>
                <Button variant="outline" onClick={() => setEditOptionId(null)}>
                  Batal
                </Button>
              </div>
              {optionError ? (
                <p className="mt-2 text-xs text-destructive">{optionError}</p>
              ) : null}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
