/** @format */

import { asArray, asHref, asRecord, asString } from "../../shared/content";

const DEFAULT_MAP_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAlOD1O90KMVCG9BTV-JmAx3rwRE2Y1NWeKcW0bR3v9wWA5aUQiC4u_T2kMggZAFj8xjKTW4r0Pwa845ATKwRTcGdbFT-w2j4yO8SXvvwVJtge51gNbdWGEdKboGqpzoyrGJe9Cil575_BQnKeJUqOWbI33V0y3uVppmdTwbJSPpDnLcug-pEtUeuFvHKvkcy5FlbkLDhlWSOhV-Z2VBJFmeV9k_r7NvtXY4GtlZuscVYpwPdym1hq0ZJQbt2VAuXQNSJb5wLr8nLcQ";

const DEFAULT_COMPANY_LINKS = [
  { label: "Tentang Kami", url: "#" },
  { label: "Karir", url: "#" },
  { label: "Blog", url: "#" },
  { label: "Kebijakan Privasi", url: "#" },
];

const DEFAULT_CATEGORY_LINKS = [
  { label: "Semen & Pasir", url: "#" },
  { label: "Besi & Baja", url: "#" },
  { label: "Cat & Finishing", url: "#" },
  { label: "Alat Pertukangan", url: "#" },
  { label: "Listrik & Lampu", url: "#" },
];

type TemplateOneFooterSectionProps = {
  data?: Record<string, any>;
};

export function TemplateOneFooterSection({ data }: TemplateOneFooterSectionProps) {
  const section = asRecord(data);

  const brandName = asString(section.brand_name, "Toko Bangunan");
  const description = asString(
    section.description,
    "Menyediakan material bangunan berkualitas terbaik untuk mewujudkan hunian dan gedung impian Anda sejak 2008."
  );
  const mapImageUrl = asString(section.map_image_url, DEFAULT_MAP_IMAGE);
  const addressText = asString(
    section.address_text,
    "Jl. Raya Konstruksi No. 88\nJakarta Selatan, 12345\nIndonesia"
  );
  const copyrightText = asString(section.copyright_text, "© 2024 Toko Bangunan. All rights reserved.");
  const creditsText = asString(section.credits_text, "Designed for UMKM Indonesia");

  const parsedCompanyLinks = asArray(section.company_links)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        label: asString(itemMap.label),
        url: asHref(itemMap.url),
      };
    })
    .filter((item) => item.label !== "");

  const parsedCategoryLinks = asArray(section.category_links)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        label: asString(itemMap.label),
        url: asHref(itemMap.url),
      };
    })
    .filter((item) => item.label !== "");

  const companyLinks = parsedCompanyLinks.length > 0 ? parsedCompanyLinks : DEFAULT_COMPANY_LINKS;
  const categoryLinks = parsedCategoryLinks.length > 0 ? parsedCategoryLinks : DEFAULT_CATEGORY_LINKS;

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8" id="contact">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="size-8 bg-primary rounded flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-[20px]">construction</span>
              </div>
              <h2 className="text-lg font-bold">{brandName}</h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
            <div className="flex gap-4 mt-2">
              <a className="text-slate-400 hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined">social_leaderboard</span>
              </a>
              <a className="text-slate-400 hover:text-white transition-colors" href="#">
                <span className="material-symbols-outlined">photo_camera</span>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-200">Perusahaan</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              {companyLinks.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <a className="hover:text-primary transition-colors" href={link.url}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-200">Kategori</h3>
            <ul className="flex flex-col gap-3 text-sm text-slate-400">
              {categoryLinks.map((link, index) => (
                <li key={`${link.label}-${index}`}>
                  <a className="hover:text-primary transition-colors" href={link.url}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 text-slate-200">Lokasi Toko</h3>
            <div
              className="w-full h-32 bg-slate-800 rounded-lg mb-4 bg-cover bg-center opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
              data-alt="Map showing the location of the store in Jakarta"
              data-location="Jakarta"
              style={{ backgroundImage: `url('${mapImageUrl}')` }}
            ></div>
            <p className="text-sm text-slate-400 whitespace-pre-line">{addressText}</p>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">{copyrightText}</p>
          <p className="text-sm text-slate-500">{creditsText}</p>
        </div>
      </div>
    </footer>
  );
}
