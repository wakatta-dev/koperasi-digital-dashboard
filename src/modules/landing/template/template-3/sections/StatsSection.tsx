/** @format */
/* eslint-disable react/no-unescaped-entities */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_BG_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAkfO8dTiRq_gXn6wRIQpoHqqJQ6kcxwhK69Ain8pc366YIVzMDpJd-SrOqYPK6_CCy2WPkHQG5MP78YkxrMVziWv8cmakMjaQbq53bYcAm8xuSAUlPX0cbOdhQxtL2Yhtydrv8lrPlpTW9VYMCfmz_E43ENexcpEHb0DhgOIpphc2Gh8S7Sh2kBMojRuX0AlOvnMuyXZ_zfMfnIBW4x372e0yDS-aCg-9d1gU2G_F_SXMjIHo0hlKdS6VEQEw-eE6eITNEKC42U_gF";

const DEFAULT_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDgDGp4sZ1QtCeIypwMtPk6DYm4fXvTQeWm5xT-mK5GwKZXC33O0d7dbhXnayxY7ibirwzB9jDvcPuehKLKYmPwXdY85YQiBybn7yfOfbKvMA6lszYVSMbb0LeR0leSwWK4i3Q8c_AXQWTBKFEBKhS5YDkakW68bK25ZCKbCKhjOeHwV5dafvKrLFeZBEKCVKq652pxBa4sjvTTKxShBsMj4mQGUXIZbUsFIjx25ZiaZPBZIHuguWUEI27hXZ4TImz-nHZOSkOq6hzq";

const DEFAULT_STATS = [
  { value: "15K+", label: "Total Anggota" },
  { value: "25M", label: "Dana Tersalurkan (IDR)" },
  { value: "2008", label: "Tahun Berdiri" },
  { value: "98%", label: "Tingkat Kepuasan" },
];

const DEFAULT_TESTIMONIALS = [
  {
    name: "Budi Santoso",
    role: "Pengusaha Mikro",
    quote: "Berkat pinjaman modal dari Koperasi Sejahtera, usaha warung sembako saya bisa berkembang pesat. Prosesnya sangat mudah dan transparan.",
    avatar_url: DEFAULT_AVATAR,
  },
  {
    name: "Siti Aminah",
    role: "Anggota Sejak 2015",
    quote: "SHU yang dibagikan setiap tahun sangat membantu keuangan keluarga. Saya merasa benar-benar memiliki koperasi ini.",
    avatar_url: DEFAULT_AVATAR,
  },
  {
    name: "Rahmat Hidayat",
    role: "Pegawai Swasta",
    quote: "Layanan simpan pinjam yang sangat membantu, terutama saat ada kebutuhan mendesak. Bunganya sangat ringan dibandingkan tempat lain.",
    avatar_url: DEFAULT_AVATAR,
  },
];

type TemplateThreeStatsSectionProps = {
  data?: Record<string, any>;
};

export function TemplateThreeStatsSection({ data }: TemplateThreeStatsSectionProps) {
  const section = asRecord(data);

  const label = asString(section.label, "Statistik Kami");
  const title = asString(section.title, "Tumbuh Bersama Anggota Sejak Awal Berdiri");
  const description = asString(
    section.description,
    "Konsistensi dan kepercayaan adalah kunci pertumbuhan kami. Berikut adalah pencapaian yang telah kami raih bersama para anggota setia Koperasi Sejahtera."
  );

  const parsedStatsItems = asArray(section.stats_items)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        value: asString(itemMap.value),
        label: asString(itemMap.label),
      };
    })
    .filter((item) => item.value !== "" || item.label !== "");
  const statsItems = parsedStatsItems.length > 0 ? parsedStatsItems : DEFAULT_STATS;

  const parsedTestimonials = asArray(section.testimonials)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        name: asString(itemMap.name),
        role: asString(itemMap.role),
        quote: asString(itemMap.quote),
        avatar_url: asString(itemMap.avatar_url, DEFAULT_AVATAR),
      };
    })
    .filter((item) => item.name !== "" || item.quote !== "");
  const testimonials = parsedTestimonials.length > 0 ? parsedTestimonials : DEFAULT_TESTIMONIALS;

  return (
    <section className="py-24 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `url('${DEFAULT_BG_IMAGE}')` }}></div>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-accent font-bold uppercase tracking-[0.2em] text-sm">{label}</span>
            <h2 className="text-white text-4xl lg:text-5xl font-black mt-4 mb-8">{title}</h2>
            <p className="text-indigo-100 text-lg mb-10 leading-relaxed">{description}</p>
            <div className="grid grid-cols-2 gap-8">
              {statsItems.map((item, index) => (
                <div key={`${item.label}-${index}`}>
                  <div className="text-5xl font-black text-accent mb-2">{item.value}</div>
                  <div className="text-indigo-200 font-medium text-lg">{item.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-[2.5rem] relative">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 size-40 bg-accent/20 rounded-full blur-3xl"></div>
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-accent">forum</span>
                Kata Anggota Kami
              </h3>

              {testimonials.map((item, index) => (
                <div
                  key={`${item.name}-${index}`}
                  className="bg-white/10 p-6 rounded-2xl border border-white/5 hover:bg-white/15 transition-colors"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className="size-12 rounded-full bg-cover bg-center"
                      style={{ backgroundImage: `url('${item.avatar_url}')` }}
                    ></div>
                    <div>
                      <h4 className="text-white font-bold">{item.name}</h4>
                      <p className="text-accent text-sm">{item.role}</p>
                    </div>
                  </div>
                  <p className="text-indigo-100 italic">"{item.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
