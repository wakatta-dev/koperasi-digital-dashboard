/** @format */

import { asArray, asHref, asRecord, asString } from "../../shared/content";

const DEFAULT_CATEGORY_LINKS = [
  { label: "Produk UMKM", url: "#" },
  { label: "Wisata Desa", url: "#" },
  { label: "Layanan Jasa", url: "#" },
  { label: "Sewaan Alat", url: "#" },
];

type TemplateTwoFooterSectionProps = {
  data?: Record<string, any>;
};

export function TemplateTwoFooterSection({ data }: TemplateTwoFooterSectionProps) {
  const section = asRecord(data);

  const brandName = asString(section.brand_name, "Pasar");
  const brandHighlight = asString(section.brand_highlight, "Desa");
  const description = asString(
    section.description,
    "Platform digital BUMDes Maju untuk menghubungkan potensi desa dengan pasar global, dikelola dengan semangat gotong royong."
  );
  const contactPhone = asString(section.contact_phone, "+62 812 3456 7890");
  const contactEmail = asString(section.contact_email, "halo@bumdesmaju.id");
  const contactAddress = asString(section.contact_address, "Balai Desa Maju No. 1");
  const copyrightText = asString(
    section.copyright_text,
    "© 2024 BUMDes Maju. Dibuat dengan cinta untuk desa."
  );

  const parsedCategoryLinks = asArray(section.category_links)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        label: asString(itemMap.label),
        url: asHref(itemMap.url),
      };
    })
    .filter((item) => item.label !== "");

  const categoryLinks = parsedCategoryLinks.length > 0 ? parsedCategoryLinks : DEFAULT_CATEGORY_LINKS;

  return (
    <footer className="bg-village-dark text-white pt-16 pb-8 px-6 md:px-12 lg:px-20 rounded-t-[3rem] mt-auto relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-market-yellow via-market-red to-market-blue"></div>
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="size-10 flex items-center justify-center rounded-xl bg-market-yellow text-village-dark">
                <span className="material-symbols-outlined text-2xl">storefront</span>
              </div>
              <span className="text-2xl font-black tracking-tight">
                {brandName}
                <span className="text-market-yellow">{brandHighlight}</span>
              </span>
            </div>
            <p className="text-white/70 font-medium max-w-sm leading-relaxed">{description}</p>
          </div>

          <div>
            <h5 className="font-black text-lg mb-6 text-market-yellow">Kategori</h5>
            <ul className="space-y-3 font-bold text-white/60">
              {categoryLinks.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <a className="hover:text-white transition-colors" href={link.url}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h5 className="font-black text-lg mb-6 text-market-yellow">Kontak</h5>
            <ul className="space-y-3 font-bold text-white/60">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">call</span>
                {contactPhone}
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">mail</span>
                {contactEmail}
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">location_on</span>
                {contactAddress}
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 gap-6">
          <p className="text-sm font-bold text-white/40">{copyrightText}</p>
          <div className="flex gap-4">
            <a
              className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-market-blue transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">public</span>
            </a>
            <a
              className="size-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-market-red transition-colors"
              href="#"
            >
              <span className="material-symbols-outlined text-sm">favorite</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
