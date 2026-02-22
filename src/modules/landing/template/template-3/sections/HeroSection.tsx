/** @format */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDgDGp4sZ1QtCeIypwMtPk6DYm4fXvTQeWm5xT-mK5GwKZXC33O0d7dbhXnayxY7ibirwzB9jDvcPuehKLKYmPwXdY85YQiBybn7yfOfbKvMA6lszYVSMbb0LeR0leSwWK4i3Q8c_AXQWTBKFEBKhS5YDkakW68bK25ZCKbCKhjOeHwV5dafvKrLFeZBEKCVKq652pxBa4sjvTTKxShBsMj4mQGUXIZbUsFIjx25ZiaZPBZIHuguWUEI27hXZ4TImz-nHZOSkOq6hzq";

type TemplateThreeHeroSectionProps = {
  data?: Record<string, any>;
};

export function TemplateThreeHeroSection({ data }: TemplateThreeHeroSectionProps) {
  const section = asRecord(data);

  const badgeText = asString(section.badge_text, "Koperasi Terpercaya");
  const titlePrefix = asString(section.title_prefix, "Membangun");
  const titleHighlight = asString(section.title_highlight, "Kesejahteraan");
  const subtitle = asString(
    section.subtitle,
    "Bergabunglah dengan ribuan anggota lainnya untuk masa depan finansial yang lebih baik melalui koperasi terpercaya, transparan, dan berorientasi pada anggota."
  );
  const primaryCtaLabel = asString(section.primary_cta_label, "Daftar Anggota");
  const secondaryCtaLabel = asString(section.secondary_cta_label, "Pelajari Lebih Lanjut");

  const parsedImages = asArray(section.collage_images)
    .map((item) => {
      const itemMap = asRecord(item);
      return asString(itemMap.image_url, "");
    })
    .filter((url) => url !== "");

  const collageImages = [...parsedImages];
  while (collageImages.length < 4) {
    collageImages.push(DEFAULT_IMAGE);
  }

  return (
    <section className="relative overflow-hidden bg-primary py-16 lg:py-24">
      <div className="absolute top-0 right-0 w-1/2 h-full bg-accent/10 -skew-x-12 transform translate-x-1/4"></div>
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-8 text-white">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-sm font-bold uppercase tracking-wider w-fit">
              <span className="size-2 bg-accent rounded-full animate-pulse"></span>
              {badgeText}
            </div>
            <h1 className="text-5xl lg:text-7xl font-black leading-[1.1] tracking-tight">
              {titlePrefix} <span className="text-accent">{titleHighlight}</span> Bersama
            </h1>
            <p className="text-indigo-100 text-xl font-light leading-relaxed max-w-xl">{subtitle}</p>
            <div className="flex flex-wrap gap-4 mt-4">
              <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-accent hover:bg-yellow-500 text-primary text-lg font-black transition-all shadow-xl shadow-accent/20">
                {primaryCtaLabel}
              </button>
              <button className="flex min-w-[180px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-white/10 border border-white/20 hover:bg-white/20 text-white text-lg font-bold backdrop-blur-sm transition-all">
                {secondaryCtaLabel}
              </button>
            </div>
          </div>

          <div className="hidden lg:grid grid-cols-6 grid-rows-6 gap-4 h-[550px]">
            <div className="col-span-3 row-span-4 rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${collageImages[0]}')` }}></div>
            </div>
            <div className="col-span-3 row-span-3 rounded-3xl overflow-hidden shadow-2xl -rotate-3 hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${collageImages[1]}')`, filter: "saturate(1.2)" }}></div>
            </div>
            <div className="col-span-2 row-span-3 rounded-3xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${collageImages[2]}')`, filter: "sepia(0.2)" }}></div>
            </div>
            <div className="col-span-4 row-span-2 rounded-3xl overflow-hidden shadow-2xl -rotate-1 hover:rotate-0 transition-transform duration-500 border-4 border-white/10">
              <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${collageImages[3]}')`, filter: "brightness(1.1)" }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
