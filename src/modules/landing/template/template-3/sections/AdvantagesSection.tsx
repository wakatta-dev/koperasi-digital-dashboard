/** @format */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_ITEMS = [
  {
    icon: "verified_user",
    title: "Transparansi",
    description: "Setiap transaksi dan laporan keuangan dikelola secara terbuka dan dapat diakses oleh seluruh anggota kapan saja.",
  },
  {
    icon: "percent",
    title: "Bunga Rendah",
    description: "Nikmati fasilitas pinjaman dengan suku bunga yang kompetitif dan bersahabat untuk mendukung usaha Anda.",
  },
  {
    icon: "rocket_launch",
    title: "Proses Cepat",
    description: "Layanan administrasi yang modern dan efisien memastikan pengajuan keanggotaan dan pinjaman diproses dengan cepat.",
  },
];

type TemplateThreeAdvantagesSectionProps = {
  data?: Record<string, any>;
};

export function TemplateThreeAdvantagesSection({ data }: TemplateThreeAdvantagesSectionProps) {
  const section = asRecord(data);

  const label = asString(section.label, "Kenapa Memilih Kami");
  const title = asString(section.title, "Keunggulan Koperasi Sejahtera");
  const description = asString(
    section.description,
    "Kami berkomitmen memberikan pelayanan terbaik dengan prinsip koperasi yang modern dan mengutamakan kesejahteraan anggota."
  );

  const parsedItems = asArray(section.items)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        icon: asString(itemMap.icon, "check_circle"),
        title: asString(itemMap.title),
        description: asString(itemMap.description),
      };
    })
    .filter((item) => item.title !== "");
  const items = parsedItems.length > 0 ? parsedItems : DEFAULT_ITEMS;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute -left-1/4 top-0 w-1/2 h-full bg-accent/5 -skew-x-12"></div>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-primary font-bold uppercase tracking-[0.2em] text-sm">{label}</span>
          <h2 className="text-primary text-4xl lg:text-5xl font-black mt-4">{title}</h2>
          <p className="text-gray-600 text-lg mt-6 font-medium">{description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => {
            const isAccent = index % 2 === 1;
            return (
              <div
                key={`${item.title}-${index}`}
                className="bg-off-white p-8 rounded-[2rem] border border-gray-100 hover:shadow-xl transition-all duration-300 group"
              >
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform ${
                    isAccent ? "bg-accent text-primary" : "bg-primary text-white"
                  }`}
                >
                  <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
