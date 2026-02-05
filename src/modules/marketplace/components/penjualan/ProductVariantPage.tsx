/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Image as ImageIcon, Plus, Save, Trash2, X } from "lucide-react";
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
import { useInventoryProduct, useInventoryVariants } from "@/hooks/queries/inventory";
import { ConfirmActionDialog } from "@/modules/marketplace/components/shared/ConfirmActionDialog";
import { mapInventoryProduct } from "@/modules/inventory/utils";
import type { InventoryProductVariantsResponse } from "@/types/api/inventory";

type AttributeGroup = {
  label: string;
  values: string[];
  inputValue: string;
};

type VariantRow = {
  id: string;
  name: string;
  description: string;
  sku: string;
  price: number;
  stock: number;
};

export type ProductVariantPageProps = Readonly<{
  id: string;
}>;

const fallbackAttributes: AttributeGroup[] = [
  { label: "Warna (Color)", values: ["Space Grey", "Silver"], inputValue: "" },
  { label: "Penyimpanan (Storage)", values: ["256GB", "512GB"], inputValue: "" },
];

const fallbackRows: VariantRow[] = [
  {
    id: "1",
    name: "Space Grey / 256GB",
    description: "Warna: Space Grey, Penyimpanan: 256GB",
    sku: "SKU-AUTO-01",
    price: 0,
    stock: 0,
  },
  {
    id: "2",
    name: "Space Grey / 512GB",
    description: "Warna: Space Grey, Penyimpanan: 512GB",
    sku: "SKU-AUTO-02",
    price: 0,
    stock: 0,
  },
  {
    id: "3",
    name: "Silver / 256GB",
    description: "Warna: Silver, Penyimpanan: 256GB",
    sku: "SKU-AUTO-03",
    price: 0,
    stock: 0,
  },
  {
    id: "4",
    name: "Silver / 512GB",
    description: "Warna: Silver, Penyimpanan: 512GB",
    sku: "SKU-AUTO-04",
    price: 0,
    stock: 0,
  },
];

const buildAttributesFromVariants = (
  variantsData?: InventoryProductVariantsResponse
): AttributeGroup[] => {
  const options = variantsData?.options ?? [];
  if (options.length === 0) return fallbackAttributes;

  const map = new Map<string, Set<string>>();
  options.forEach((option) => {
    const attributes = option.attributes ?? {};
    Object.entries(attributes).forEach(([key, value]) => {
      if (!map.has(key)) {
        map.set(key, new Set());
      }
      if (value) {
        map.get(key)?.add(value);
      }
    });
  });

  if (map.size === 0) return fallbackAttributes;

  return Array.from(map.entries()).map(([label, values]) => ({
    label,
    values: Array.from(values),
    inputValue: "",
  }));
};

const buildRowsFromVariants = (
  variantsData?: InventoryProductVariantsResponse,
  basePrice = 0
): VariantRow[] => {
  const options = variantsData?.options ?? [];
  if (options.length === 0) return fallbackRows;

  return options.map((option) => {
    const attributes = option.attributes ?? {};
    const values = Object.values(attributes);
    const name = values.length > 0 ? values.join(" / ") : option.sku;
    const description = Object.entries(attributes)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");
    return {
      id: String(option.id),
      name,
      description,
      sku: option.sku,
      price: option.price_override ?? basePrice,
      stock: option.stock,
    };
  });
};

export function ProductVariantPage({ id }: ProductVariantPageProps) {
  const router = useRouter();
  const { data } = useInventoryProduct(id);
  const { data: variantsData } = useInventoryVariants(id);
  const product = useMemo(() => (data ? mapInventoryProduct(data) : null), [data]);

  const initialAttributes = useMemo(
    () => buildAttributesFromVariants(variantsData),
    [variantsData]
  );
  const [attributes, setAttributes] = useState<AttributeGroup[]>(initialAttributes);
  const [deleteTarget, setDeleteTarget] = useState<VariantRow | null>(null);

  useEffect(() => {
    setAttributes(buildAttributesFromVariants(variantsData));
  }, [variantsData]);

  const rows = useMemo(
    () => buildRowsFromVariants(variantsData, product?.price ?? 0),
    [variantsData, product?.price]
  );

  const handleAddValue = (index: number) => {
    setAttributes((prev) =>
      prev.map((attr, idx) => {
        if (idx !== index) return attr;
        const value = attr.inputValue.trim();
        if (!value) return attr;
        return {
          ...attr,
          values: attr.values.includes(value) ? attr.values : [...attr.values, value],
          inputValue: "",
        };
      })
    );
  };

  const handleRemoveValue = (index: number, value: string) => {
    setAttributes((prev) =>
      prev.map((attr, idx) =>
        idx === index
          ? { ...attr, values: attr.values.filter((item) => item !== value) }
          : attr
      )
    );
  };

  const handleChangeInput = (index: number, value: string) => {
    setAttributes((prev) =>
      prev.map((attr, idx) => (idx === index ? { ...attr, inputValue: value } : attr))
    );
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
            onClick={() => router.push(`/bumdes/marketplace/inventory/${id}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-colors shadow-sm text-sm font-medium"
          >
            <Save className="h-4 w-4" />
            Simpan Varian
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
                    onChange={(event) => handleChangeInput(index, event.target.value)}
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
                className="p-0 h-auto text-xs font-medium text-indigo-600 hover:underline"
              >
                Terapkan harga ke semua
              </Button>
              <span className="text-gray-300">|</span>
              <Button
                type="button"
                variant="ghost"
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
                {rows.map((row) => (
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
                        defaultValue={row.sku}
                        className="w-full text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus-visible:ring-indigo-600 focus-visible:border-indigo-600 py-1.5"
                      />
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                          Rp
                        </span>
                        <Input
                          defaultValue={row.price}
                          className="w-full pl-9 text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-md focus-visible:ring-indigo-600 focus-visible:border-indigo-600 py-1.5"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <Input
                        type="number"
                        defaultValue={row.stock}
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
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Menampilkan {rows.length} kombinasi varian dari total {rows.length} kombinasi.
            </p>
          </div>
        </section>
      </div>
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
        onConfirm={() => setDeleteTarget(null)}
        tone="destructive"
      />
    </div>
  );
}
