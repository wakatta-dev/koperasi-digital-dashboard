/** @format */

"use client";

import { useEffect, useMemo, useState, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Plus, Save, Trash2, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InputField } from "@/components/shared/inputs/input-field";
import { TableShell } from "@/components/shared/data-display/TableShell";
import {
  useInventoryProduct,
  useInventoryVariantActions,
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
  updateInventoryVariantGroup,
  updateInventoryVariantOption,
} from "@/services/api";
import type { InventoryProductVariantsResponse } from "@/types/api/inventory";

type VariantValue = {
  id: string;
  label: string;
  code: string;
};

type VariantAttribute = {
  id: string;
  backendId?: number;
  name: string;
  values: VariantValue[];
};

type VariantSelection = {
  attributeId: string;
  valueId: string;
};

type ProductVariant = {
  id?: string;
  optionId?: number;
  signature: string;
  displayName: string;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  selections: VariantSelection[];
};

type ServerVariantSnapshot = {
  optionId: number;
  sku: string;
  price: number;
  stock: number;
  image?: string;
  selections: VariantSelection[];
  displayName: string;
};

type PendingDelete =
  | { type: "attribute"; attributeId: string; removedCount: number }
  | {
      type: "value";
      attributeId: string;
      valueId: string;
      removedCount: number;
    }
  | { type: "variant"; signature: string; name: string; optionId?: number }
  | null;

export type ProductVariantPageProps = Readonly<{
  id: string;
}>;

const SKU_MAX_LENGTH = 100;
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
]);

const normalizeCode = (value: string): string => {
  const trimmed = value.trim().toUpperCase();
  const replaced = trimmed.replace(/\s+/g, "-").replace(/[^A-Z0-9-]/g, "-");
  return replaced.replace(/-+/g, "-").replace(/^-+|-+$/g, "");
};

const validateVariantImageFile = (file: File): string | null => {
  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return "Format gambar tidak didukung. Gunakan PNG, JPG, atau WEBP.";
  }
  if (file.size <= 0 || file.size > MAX_IMAGE_SIZE_BYTES) {
    return "Ukuran gambar maksimal 5 MB.";
  }
  return null;
};

const normalizeKey = (value: string): string =>
  value
    .toLowerCase()
    .replace(/\(.*?\)/g, "")
    .replace(/\s+/g, "");

const buildSignature = (
  attributes: VariantAttribute[],
  selections: VariantSelection[],
): string => {
  const selectionMap = new Map(
    selections.map((selection) => [selection.attributeId, selection.valueId]),
  );
  return attributes
    .map((attr) => `${attr.id}:${selectionMap.get(attr.id) ?? ""}`)
    .join("|");
};

const cartesianProduct = (
  attributes: VariantAttribute[],
): VariantSelection[][] => {
  if (attributes.length === 0) return [];
  return attributes.reduce<VariantSelection[][]>((acc, attr) => {
    if (attr.values.length === 0) return acc;
    if (acc.length === 0) {
      return attr.values.map((value) => [
        { attributeId: attr.id, valueId: value.id },
      ]);
    }
    return acc.flatMap((prev) =>
      attr.values.map((value) => [
        ...prev,
        { attributeId: attr.id, valueId: value.id },
      ]),
    );
  }, []);
};

const buildSku = (prefix: string, values: VariantValue[]): string => {
  const codes = values.map((value) => value.code).filter(Boolean);
  const normalizedPrefix = normalizeCode(prefix);
  const joined = codes.join("-");
  if (!normalizedPrefix) return joined;
  if (!joined) return normalizedPrefix;
  return `${normalizedPrefix}-${joined}`;
};

const getActiveAttributes = (
  attributes: VariantAttribute[],
): VariantAttribute[] => attributes.filter((attr) => attr.values.length > 0);

const getOrderedValues = (
  attributes: VariantAttribute[],
  selections: VariantSelection[],
): VariantValue[] => {
  const selectionMap = new Map(
    selections.map((selection) => [selection.attributeId, selection.valueId]),
  );
  const ordered: VariantValue[] = [];
  attributes.forEach((attr) => {
    const valueId = selectionMap.get(attr.id);
    if (!valueId) return;
    const value = attr.values.find((val) => val.id === valueId);
    if (value) ordered.push(value);
  });
  return ordered;
};

const buildDisplayName = (values: VariantValue[]): string =>
  values.map((value) => value.label).join(" / ");

const buildAttributeMap = (
  attributes: VariantAttribute[],
  selections: VariantSelection[],
): Record<string, string> => {
  const selectionMap = new Map(
    selections.map((selection) => [selection.attributeId, selection.valueId]),
  );
  const payload: Record<string, string> = {};
  attributes.forEach((attr) => {
    const valueId = selectionMap.get(attr.id);
    if (!valueId) return;
    const value = attr.values.find((val) => val.id === valueId);
    if (value) payload[attr.name] = value.label;
  });
  return payload;
};

