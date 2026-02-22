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

const SERVICE_CARD_VARIANTS = [
  {
    wrapper:
      "group relative bg-white p-10 rounded-[2.5rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300",
    iconBackground: "absolute top-0 right-0 p-8 text-primary/5",
    iconBackgroundSize: "material-symbols-outlined text-9xl",
    iconWrap:
      "size-20 bg-accent text-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
    title: "text-3xl font-black text-primary",
    description: "text-gray-600 text-lg leading-relaxed",
    link: "flex items-center gap-2 text-primary font-bold hover:gap-4 transition-all mt-4",
  },
  {
    wrapper:
      "group relative bg-primary p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden",
    iconBackground: "absolute -bottom-10 -right-10 text-white/5",
    iconBackgroundSize: "material-symbols-outlined text-[12rem]",
    iconWrap:
      "size-20 bg-white text-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform",
    title: "text-3xl font-black text-white",
    description: "text-indigo-100 text-lg leading-relaxed",
    link: "flex items-center gap-2 text-accent font-bold hover:gap-4 transition-all mt-4",
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
            const variant = SERVICE_CARD_VARIANTS[index % SERVICE_CARD_VARIANTS.length];
            return (
              <div key={`${item.title}-${index}`} className={variant.wrapper}>
                <div className={variant.iconBackground}>
                  <span className={variant.iconBackgroundSize}>{item.icon}</span>
                </div>

                <div className="relative z-10 flex flex-col gap-6">
                  <div className={variant.iconWrap}>
                    <span className="material-symbols-outlined text-4xl font-bold">{item.icon}</span>
                  </div>
                  <h3 className={variant.title}>{item.title}</h3>
                  <p className={variant.description}>{item.description}</p>
                  <a className={variant.link} href="#">
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
