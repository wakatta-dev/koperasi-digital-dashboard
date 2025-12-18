/** @format */

export function SecureInfoBar() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 flex justify-between items-center gap-4">
      <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-full">
        <span className="material-icons-outlined text-lg">lock</span>
        <span>Halaman Tamu Aman</span>
      </div>
      <a className="text-sm font-medium text-[#4338ca] hover:text-indigo-600 transition ml-auto" href="#">
        Bantuan?
      </a>
    </div>
  );
}