const buildServerVariantMaps = (
  options: InventoryProductVariantsResponse["options"],
  activeAttributes: VariantAttribute[],
  basePrice: number,
) => {
  const bySignature = new Map<string, ServerVariantSnapshot>();
  const bySku = new Map<string, ServerVariantSnapshot>();

  options.forEach((option) => {
    const attrs = option.attributes ?? {};
    const selections: VariantSelection[] = activeAttributes
      .map((attr) => {
        const valueLabel = resolveAttributeValue(attrs, attr.name);
        if (!valueLabel) return null;
        const value = attr.values.find(
          (val) => val.label.toLowerCase() === valueLabel.toLowerCase(),
        );
        if (!value) return null;
        return { attributeId: attr.id, valueId: value.id };
      })
      .filter(Boolean) as VariantSelection[];

    if (selections.length !== activeAttributes.length) return;
    const orderedValues = getOrderedValues(activeAttributes, selections);
    const signature = buildSignature(activeAttributes, selections);
    if (!signature) return;

    const snapshot: ServerVariantSnapshot = {
      optionId: option.id,
      sku: option.sku,
      price: option.price_override ?? basePrice,
      stock: option.stock,
      image: option.image_url,
      selections,
      displayName: buildDisplayName(orderedValues),
    };

    bySignature.set(signature, snapshot);
    bySku.set(option.sku.trim().toUpperCase(), snapshot);
  });

  return { bySignature, bySku };
};

const mergePreserve = (
  existing: ProductVariant[],
  generated: ProductVariant[],
): ProductVariant[] => {
  const existingMap = new Map(
    existing.map((variant) => [variant.signature, variant]),
  );
  return generated.map((variant) => {
    const prev = existingMap.get(variant.signature);
    if (!prev) return variant;
    return {
      ...variant,
      id: prev.id,
      optionId: prev.optionId,
      sku: prev.sku || variant.sku,
      price: prev.price,
      stock: prev.stock,
      image: prev.image,
      selections: prev.selections,
    };
  });
};

const countVariants = (attributes: VariantAttribute[]): number => {
  const active = getActiveAttributes(attributes);
  if (active.length === 0) return 0;
  return cartesianProduct(active).length;
};

const resolveAttributeValue = (
  attributes: Record<string, string>,
  label: string,
): string => {
  if (attributes[label]) return attributes[label];
  const normalized = normalizeKey(label);
  const match = Object.entries(attributes).find(
    ([key]) => normalizeKey(key) === normalized,
  );
  return match?.[1] ?? "";
};

const buildInitialState = (
  variantsData: InventoryProductVariantsResponse | undefined,
  basePrice: number,
  skuPrefix: string,
): { attributes: VariantAttribute[]; variants: ProductVariant[] } => {
  const groups = variantsData?.variant_groups ?? [];
  const options = variantsData?.options ?? [];
  const attributes: VariantAttribute[] = [];
  const nameMap = new Map<string, VariantAttribute>();
  const idSet = new Set<string>();

  const createAttribute = (name: string, backendId?: number) => {
    const trimmed = name.trim();
    const normalized = normalizeKey(trimmed);
    if (nameMap.has(normalized)) return nameMap.get(normalized)!;
    const baseId = backendId
      ? `group-${backendId}`
      : `attr-${normalizeCode(trimmed) || "ATTR"}`;
    let id = baseId;
    let counter = 1;
    while (idSet.has(id)) {
      id = `${baseId}-${counter++}`;
    }
    const attribute: VariantAttribute = {
      id,
      backendId,
      name: trimmed,
      values: [],
    };
    attributes.push(attribute);
    nameMap.set(normalized, attribute);
    idSet.add(id);
    return attribute;
  };

  const ensureValue = (attribute: VariantAttribute, label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return null;
    const normalized = trimmed.toLowerCase();
    const existing = attribute.values.find(
      (val) => val.label.toLowerCase() === normalized,
    );
    if (existing) return existing;
    const existingIds = new Set(attribute.values.map((val) => val.id));
    const baseId = `val-${normalizeCode(trimmed) || "VALUE"}`;
    let id = baseId;
    let counter = 1;
    while (existingIds.has(id)) {
      id = `${baseId}-${counter++}`;
    }
    const value: VariantValue = {
      id,
      label: trimmed,
      code: normalizeCode(trimmed),
    };
    attribute.values.push(value);
    return value;
  };

  [...groups]
    .sort((a, b) => a.sort_order - b.sort_order || a.name.localeCompare(b.name))
    .forEach((group) => {
      createAttribute(group.name, group.id);
    });

  options.forEach((option) => {
    const attrs = option.attributes ?? {};
    Object.entries(attrs).forEach(([key, value]) => {
      const attribute = createAttribute(key);
      ensureValue(attribute, String(value));
    });
  });

  const activeAttributes = getActiveAttributes(attributes);
  const variants: ProductVariant[] = [];
  const signatureSet = new Set<string>();

  options.forEach((option) => {
    const attrs = option.attributes ?? {};
    const selections: VariantSelection[] = [];
    activeAttributes.forEach((attr) => {
      const valueLabel = resolveAttributeValue(attrs, attr.name);
      if (!valueLabel) return;
      const value = ensureValue(attr, valueLabel);
      if (value) {
        selections.push({ attributeId: attr.id, valueId: value.id });
      }
    });
    const signature = buildSignature(activeAttributes, selections);
    if (!signature || signatureSet.has(signature)) return;
    signatureSet.add(signature);
    const orderedValues = getOrderedValues(activeAttributes, selections);
    const displayName = buildDisplayName(orderedValues) || option.sku;
    const sku = option.sku || buildSku(skuPrefix, orderedValues);
    variants.push({
      id: String(option.id),
      optionId: option.id,
      signature,
      displayName,
      sku,
      price: option.price_override ?? basePrice,
      stock: option.stock,
      image: option.image_url,
      selections,
    });
  });

  return { attributes, variants };
};

export function ProductVariantPage({ id }: ProductVariantPageProps) {
  return <ProductVariantPageContent key={id} id={id} />;
}

