/** @format */

"use client";

import { GuestRentalApplicationForm, type GuestRentalApplicationFormValues } from "./GuestRentalApplicationForm";
import { SelectedAssetSummaryCard, type SelectedAssetSummary } from "./SelectedAssetSummaryCard";

type GuestRentalApplicationFeatureProps = Readonly<{
  title: string;
  description: string;
  values: GuestRentalApplicationFormValues;
  onValuesChange: (next: GuestRentalApplicationFormValues) => void;
  onSubmit: () => void;
  submitting?: boolean;
  selectedAsset: SelectedAssetSummary;
}>;

export function GuestRentalApplicationFeature({
  title,
  description,
  values,
  onValuesChange,
  onSubmit,
  submitting,
  selectedAsset,
}: GuestRentalApplicationFeatureProps) {
  return (
    <section className="min-h-screen pb-20 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {title}
          </h1>
          <p className="text-gray-500 dark:text-gray-400">{description}</p>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-surface-card-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded-lg text-brand-primary">
                  <span className="material-symbols-outlined">description</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Lengkapi Data Pengajuan
                </h2>
              </div>

              <GuestRentalApplicationForm
                values={values}
                onValuesChange={onValuesChange}
                onSubmit={onSubmit}
                submitting={submitting}
              />
            </div>
          </div>

          <div className="lg:col-span-1 mt-8 lg:mt-0">
            <SelectedAssetSummaryCard asset={selectedAsset} />
          </div>
        </div>
      </div>
    </section>
  );
}

