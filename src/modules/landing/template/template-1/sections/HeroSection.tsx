/** @format */

import { asRecord, asString } from "../../shared/content";

const DEFAULT_HERO_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCS0LS_cDMsdTGkvx4Ug_xecTV0hoeGDFxuLFzvIXHTtuICLhXMV2K9RORFFE3hr3JBQSLHAEagrT3BB-qFGaO249TwYkh_jJkmZcEciGDg3STP4ry9A9jERlX23nexBXJxGWIpA5Ou6mfKcv6yRsWe1pW06Evi2ycw5j5h1ckpnjUZYR9wpCOgGDAT0iylwWzW3N97J5gYxynAai2mzQbqpyTTbtak9YY4B8g9m2waH3Rw57G2-iGcREOF9xOZlORpOU2CdnqDg83x";

type TemplateOneHeroSectionProps = {
  data?: Record<string, any>;
};

export function TemplateOneHeroSection({ data }: TemplateOneHeroSectionProps) {
  const section = asRecord(data);

  const badgeText = asString(section.badge_text, "Tersedia Pengiriman Hari Ini");
  const headline = asString(section.headline, "Solusi Kebutuhan");
  const headlineHighlight = asString(section.headline_highlight, "Bangunan Anda");
  const subheadline = asString(
    section.subheadline,
    "Mitra terpercaya untuk segala proyek konstruksi dan renovasi rumah. Kami menyediakan material berkualitas tinggi dengan harga kompetitif dan pengiriman cepat langsung ke lokasi proyek."
  );
  const primaryCtaLabel = asString(section.primary_cta_label, "Lihat Katalog");
  const secondaryCtaLabel = asString(section.secondary_cta_label, "Hubungi Sales");
  const heroImage = asString(section.hero_image_url, DEFAULT_HERO_IMAGE);
  const deliveryStatusLabel = asString(section.delivery_status_label, "Status Pengiriman");
  const deliveryStatusValue = asString(section.delivery_status_value, "Sedang Dikirim");

  return (
    <section className="relative bg-background-light dark:bg-background-dark overflow-hidden py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-primary text-xs font-semibold w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              {badgeText}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              {headline} <br />
              <span className="text-primary">{headlineHighlight}</span>
            </h1>

            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">{subheadline}</p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <button className="bg-primary hover:bg-primary-hover text-white text-base font-bold h-12 px-8 rounded-lg transition-colors flex items-center justify-center gap-2">
                {primaryCtaLabel}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
              <button className="bg-white dark:bg-surface-dark border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 text-base font-medium h-12 px-8 rounded-lg transition-colors flex items-center justify-center">
                {secondaryCtaLabel}
              </button>
            </div>

            <div className="flex items-center gap-6 mt-6 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <span>Barang Original</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">check_circle</span>
                <span>Garansi Resmi</span>
              </div>
            </div>
          </div>

          <div className="relative lg:h-full min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-2xl transform rotate-3 scale-95 z-0"></div>
            <div
              className="relative w-full h-full min-h-[400px] bg-center bg-cover rounded-2xl shadow-xl z-10"
              data-alt="Modern construction site with workers and materials stacked neatly"
              style={{ backgroundImage: `url('${heroImage}')` }}
            ></div>
            <div className="absolute -bottom-6 -left-6 bg-surface-light dark:bg-surface-dark p-4 rounded-xl shadow-lg border border-slate-100 dark:border-slate-800 z-20 hidden sm:block">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full text-green-600">
                  <span className="material-symbols-outlined">local_shipping</span>
                </div>
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{deliveryStatusLabel}</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{deliveryStatusValue}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
