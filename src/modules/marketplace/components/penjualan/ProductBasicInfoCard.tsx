/** @format */

"use client";

export type ProductBasicInfoCardProps = Readonly<{
  category: string;
  brand: string;
  description: string;
  weightKg?: number | null;
}>;

export function ProductBasicInfoCard({
  category,
  brand,
  description,
  weightKg,
}: ProductBasicInfoCardProps) {
  return (
    <div className="surface-card p-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
        Informasi Dasar
      </h3>
      <dl className="space-y-4">
        <div>
          <dt className="text-xs text-gray-500 dark:text-gray-400">Kategori</dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-white mt-1">
            {category}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 dark:text-gray-400">Merek</dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-white mt-1">
            {brand}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 dark:text-gray-400">Deskripsi</dt>
          <dd className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
            {description}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-gray-500 dark:text-gray-400">Berat</dt>
          <dd className="text-sm font-medium text-gray-900 dark:text-white mt-1">
            {typeof weightKg === "number" && !Number.isNaN(weightKg)
              ? `${weightKg} kg`
              : "-"}
          </dd>
        </div>
      </dl>
    </div>
  );
}
