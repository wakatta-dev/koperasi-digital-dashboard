/** @format */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCgqMyuETXIwggaCHOQmSwon3QwBIBEV8mC2gaw_sZyKv3ZX1KAcI6zq7eMagDVt0j2Ayxh-zLzqKJDpJtC5i3C68jxYhWT0TuK9S6NGUfEnodi921z00C892y7eqMQtI-40j48CVmTT1ld_cBc8NnisO2u_lBwnSXI-9c6_j4mpfyZr0aNUtBkMHsFkHwNG4WydV6dqx3JvCe0TutkPl5hzfTasPhbPMVxrktPJLUvPBzvc9geliwaX9nOCAxDPQOvHvAWxB2tVepU";

const DEFAULT_HIGHLIGHTS = [
  { text: "Stok material terlengkap dan ready stock" },
  { text: "Bekerjasama dengan kontraktor ternama" },
  { text: "Konsultasi gratis kebutuhan material" },
];

type TemplateOneAboutSectionProps = {
  data?: Record<string, any>;
};

export function TemplateOneAboutSection({ data }: TemplateOneAboutSectionProps) {
  const section = asRecord(data);
  const sectionLabel = asString(section.section_label, "Tentang Kami");
  const title = asString(section.title, "Pengalaman & Kepercayaan Sejak 2008");
  const description = asString(
    section.description,
    "Kami telah melayani ratusan proyek konstruksi, mulai dari renovasi rumah kecil hingga pembangunan gedung bertingkat. Sebagai one-stop solution untuk kebutuhan bangunan, kami berkomitmen memberikan pelayanan terbaik."
  );
  const experienceValue = asString(section.experience_value, "15+");
  const experienceTextRaw = asString(
    section.experience_text,
    "Tahun Pengalaman Melayani Konstruksi Indonesia"
  );
  const experienceText = experienceTextRaw.replace(/^\s*\d+\+?\s*/u, "").trim();
  const imageUrl = asString(section.image_url, DEFAULT_IMAGE);

  const parsedHighlights = asArray(section.highlights)
    .map((item) => {
      const itemMap = asRecord(item);
      return { text: asString(itemMap.text) };
    })
    .filter((item) => item.text !== "");
  const highlights = parsedHighlights.length > 0 ? parsedHighlights : DEFAULT_HIGHLIGHTS;

  return (
    <section className="py-20 bg-background-light dark:bg-background-dark" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1 relative">
            <div
              className="w-full aspect-video md:aspect-square bg-center bg-cover rounded-2xl shadow-lg"
              data-alt="Interior of a large warehouse stocked with building materials"
              style={{ backgroundImage: `url('${imageUrl}')` }}
            ></div>
            <div className="absolute -bottom-6 -right-6 bg-primary text-white p-6 rounded-xl shadow-xl hidden lg:block max-w-xs">
              <p className="text-3xl font-black mb-1">{experienceValue}</p>
              <p className="text-sm font-medium opacity-90">{experienceText}</p>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="text-primary font-bold text-sm tracking-wide uppercase mb-2">{sectionLabel}</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">{title}</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{description}</p>

            <ul className="space-y-4 mb-8">
              {highlights.map((item, index) => (
                <li key={`${item.text}-${index}`} className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-green-500">check_circle</span>
                  <span className="text-slate-700 dark:text-slate-300 font-medium">{item.text}</span>
                </li>
              ))}
            </ul>

            <a
              className="text-primary font-bold hover:text-primary-hover inline-flex items-center gap-1 transition-colors"
              href="#"
            >
              Pelajari Selengkapnya
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
