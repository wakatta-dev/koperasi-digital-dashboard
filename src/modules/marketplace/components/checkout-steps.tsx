/** @format */

const STEPS = [
  { label: "Keranjang", icon: "shopping_cart", active: true },
  { label: "Pengiriman", icon: "local_shipping" },
  { label: "Pembayaran", icon: "payments" },
  { label: "Ulasan", icon: "rate_review" },
];

export function CheckoutSteps() {
  return (
    <div className="w-full max-w-4xl mx-auto mb-16 pt-2">
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full z-0"></div>
        {STEPS.map((step) => (
          <div key={step.label} className="relative flex flex-col items-center z-10 group cursor-default">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg ring-4 ring-[#f8fafc] dark:ring-[#0f172a] transition ${
                step.active
                  ? "bg-[#4338ca] shadow-indigo-500/40 transform group-hover:scale-105"
                  : "bg-white dark:bg-[#1e293b] border-2 border-gray-300 dark:border-gray-600 text-gray-400"
              }`}
            >
              <span className="material-icons-outlined text-2xl">{step.icon}</span>
            </div>
            <div className="absolute -bottom-9 w-32 text-center">
              <span
                className={`text-sm ${step.active ? "font-bold text-[#4338ca] dark:text-indigo-400" : "font-medium text-gray-500 dark:text-gray-400"}`}
              >
                {step.label}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
