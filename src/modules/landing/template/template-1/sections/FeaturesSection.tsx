/** @format */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_ITEMS = [
  {
    icon: "rocket_launch",
    title: "Pengiriman Cepat",
    description:
      "Layanan antar di hari yang sama untuk area dalam kota. Armada kami siap mengirim material ke lokasi proyek Anda tepat waktu.",
  },
  {
    icon: "verified_user",
    title: "Kualitas Terjamin",
    description:
      "Semua material yang kami jual telah melalui proses seleksi ketat dan memenuhi standar SNI untuk keamanan bangunan Anda.",
  },
  {
    icon: "savings",
    title: "Harga Kompetitif",
    description:
      "Dapatkan penawaran terbaik dengan harga grosir untuk pembelian dalam jumlah besar. Hemat biaya konstruksi Anda.",
  },
];

type TemplateOneFeaturesSectionProps = {
  data?: Record<string, any>;
};

export function TemplateOneFeaturesSection({ data }: TemplateOneFeaturesSectionProps) {
  const section = asRecord(data);
  const parsedItems = asArray(section.items)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        icon: asString(itemMap.icon, "check_circle"),
        title: asString(itemMap.title),
        description: asString(itemMap.description),
      };
    })
    .filter((item) => item.title !== "" || item.description !== "");

  const items = parsedItems.length > 0 ? parsedItems : DEFAULT_ITEMS;

  return (
    <section className="py-16 bg-white dark:bg-surface-dark border-y border-slate-100 dark:border-slate-800" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="flex flex-col items-start gap-4 p-6 rounded-xl bg-background-light dark:bg-background-dark/50 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-colors"
            >
              <div className="size-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[28px]">{item.icon}</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