function ProductVariantPageContent({ id }: ProductVariantPageProps) {
  const router = useRouter();
  const qc = useQueryClient();
  const variantActions = useInventoryVariantActions();
  const { data } = useInventoryProduct(id);
  const { data: variantsData } = useInventoryVariants(id);
  const product = useMemo(
    () => (data ? mapInventoryProduct(data) : null),
    [data],
  );
  const basePrice = product?.price ?? 0;
  const skuPrefix = useMemo(() => {
    if (product?.sku?.trim()) return normalizeCode(product.sku);
    if (product?.name?.trim()) return normalizeCode(product.name);
    return "SKU";
  }, [product?.sku, product?.name]);

  const [uiState, setUiState] = useState({
    saving: false,
    bulkPriceOpen: false,
    bulkPriceValue: "",
    bulkStockOpen: false,
    bulkStockValue: "",
    newAttributeOpen: false,
    newAttributeName: "",
    pendingDelete: null as PendingDelete,
    valueInputs: {} as Record<string, string>,
    isDirty: false,
  });
  const {
    saving,
    bulkPriceOpen,
    bulkPriceValue,
    bulkStockOpen,
    bulkStockValue,
    newAttributeOpen,
    newAttributeName,
    pendingDelete,
    valueInputs,
    isDirty,
  } = uiState;

  const resolveUpdate = <T,>(current: T, next: SetStateAction<T>): T =>
    typeof next === "function" ? (next as (prev: T) => T)(current) : next;

  const setSaving = (next: SetStateAction<boolean>) =>
    setUiState((current) => ({
      ...current,
      saving: resolveUpdate(current.saving, next),
    }));
  const setBulkPriceOpen = (next: SetStateAction<boolean>) =>
    setUiState((current) => ({
      ...current,
      bulkPriceOpen: resolveUpdate(current.bulkPriceOpen, next),
    }));
  const setBulkPriceValue = (next: SetStateAction<string>) =>
    setUiState((current) => ({
      ...current,
      bulkPriceValue: resolveUpdate(current.bulkPriceValue, next),
    }));
  const setBulkStockOpen = (next: SetStateAction<boolean>) =>
    setUiState((current) => ({
      ...current,
      bulkStockOpen: resolveUpdate(current.bulkStockOpen, next),
    }));
  const setBulkStockValue = (next: SetStateAction<string>) =>
    setUiState((current) => ({
      ...current,
      bulkStockValue: resolveUpdate(current.bulkStockValue, next),
    }));
  const setNewAttributeOpen = (next: SetStateAction<boolean>) =>
    setUiState((current) => ({
      ...current,
      newAttributeOpen: resolveUpdate(current.newAttributeOpen, next),
    }));
  const setNewAttributeName = (next: SetStateAction<string>) =>
    setUiState((current) => ({
      ...current,
      newAttributeName: resolveUpdate(current.newAttributeName, next),
    }));
  const setPendingDelete = (next: SetStateAction<PendingDelete>) =>
    setUiState((current) => ({
      ...current,
      pendingDelete: resolveUpdate(current.pendingDelete, next),
    }));
  const setValueInputs = (next: SetStateAction<Record<string, string>>) =>
    setUiState((current) => ({
      ...current,
      valueInputs: resolveUpdate(current.valueInputs, next),
    }));
  const setIsDirty = (next: SetStateAction<boolean>) =>
    setUiState((current) => ({
      ...current,
      isDirty: resolveUpdate(current.isDirty, next),
    }));
  const [attributes, setAttributes] = useState<VariantAttribute[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const serverVariantMaps = useMemo(() => {
    const activeAttributes = getActiveAttributes(attributes);
    if (!variantsData || activeAttributes.length === 0) return null;
    return buildServerVariantMaps(
      variantsData.options ?? [],
      activeAttributes,
      basePrice,
    );
  }, [variantsData, attributes, basePrice]);

  const initialOptionIds = useMemo(
    () => variantsData?.options?.map((option) => option.id) ?? [],
    [variantsData],
  );

  const applyInitialVariantState = (
    initial: ReturnType<typeof buildInitialState>,
  ) => {
    setAttributes(initial.attributes);
    setVariants(initial.variants);
    setValueInputs({});
  };

  useEffect(() => {
    if (!variantsData || !product || isDirty) return;
    const initial = buildInitialState(variantsData, basePrice, skuPrefix);
    applyInitialVariantState(initial);
  }, [variantsData, product, basePrice, skuPrefix, isDirty]);

  useEffect(() => {
    setVariants((prev) => {
      const activeAttributes = getActiveAttributes(attributes);
      if (activeAttributes.length === 0) return [];
      const combos = cartesianProduct(activeAttributes);
      const generated = combos.map((selections, index) => {
        const orderedValues = getOrderedValues(activeAttributes, selections);
        const displayName = buildDisplayName(orderedValues);
        const sku = buildSku(skuPrefix, orderedValues);
        const signature = buildSignature(activeAttributes, selections);
        return {
          id: `combo-${index + 1}`,
          signature,
          displayName,
          sku,
          price: basePrice,
          stock: 0,
          selections,
        };
      });
      const merged = mergePreserve(prev, generated);
      if (isDirty || !serverVariantMaps) {
        return merged;
      }
      return merged.map((variant) => {
        const serverVariant =
          serverVariantMaps.bySignature.get(variant.signature) ??
          serverVariantMaps.bySku.get(variant.sku.trim().toUpperCase());
        if (!serverVariant) return variant;
        return {
          ...variant,
          id: String(serverVariant.optionId),
          optionId: serverVariant.optionId,
          sku: serverVariant.sku,
          price: serverVariant.price,
          stock: serverVariant.stock,
          image: serverVariant.image,
          selections: serverVariant.selections,
          displayName: serverVariant.displayName || variant.displayName,
        };
      });
    });
  }, [attributes, basePrice, skuPrefix, isDirty, serverVariantMaps]);

  const createGroupMutation = useMutation({
    mutationFn: async (payload: { name: string; sort_order?: number }) =>
      ensureSuccess(await createInventoryVariantGroup(id, payload)),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.inventory.variants(id) });
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
    },
    onError: (err: any) => {
      toast.error(err?.message || "Gagal menghapus atribut");
    },
  });

  const validation = useMemo(() => {
    const attributeErrors = new Map<string, string>();
    const valueErrors = new Map<string, Map<string, string>>();
    const variantErrors = new Map<
      string,
      { sku?: string; price?: string; stock?: string }
    >();

    const nameCount = new Map<string, number>();
    attributes.forEach((attr) => {
      const normalized = attr.name.trim().toLowerCase();
      if (!normalized) return;
      nameCount.set(normalized, (nameCount.get(normalized) ?? 0) + 1);
    });

    attributes.forEach((attr) => {
      const trimmed = attr.name.trim();
      if (!trimmed) {
        attributeErrors.set(attr.id, "Nama atribut wajib diisi.");
      } else if ((nameCount.get(trimmed.toLowerCase()) ?? 0) > 1) {
        attributeErrors.set(attr.id, "Nama atribut harus unik.");
      }
      const valueMap = new Map<string, string>();
      const counts = new Map<string, number>();
      attr.values.forEach((value) => {
        const normalized = value.label.trim().toLowerCase();
        if (!normalized) return;
        counts.set(normalized, (counts.get(normalized) ?? 0) + 1);
      });
      attr.values.forEach((value) => {
        const trimmedValue = value.label.trim();
        if (!trimmedValue) {
          valueMap.set(value.id, "Nilai wajib diisi.");
        } else if ((counts.get(trimmedValue.toLowerCase()) ?? 0) > 1) {
          valueMap.set(value.id, "Nilai harus unik.");
        } else if (!normalizeCode(trimmedValue)) {
          valueMap.set(value.id, "Nilai tidak valid.");
        }
      });
      if (valueMap.size > 0) valueErrors.set(attr.id, valueMap);
    });

    const skuCount = new Map<string, number>();
    variants.forEach((variant) => {
      const skuKey = variant.sku.trim().toUpperCase();
      if (!skuKey) return;
      skuCount.set(skuKey, (skuCount.get(skuKey) ?? 0) + 1);
    });

    variants.forEach((variant) => {
      const errors: { sku?: string; price?: string; stock?: string } = {};
      const skuValue = variant.sku.trim();
      if (!skuValue) {
        errors.sku = "SKU wajib diisi.";
      } else if (skuValue.length > SKU_MAX_LENGTH) {
        errors.sku = `SKU maksimal ${SKU_MAX_LENGTH} karakter.`;
      } else if ((skuCount.get(skuValue.toUpperCase()) ?? 0) > 1) {
        errors.sku = "SKU harus unik.";
      }
      if (Number.isNaN(variant.price) || variant.price <= 0) {
        errors.price = "Harga harus lebih dari 0.";
      }
      if (!Number.isInteger(variant.stock) || variant.stock < 0) {
        errors.stock = "Stok harus bilangan >= 0.";
      }
      if (Object.keys(errors).length > 0) {
        variantErrors.set(variant.signature, errors);
      }
    });

    return { attributeErrors, valueErrors, variantErrors };
  }, [attributes, variants]);

  const hasErrors =
    validation.attributeErrors.size > 0 ||
    validation.valueErrors.size > 0 ||
    validation.variantErrors.size > 0;

  const handleChangeAttributeName = (attributeId: string, value: string) => {
    setIsDirty(true);
    setAttributes((prev) =>
      prev.map((attr) =>
        attr.id === attributeId ? { ...attr, name: value } : attr,
      ),
    );
  };

  const handleAddValue = (attributeId: string) => {
    const inputValue = (valueInputs[attributeId] ?? "").trim();
    if (!inputValue) return;
    setIsDirty(true);
    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id !== attributeId) return attr;
        const exists = attr.values.some(
          (value) => value.label.toLowerCase() === inputValue.toLowerCase(),
        );
        if (exists) return attr;
        const valueIdBase = `val-${normalizeCode(inputValue) || "VALUE"}`;
        let valueId = valueIdBase;
        let counter = 1;
        const existingIds = new Set(attr.values.map((value) => value.id));
        while (existingIds.has(valueId)) {
          valueId = `${valueIdBase}-${counter++}`;
        }
        const nextValue: VariantValue = {
          id: valueId,
          label: inputValue,
          code: normalizeCode(inputValue),
        };
        return { ...attr, values: [...attr.values, nextValue] };
      }),
    );
    setValueInputs((prev) => ({ ...prev, [attributeId]: "" }));
  };

  const handleUpdateValueLabel = (
    attributeId: string,
    valueId: string,
    label: string,
  ) => {
    setIsDirty(true);
    setAttributes((prev) =>
      prev.map((attr) => {
        if (attr.id !== attributeId) return attr;
        return {
          ...attr,
          values: attr.values.map((value) =>
            value.id === valueId
              ? { ...value, label, code: normalizeCode(label) }
              : value,
          ),
        };
      }),
    );
  };

  const requestRemoveAttribute = (attributeId: string) => {
    const nextAttributes = attributes.filter((attr) => attr.id !== attributeId);
    const removedCount = Math.max(
      countVariants(attributes) - countVariants(nextAttributes),
      0,
    );
    setPendingDelete({ type: "attribute", attributeId, removedCount });
  };

  const requestRemoveValue = (attributeId: string, valueId: string) => {
    const nextAttributes = attributes.map((attr) => {
      if (attr.id !== attributeId) return attr;
      return {
        ...attr,
        values: attr.values.filter((val) => val.id !== valueId),
      };
    });
    const removedCount = Math.max(
      countVariants(attributes) - countVariants(nextAttributes),
      0,
    );
    setPendingDelete({ type: "value", attributeId, valueId, removedCount });
  };

  const requestRemoveVariant = (variant: ProductVariant) => {
    setPendingDelete({
      type: "variant",
      signature: variant.signature,
      name: variant.displayName,
      optionId: variant.optionId,
    });
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    if (pendingDelete.type === "attribute") {
      const attribute = attributes.find(
        (attr) => attr.id === pendingDelete.attributeId,
      );
      if (attribute?.backendId) {
        try {
          await archiveGroupMutation.mutateAsync(attribute.backendId);
        } catch {
          setPendingDelete(null);
          return;
        }
      }
      setIsDirty(true);
      setAttributes((prev) =>
        prev.filter((attr) => attr.id !== pendingDelete.attributeId),
      );
      toast.success("Atribut berhasil dihapus.");
    }

    if (pendingDelete.type === "value") {
      setIsDirty(true);
      setAttributes((prev) =>
        prev.map((attr) =>
          attr.id === pendingDelete.attributeId
            ? {
                ...attr,
                values: attr.values.filter(
                  (value) => value.id !== pendingDelete.valueId,
                ),
              }
            : attr,
        ),
      );
      toast.success("Nilai atribut berhasil dihapus.");
    }

    if (pendingDelete.type === "variant") {
      if (pendingDelete.optionId) {
        try {
          await ensureSuccess(
            await archiveInventoryVariantOption(id, pendingDelete.optionId),
          );
        } catch (err: any) {
          toast.error(err?.message || "Gagal menghapus varian");
          setPendingDelete(null);
          return;
        }
      }
      setIsDirty(true);
      setVariants((prev) =>
        prev.filter((variant) => variant.signature !== pendingDelete.signature),
      );
      toast.success("Varian berhasil dihapus.");
    }

    setPendingDelete(null);
  };

  const updateVariant = (signature: string, patch: Partial<ProductVariant>) => {
    setIsDirty(true);
    setVariants((prev) =>
      prev.map((variant) =>
        variant.signature === signature ? { ...variant, ...patch } : variant,
      ),
    );
  };

  const handleUploadVariantImage = async (
    variant: ProductVariant,
    file?: File | null,
  ) => {
    if (!file) return;
    if (!variant.optionId) {
      toast.error("Simpan varian terlebih dahulu sebelum menambah gambar.");
      return;
    }
    const validationError = validateVariantImageFile(file);
    if (validationError) {
      toast.error(validationError);
      return;
    }
    try {
      const updated = await variantActions.uploadOptionImage.mutateAsync({
        productId: id,
        optionId: variant.optionId,
        file,
      });
      updateVariant(variant.signature, { image: updated.image_url });
    } catch {
      // handled by mutation
    }
  };

  const handleDeleteVariantImage = async (variant: ProductVariant) => {
    if (!variant.optionId) return;
    try {
      await variantActions.deleteOptionImage.mutateAsync({
        productId: id,
        optionId: variant.optionId,
      });
      updateVariant(variant.signature, { image: undefined });
    } catch {
      // handled by mutation
    }
  };

  const handleApplyBulkPrice = () => {
    const value = Number(bulkPriceValue);
    if (Number.isNaN(value) || value <= 0) {
      toast.error("Harga harus berupa angka lebih dari 0");
      return;
    }
    setIsDirty(true);
    setVariants((prev) =>
      prev.map((variant) => ({ ...variant, price: value })),
    );
    toast.success("Harga berhasil diterapkan ke semua varian.");
    setBulkPriceOpen(false);
  };

  const handleApplyBulkStock = () => {
    const value = Number(bulkStockValue);
    if (Number.isNaN(value) || value < 0) {
      toast.error("Stok harus berupa angka >= 0");
      return;
    }
    setIsDirty(true);
    setVariants((prev) =>
      prev.map((variant) => ({ ...variant, stock: value })),
    );
    toast.success("Stok berhasil diterapkan ke semua varian.");
    setBulkStockOpen(false);
  };

  const handleCreateAttribute = async () => {
    const name = newAttributeName.trim();
    if (!name) {
      toast.error("Nama atribut wajib diisi");
      return;
    }
    const exists = attributes.some(
      (attr) => attr.name.trim().toLowerCase() === name.toLowerCase(),
    );
    if (exists) {
      toast.error("Nama atribut harus unik.");
      return;
    }
    try {
      const created = await createGroupMutation.mutateAsync({
        name,
        sort_order: attributes.length,
      });
      const baseId = `attr-${normalizeCode(name) || "ATTR"}`;
      let idValue = baseId;
      let counter = 1;
      const existingIds = new Set(attributes.map((attr) => attr.id));
      while (existingIds.has(idValue)) {
        idValue = `${baseId}-${counter++}`;
      }
      setAttributes((prev) => [
        ...prev,
        { id: idValue, backendId: created.id, name: created.name, values: [] },
      ]);
      setIsDirty(true);
      setNewAttributeName("");
      setNewAttributeOpen(false);
      toast.success("Atribut berhasil ditambahkan.");
    } catch {
      // handled by mutation
    }
  };

  const ensureAttributeGroups = async (current: VariantAttribute[]) => {
    const updated = [...current];
    for (let index = 0; index < updated.length; index += 1) {
      const attr = updated[index];
      if (attr.backendId) continue;
      const created = await ensureSuccess(
        await createInventoryVariantGroup(id, {
          name: attr.name.trim(),
          sort_order: index,
        }),
      );
      updated[index] = { ...attr, backendId: created.id };
    }
    return updated;
  };

  const handleSaveVariants = async () => {
    if (hasErrors) {
      toast.error("Periksa kembali isian atribut dan varian.");
      return;
    }

    const activeAttributes = getActiveAttributes(attributes);
    if (activeAttributes.length === 0 || variants.length === 0) {
      toast.error("Tambahkan atribut dan nilai terlebih dahulu.");
      return;
    }

    setSaving(true);
    try {
      const updatedAttributes = await ensureAttributeGroups(attributes);
      setAttributes(updatedAttributes);

      await Promise.all(
        updatedAttributes
          .filter((attr) => attr.backendId)
          .map((attr, index) =>
            updateInventoryVariantGroup(id, attr.backendId as number, {
              name: attr.name.trim(),
              sort_order: index,
            }).then(ensureSuccess),
          ),
      );

      const primaryGroupId = updatedAttributes.find(
        (attr) => attr.backendId,
      )?.backendId;
      if (!primaryGroupId) {
        toast.error("Atribut belum tersimpan dengan benar.");
        setSaving(false);
        return;
      }

      const existingOptionBySku = new Map(
        (variantsData?.options ?? []).map((option) => [
          option.sku.trim().toUpperCase(),
          option,
        ]),
      );

      const tasks = variants.map((variant) => {
        const payload = {
          sku: variant.sku.trim(),
          attributes: buildAttributeMap(activeAttributes, variant.selections),
          price_override: variant.price,
          stock: variant.stock,
          track_stock: true,
          variant_group_id: primaryGroupId,
        };
        const fallbackOptionId =
          variant.optionId ??
          existingOptionBySku.get(payload.sku.toUpperCase())?.id;
        if (fallbackOptionId) {
          return updateInventoryVariantOption(
            id,
            fallbackOptionId,
            payload,
          ).then(ensureSuccess);
        }
        return createInventoryVariantOption(id, primaryGroupId, payload).then(
          ensureSuccess,
        );
      });

      const savedOptions = await Promise.all(tasks);
      const optionSignatureMap = new Map<
        string,
        (typeof savedOptions)[number]
      >();
      const optionSkuMap = new Map<string, (typeof savedOptions)[number]>();
      savedOptions.forEach((option) => {
        optionSkuMap.set(option.sku.trim().toUpperCase(), option);
        const attrs = option.attributes ?? {};
        const selections: VariantSelection[] = activeAttributes
          .map((attr) => {
            const valueLabel = resolveAttributeValue(attrs, attr.name);
            if (!valueLabel) return null;
            const value = attr.values.find(
              (val) => val.label.toLowerCase() === valueLabel.toLowerCase(),
            );
            if (!value) return null;
            return { attributeId: attr.id, valueId: value.id };
          })
          .filter(Boolean) as VariantSelection[];
        const signature = buildSignature(activeAttributes, selections);
        if (signature) optionSignatureMap.set(signature, option);
      });

      setVariants((prev) =>
        prev.map((variant) => {
          const option =
            optionSignatureMap.get(variant.signature) ??
            optionSkuMap.get(variant.sku.trim().toUpperCase());
          if (!option) return variant;
          return {
            ...variant,
            id: String(option.id),
            optionId: option.id,
            sku: option.sku,
            price: option.price_override ?? variant.price,
            stock: option.stock,
            image: option.image_url ?? variant.image,
          };
        }),
      );

      const currentOptionIds = new Set<number>();
      savedOptions.forEach((option) => currentOptionIds.add(option.id));
      variants.forEach((variant) => {
        if (variant.optionId) currentOptionIds.add(variant.optionId);
        const existing = existingOptionBySku.get(
          variant.sku.trim().toUpperCase(),
        );
        if (existing?.id) currentOptionIds.add(existing.id);
      });
      const removedOptionIds = initialOptionIds.filter(
        (optionId) => !currentOptionIds.has(optionId),
      );
      if (removedOptionIds.length > 0) {
        await Promise.all(
          removedOptionIds.map((optionId) =>
            archiveInventoryVariantOption(id, optionId).then(ensureSuccess),
          ),
        );
      }

      await qc.invalidateQueries({ queryKey: QK.inventory.variants(id) });
      await qc.invalidateQueries({ queryKey: QK.inventory.detail(id) });
      await qc.invalidateQueries({ queryKey: QK.inventory.stats(id) });
      await qc.refetchQueries({ queryKey: QK.inventory.variants(id) });
      setIsDirty(false);
      toast.success("Varian berhasil disimpan");
      router.push(`/bumdes/marketplace/inventory/${id}`);
    } catch (err: any) {
      toast.error(err?.message || "Gagal menyimpan varian");
    } finally {
      setSaving(false);
    }
  };

  const getVariantDescription = (variant: ProductVariant) => {
    const selectionMap = new Map(
      variant.selections.map((selection) => [
        selection.attributeId,
        selection.valueId,
      ]),
    );
    return attributes
      .filter((attr) => attr.values.length > 0)
      .map((attr) => {
        const valueId = selectionMap.get(attr.id);
        if (!valueId) return null;
        const value = attr.values.find((val) => val.id === valueId);
        if (!value) return null;
        return `${attr.name}: ${value.label}`;
      })
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div
      className="max-w-6xl mx-auto p-8 space-y-8"
      data-testid="marketplace-admin-product-variants-page-root"
    >
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
            data-testid="marketplace-admin-product-variants-cancel-button"
            className="px-5 py-2.5 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Batal
          </Button>
          <Button
            type="button"
            onClick={handleSaveVariants}
            disabled={saving || hasErrors}
            data-testid="marketplace-admin-product-variants-save-button"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium disabled:opacity-70"
          >
            <Save className="h-4 w-4" />
            {saving ? "Menyimpan..." : "Simpan Varian"}
          </Button>
        </div>
      </div>

      <div className="space-y-6 pb-12">
        <section className="surface-card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            Atribut Varian
          </h3>
          <div className="space-y-6">
            {attributes.map((attribute) => {
              const attributeError = validation.attributeErrors.get(
                attribute.id,
              );
              const valueErrorMap = validation.valueErrors.get(attribute.id);
              return (
                <div
                  key={attribute.id}
                  className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex-1">
                      <label htmlFor={`variant-attribute-name-${attribute.id}`} className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Nama atribut
                      </label>
                      <Input
                        id={`variant-attribute-name-${attribute.id}`}
                        value={attribute.name}
                        onChange={(event) =>
                          handleChangeAttributeName(
                            attribute.id,
                            event.target.value,
                          )
                        }
                        placeholder="Nama atribut"
                        className={`text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600 ${
                          attributeError
                            ? "border-red-500 focus-visible:ring-red-500"
                            : ""
                        }`}
                      />
                      {attributeError ? (
                        <p className="text-xs text-red-500 mt-1">
                          {attributeError}
                        </p>
                      ) : null}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => requestRemoveAttribute(attribute.id)}
                      className="text-xs text-red-500 hover:text-red-600 font-medium h-auto px-0"
                    >
                      Hapus Atribut
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2 mb-3">
                    {attribute.values.map((value) => {
                      const valueError = valueErrorMap?.get(value.id);
                      return (
                        <div key={value.id} className="flex items-center gap-2">
                          <Input
                            value={value.label}
                            onChange={(event) =>
                              handleUpdateValueLabel(
                                attribute.id,
                                value.id,
                                event.target.value,
                              )
                            }
                            className={`text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600 ${
                              valueError
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }`}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              requestRemoveValue(attribute.id, value.id)
                            }
                            className="h-9 w-9 text-gray-500 hover:text-red-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {valueError ? (
                            <p className="text-xs text-red-500">{valueError}</p>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={valueInputs[attribute.id] ?? ""}
                      onChange={(event) =>
                        setValueInputs((prev) => ({
                          ...prev,
                          [attribute.id]: event.target.value,
                        }))
                      }
                      placeholder="Masukkan nilai baru (contoh: Gold)..."
                      className="flex-1 text-sm rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleAddValue(attribute.id)}
                      className="px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                      Tambah
                    </Button>
                  </div>
                </div>
              );
            })}
            <Button
              type="button"
              variant="ghost"
              onClick={() => setNewAttributeOpen(true)}
              data-testid="marketplace-admin-product-variants-add-attribute-button"
              className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors mt-2 h-auto px-0"
            >
              <Plus className="h-4 w-4" />
              Tambah Atribut Lain (mis. Ukuran, RAM)
            </Button>
          </div>
        </section>

        <section
          className="surface-table"
          data-testid="marketplace-admin-product-variants-table"
        >
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
            <TableShell
              tableClassName="w-full text-left"
              columns={[
                {
                  id: "image",
                  header: <>Gambar</>,
                  cell: ({ row }) => (
                    <div className="relative h-12 w-12">
                      <label
                        htmlFor={`variant-image-${row.original.signature}`}
                        className="flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg border border-dashed border-gray-300 bg-gray-50 transition-colors hover:border-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-indigo-600"
                      >
                        {row.original.image ? (
                          <img
                            src={row.original.image}
                            alt={row.original.displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </label>
                      <input
                        id={`variant-image-${row.original.signature}`}
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.target.files?.[0] ?? null;
                          handleUploadVariantImage(row.original, file);
                          event.currentTarget.value = "";
                        }}
                      />
                      {row.original.image ? (
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleDeleteVariantImage(row.original)}
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white text-red-500 shadow-sm hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      ) : null}
                    </div>
                  ),
                  meta: {
                    headerClassName:
                      "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-20 text-center",
                    cellClassName: "px-6 py-4",
                  },
                },
                {
                  id: "displayName",
                  header: <>Nama Varian</>,
                  cell: ({ row }) => (
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {row.original.displayName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {getVariantDescription(row.original)}
                      </span>
                    </div>
                  ),
                  meta: {
                    headerClassName:
                      "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase",
                    cellClassName: "px-6 py-4",
                  },
                },
                {
                  id: "sku",
                  header: <>SKU</>,
                  cell: ({ row }) => {
                    const errors = validation.variantErrors.get(
                      row.original.signature,
                    );

                    return (
                      <>
                        <Input
                          value={row.original.sku}
                          onChange={(event) =>
                            updateVariant(row.original.signature, {
                              sku: event.target.value,
                            })
                          }
                          data-testid={`marketplace-admin-product-variants-sku-input-${row.original.optionId ?? row.original.signature}`}
                          className={`w-full rounded-md border-gray-300 py-1.5 text-sm focus-visible:border-indigo-600 focus-visible:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${
                            errors?.sku
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                        />
                        {errors?.sku ? (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.sku}
                          </p>
                        ) : null}
                      </>
                    );
                  },
                  meta: {
                    headerClassName:
                      "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-48",
                    cellClassName: "px-6 py-4",
                  },
                },
                {
                  id: "price",
                  header: <>Harga Jual</>,
                  cell: ({ row }) => {
                    const errors = validation.variantErrors.get(
                      row.original.signature,
                    );

                    return (
                      <InputField
                        ariaLabel={`Harga varian ${row.original.displayName}`}
                        className="w-full"
                        startIcon={<span className="text-sm">Rp</span>}
                        type="number"
                        value={row.original.price}
                        data-testid={`marketplace-admin-product-variants-price-input-${row.original.optionId ?? row.original.signature}`}
                        onValueChange={(value) =>
                          updateVariant(row.original.signature, {
                            price: Number(value) || 0,
                          })
                        }
                        errorText={errors?.price}
                      />
                    );
                  },
                  meta: {
                    headerClassName:
                      "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-48",
                    cellClassName: "px-6 py-4",
                  },
                },
                {
                  id: "stock",
                  header: <>Stok</>,
                  cell: ({ row }) => {
                    const errors = validation.variantErrors.get(
                      row.original.signature,
                    );

                    return (
                      <>
                        <Input
                          type="number"
                          value={row.original.stock}
                          onChange={(event) =>
                            updateVariant(row.original.signature, {
                              stock: Number(event.target.value) || 0,
                            })
                          }
                          data-testid={`marketplace-admin-product-variants-stock-input-${row.original.optionId ?? row.original.signature}`}
                          className={`w-full rounded-md border-gray-300 py-1.5 text-sm focus-visible:border-indigo-600 focus-visible:ring-indigo-600 dark:border-gray-600 dark:bg-gray-800 dark:text-white ${
                            errors?.stock
                              ? "border-red-500 focus-visible:ring-red-500"
                              : ""
                          }`}
                        />
                        {errors?.stock ? (
                          <p className="mt-1 text-xs text-red-500">
                            {errors.stock}
                          </p>
                        ) : null}
                      </>
                    );
                  },
                  meta: {
                    headerClassName:
                      "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-28",
                    cellClassName: "px-6 py-4",
                  },
                },
                {
                  id: "actions",
                  header: "",
                  cell: ({ row }) => (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => requestRemoveVariant(row.original)}
                      className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  ),
                  meta: {
                    headerClassName:
                      "px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase w-16 text-right",
                    cellClassName: "px-6 py-4 text-right",
                  },
                },
              ]}
              data={variants}
              getRowId={(row) => row.signature}
              rowProps={(row) => ({
                "data-testid": `marketplace-admin-product-variants-row-${row.optionId ?? row.signature}`,
              })}
              headerClassName="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700"
              bodyClassName="divide-y divide-gray-100 dark:divide-gray-700"
              emptyState="Belum ada varian. Tambahkan nilai atribut untuk membuat kombinasi."
              rowHoverable={false}
              rowClassName="group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
            />
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Menampilkan {variants.length} kombinasi varian dari total{" "}
              {variants.length} kombinasi.
            </p>
          </div>
        </section>
      </div>

      <Dialog open={newAttributeOpen} onOpenChange={setNewAttributeOpen}>
        <DialogContent
          className="max-w-md"
          data-testid="marketplace-admin-product-variants-add-attribute-dialog"
        >
          <DialogTitle className="text-lg font-semibold text-gray-900 dark:text-white">
            Tambah Atribut Baru
          </DialogTitle>
          <div className="mt-4 space-y-3">
            <label htmlFor="new-attribute-name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Nama atribut
            </label>
            <Input
              id="new-attribute-name"
              value={newAttributeName}
              onChange={(event) => setNewAttributeName(event.target.value)}
              placeholder="Contoh: Ukuran, RAM, Warna"
              data-testid="marketplace-admin-product-variants-new-attribute-input"
              className="text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:ring-indigo-600 focus-visible:border-indigo-600"
            />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setNewAttributeOpen(false)}
              data-testid="marketplace-admin-product-variants-new-attribute-cancel-button"
              className="px-4 py-2 text-sm"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleCreateAttribute}
              disabled={createGroupMutation.isPending}
              data-testid="marketplace-admin-product-variants-new-attribute-save-button"
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
            <label htmlFor="bulk-price-value" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Harga jual (Rp)
            </label>
            <Input
              id="bulk-price-value"
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
            <label htmlFor="bulk-stock-value" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Jumlah stok
            </label>
            <Input
              id="bulk-stock-value"
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
        open={Boolean(pendingDelete)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPendingDelete(null);
        }}
        title={
          pendingDelete?.type === "attribute"
            ? "Hapus Atribut?"
            : pendingDelete?.type === "value"
              ? "Hapus Nilai?"
              : "Hapus Varian?"
        }
        description={
          pendingDelete?.type === "attribute" ? (
            <>
              Tindakan ini akan menghapus {pendingDelete.removedCount} kombinasi
              varian.
            </>
          ) : pendingDelete?.type === "value" ? (
            <>
              Tindakan ini akan menghapus {pendingDelete.removedCount} kombinasi
              varian.
            </>
          ) : pendingDelete ? (
            <>
              Apakah Anda yakin ingin menghapus{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {pendingDelete.name}
              </span>
              ? Tindakan ini tidak dapat dibatalkan.
            </>
          ) : null
        }
        confirmLabel="Hapus"
        onConfirm={handleConfirmDelete}
        tone="destructive"
      />
    </div>
  );
}
