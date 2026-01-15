/** @format */

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { BUSINESS_UNITS, DEFAULT_LANDING_CONTENT } from "../constants";
import type { BusinessUnitConfig } from "@/types/landing-page";

type BusinessUnitsProps = {
  businessUnits?: BusinessUnitConfig;
};

export function BusinessUnits({ businessUnits }: BusinessUnitsProps) {
  const fallback = DEFAULT_LANDING_CONTENT.business_units;
  const items =
    businessUnits?.items && businessUnits.items.length > 0
      ? businessUnits.items
      : fallback.items.map((unit, index) => ({
          unit_id: String(index + 1),
          order: index + 1,
          label_override: BUSINESS_UNITS[index]?.label ?? "Unit Usaha",
          image_url: unit.image_url,
        }));
  return (
    <section className="py-20 bg-blue-50/50 dark:bg-[#0f172a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Unit Usaha Pembangun Desa
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Kami adalah lembaga yang berkomitmen menggerakkan potensi ekonomi desa melalui unit
            usaha produktif dan berkelanjutan.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((unit, index) => {
            const fallbackUnit = BUSINESS_UNITS[index] ?? BUSINESS_UNITS[0];
            const title = fallbackUnit?.title ?? "Unit Usaha";
            const description = fallbackUnit?.description ?? "Deskripsi unit usaha.";
            return (
            <Card
              key={`${unit.unit_id}-${index}`}
              className="bg-white dark:bg-[#1e293b] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 flex flex-col group border-0"
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={unit.image_url || fallbackUnit?.image}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                />
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <span className="text-[#4338ca] text-xs font-bold uppercase tracking-wide mb-2">
                  {unit.label_override || fallbackUnit?.label || "Unit Usaha"}
                </span>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                  {title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-grow">
                  {description}
                </p>
                <Link
                  href="#"
                  className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white hover:text-[#4338ca] dark:hover:text-[#4338ca] transition"
                >
                  Selengkapnya{" "}
                  <span className="material-icons-outlined text-sm ml-1">chevron_right</span>
                </Link>
              </div>
            </Card>
          );
        })}
        </div>
      </div>
    </section>
  );
}
