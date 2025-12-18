/** @format */

type StatusHeaderProps = {
  requestId: string;
  submittedAt: string;
};

export function StatusHeader({ requestId, submittedAt }: StatusHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Detail Permintaan Sewa</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          ID Permintaan:{" "}
          <span className="font-mono font-semibold text-[#4338ca]">{requestId}</span>
        </p>
      </div>
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 px-3 py-1.5 rounded-lg border border-gray-100 dark:border-gray-700">
        <span className="material-icons-outlined text-lg">calendar_today</span>
        <span>{submittedAt}</span>
      </div>
    </div>
  );
}
