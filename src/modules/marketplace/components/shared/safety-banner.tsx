/** @format */

export function SafetyBanner() {
  return (
    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-5 border border-indigo-100 dark:border-indigo-800/50">
      <div className="flex items-center gap-3 mb-3">
        <span className="material-icons-outlined text-indigo-600 dark:text-indigo-300 text-2xl">
          verified_user
        </span>
        <h4 className="font-bold text-indigo-600 dark:text-indigo-300">Transaksi Aman</h4>
      </div>
      <p className="text-xs text-indigo-800 dark:text-indigo-200 leading-relaxed">
        Dana Anda akan diteruskan ke penjual setelah barang diterima dengan baik. Jaminan uang kembali jika barang
        tidak sesuai.
      </p>
    </div>
  );
}
