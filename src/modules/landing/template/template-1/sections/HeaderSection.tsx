/** @format */

import { asArray, asHref, asRecord, asString } from "../../shared/content";

const DEFAULT_LINKS = [
  { label: "Tentang", url: "#about" },
  { label: "Produk", url: "#products" },
  { label: "Layanan", url: "#features" },
  { label: "Kontak", url: "#contact" },
];

type TemplateOneHeaderSectionProps = {
  data?: Record<string, any>;
};

export function TemplateOneHeaderSection({ data }: TemplateOneHeaderSectionProps) {
  const section = asRecord(data);
  const brandName = asString(section.brand_name, "Toko Bangunan");
  const ctaLabel = asString(section.cta_label, "Mulai Belanja");

  const parsedLinks = asArray(section.nav_links)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        label: asString(itemMap.label),
        url: asHref(itemMap.url),
      };
    })
    .filter((item) => item.label !== "");

  const navLinks = parsedLinks.length > 0 ? parsedLinks : DEFAULT_LINKS;

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
              <span className="material-symbols-outlined">construction</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{brandName}</h2>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={`${link.label}-${link.url}`}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors"
                href={link.url}
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex bg-primary hover:bg-primary-hover text-white text-sm font-bold py-2.5 px-5 rounded-lg transition-colors items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
              {ctaLabel}
            </button>
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-300">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
