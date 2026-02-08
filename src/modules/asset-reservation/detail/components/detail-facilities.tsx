/** @format */

export type FacilityItem = {
  icon: string;
  label: string;
};

type DetailFacilitiesProps = {
  facilities: FacilityItem[];
  emptyLabel?: string;
};

export function DetailFacilities({
  facilities,
  emptyLabel = "Fasilitas belum tersedia.",
}: DetailFacilitiesProps) {
  if (!facilities || facilities.length === 0) {
    return (
      <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Fasilitas Aset</h2>
        <div className="text-sm text-gray-500 dark:text-gray-400">{emptyLabel}</div>
      </div>
    );
  }

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-6">
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Fasilitas Aset</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {facilities.map((facility) => (
          <div
            key={facility.label}
            className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
          >
            <span className="material-icons-outlined text-brand-primary">{facility.icon}</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {facility.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
