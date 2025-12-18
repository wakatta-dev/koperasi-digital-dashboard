/** @format */

type StatusRenterCardProps = {
  renterName: string;
  renterContact: string;
  dateRange: { start: string; end: string; duration: string };
  purpose: string;
};

export function StatusRenterCard({
  renterName,
  renterContact,
  dateRange,
  purpose,
}: StatusRenterCardProps) {
  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
      <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
        <span className="material-icons-outlined text-[#4338ca]">assignment</span>
        Rincian Penyewa &amp; Acara
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
            Nama Penyewa
          </span>
          <span className="font-semibold text-gray-900 dark:text-white block">{renterName}</span>
        </div>
        <div>
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
            Kontak (WhatsApp)
          </span>
          <span className="font-semibold text-gray-900 dark:text-white block">{renterContact}</span>
        </div>
        <div className="md:col-span-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
            Tanggal Sewa
          </span>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-3 py-1 rounded border border-gray-200 dark:border-gray-600">
              {dateRange.start}
            </span>
            <span className="text-gray-400">-</span>
            <span className="font-semibold text-gray-900 dark:text-white bg-white dark:bg-gray-700 px-3 py-1 rounded border border-gray-200 dark:border-gray-600">
              {dateRange.end}
            </span>
            <span className="text-sm text-[#4338ca] font-medium ml-2">({dateRange.duration})</span>
          </div>
        </div>
        <div className="md:col-span-2">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1">
            Tujuan Sewa
          </span>
          <p className="text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
            {purpose}
          </p>
        </div>
      </div>
    </div>
  );
}
