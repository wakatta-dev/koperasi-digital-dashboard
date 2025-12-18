/** @format */

export function Pagination() {
  return (
    <div className="mt-12 flex justify-center">
      <nav className="flex items-center gap-2">
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition disabled:opacity-50">
          <span className="material-icons-outlined text-sm">chevron_left</span>
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#4338ca] text-white font-medium shadow-md shadow-indigo-500/20">
          1
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          2
        </button>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          3
        </button>
        <span className="px-2 text-gray-500 dark:text-gray-400">...</span>
        <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
          <span className="material-icons-outlined text-sm">chevron_right</span>
        </button>
      </nav>
    </div>
  );
}
