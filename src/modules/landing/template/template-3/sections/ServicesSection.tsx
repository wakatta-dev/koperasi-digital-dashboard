/** @format */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_ITEMS = [
  {
    icon: "savings",
    title: "Simpanan Pokok",
    description: "Investasi awal yang ringan dan terjangkau untuk mendapatkan status keanggotaan seumur hidup dengan berbagai benefit.",
  },
  {
    icon: "payments",
    title: "Pinjaman Modal",
    description: "Bunga rendah yang kompetitif dan proses pencairan cepat untuk mendukung pengembangan usaha mikro dan kecil anda.",
  },
  {
    icon: "pie_chart",
    title: "Sisa Hasil Usaha",
    description: "Keuntungan tahunan koperasi yang dibagikan secara adil dan proporsional kepada setiap anggota aktif.",
  },
];

type TemplateThreeServicesSectionProps = {
  data?: Record<string, any>;
};

export function TemplateThreeServicesSection({ data }: TemplateThreeServicesSectionProps) {
  const section = asRecord(data);

  const label = asString(section.label, "Produk & Layanan");
  const title = asString(section.title, "Solusi Keuangan Untuk Anggota");
  const description = asString(
    section.description,
    "Kami menyediakan berbagai layanan simpan pinjam yang transparan, aman, dan menguntungkan untuk pertumbuhan ekonomi anda."
  );

  const parsedItems = asArray(section.items)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        icon: asString(itemMap.icon, "account_balance"),
        title: asString(itemMap.title),
        description: asString(itemMap.description),
      };
    })
    .filter((item) => item.title !== "");

  const items = parsedItems.length > 0 ? parsedItems : DEFAULT_ITEMS;

  return (
    <section className="py-24 bg-off-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10">
        <div className="mb-16">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm">{label}</span>
          <h2 className="text-primary text-4xl lg:text-5xl font-black mt-4">{title}</h2>
          <p className="text-gray-600 text-lg mt-6 max-w-2xl font-medium">{description}</p>
        </div>

        <div className="staggered-grid grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-12">
          {items.map((item, index) => {
            const isPrimary = index % 2 === 1;
            return (
              <div
                key={`${item.title}-${index}`}
                className={`group relative p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ${
                  isPrimary
                    ? "bg-primary overflow-hidden"
                    : "bg-white border border-gray-100"
                }`}
              >
                <div className={`absolute ${isPrimary ? "-bottom-10 -right-10 text-white/5" : "top-0 right-0 p-8 text-primary/5"}`}>
                  <span className={`material-symbols-outlined ${isPrimary ? "text-[12rem]" : "text-9xl"}`}>{item.icon}</span>
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                  <div
                    className={`size-20 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform ${
                      isPrimary ? "bg-white text-primary" : "bg-accent text-primary"
                    }`}
                  >
                    <span className="material-symbols-outlined text-4xl font-bold">{item.icon}</span>
                  </div>
                  <h3 className={`text-3xl font-black ${isPrimary ? "text-white" : "text-primary"}`}>{item.title}</h3>
                  <p className={`text-lg leading-relaxed ${isPrimary ? "text-indigo-100" : "text-gray-600"}`}>{item.description}</p>
                  <a
                    className={`flex items-center gap-2 font-bold hover:gap-4 transition-all mt-4 ${
                      isPrimary ? "text-accent" : "text-primary"
                    }`}
                    href="#"
                  >
                    Selengkapnya <span className="material-symbols-outlined">arrow_forward</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
