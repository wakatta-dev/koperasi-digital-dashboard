/** @format */

import { asArray, asHref, asRecord, asString } from "../../shared/content";

const DEFAULT_SERVICE_LINKS = [
  { label: "Simpanan", url: "#" },
  { label: "Pinjaman", url: "#" },
  { label: "Investasi", url: "#" },
];

const DEFAULT_COMPANY_LINKS = [
  { label: "Tentang Kami", url: "#" },
  { label: "Karir", url: "#" },
  { label: "Kontak", url: "#" },
];

const DEFAULT_HELP_LINKS = [
  { label: "Pusat Bantuan", url: "#" },
  { label: "Syarat & Ketentuan", url: "#" },
  { label: "Kebijakan Privasi", url: "#" },
];

type TemplateThreeFooterSectionProps = {
  data?: Record<string, any>;
};

function parseLinks(value: unknown, fallback: Array<{ label: string; url: string }>) {
  const parsed = asArray(value)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        label: asString(itemMap.label),
        url: asHref(itemMap.url),
      };
    })
    .filter((item) => item.label !== "");

  return parsed.length > 0 ? parsed : fallback;
}

export function TemplateThreeFooterSection({ data }: TemplateThreeFooterSectionProps) {
  const section = asRecord(data);

  const brandName = asString(section.brand_name, "Koperasi Sejahtera");
  const description = asString(
    section.description,
    "Mitra terpercaya untuk pertumbuhan ekonomi anda dan keluarga."
  );
  const copyrightText = asString(section.copyright_text, "© 2023 Koperasi Sejahtera. All rights reserved.");

  const serviceLinks = parseLinks(section.service_links, DEFAULT_SERVICE_LINKS);
  const companyLinks = parseLinks(section.company_links, DEFAULT_COMPANY_LINKS);
  const helpLinks = parseLinks(section.help_links, DEFAULT_HELP_LINKS);

  return (
    <footer className="bg-primary pt-20 pb-10 text-white">
      <div className="max-w-[1280px] mx-auto px-4 lg:px-10">
        <div className="flex flex-col md:flex-row justify-between gap-12">
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <div className="size-10 bg-accent text-primary rounded-xl flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">account_balance</span>
              </div>
              <span className="font-black text-2xl tracking-tight">{brandName}</span>
            </div>
            <p className="text-indigo-100 text-lg max-w-xs leading-relaxed">{description}</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-20">
            <div className="flex flex-col gap-6">
              <h3 className="text-accent font-black text-sm uppercase tracking-[0.2em]">Layanan</h3>
              <div className="flex flex-col gap-4">
                {serviceLinks.map((link, index) => (
                  <a key={`${link.label}-${index}`} className="text-indigo-50 hover:text-accent transition-colors" href={link.url}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-accent font-black text-sm uppercase tracking-[0.2em]">Perusahaan</h3>
              <div className="flex flex-col gap-4">
                {companyLinks.map((link, index) => (
                  <a key={`${link.label}-${index}`} className="text-indigo-50 hover:text-accent transition-colors" href={link.url}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <h3 className="text-accent font-black text-sm uppercase tracking-[0.2em]">Bantuan</h3>
              <div className="flex flex-col gap-4">
                {helpLinks.map((link, index) => (
                  <a key={`${link.label}-${index}`} className="text-indigo-50 hover:text-accent transition-colors" href={link.url}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-indigo-200 text-sm font-medium">{copyrightText}</p>
          <div className="flex gap-6">
            <a className="text-indigo-200 hover:text-accent transition-all hover:scale-110" href="#">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
              </svg>
            </a>
            <a className="text-indigo-200 hover:text-accent transition-all hover:scale-110" href="#">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772 4.902 4.902 0 011.772-1.153c.636-.247 1.363-.416 2.427-.465 1.067-.047 1.409-.06 3.809-.06h.63zm1.418 2.003l-.31.004c-2.647.007-2.996.018-4.042.065-1.01.046-1.56.23-1.924.372-.479.189-.82.414-1.176.77-.356.356-.581.697-.77 1.176-.141.365-.325.914-.372 1.924-.047 1.046-.058 1.396-.065 4.042v.31c.007 2.647.018 2.996.065 4.042.046 1.01.23 1.56.372 1.924.189.479.414.82.77 1.176.356.356.697.581 1.176.77.365.141.914.325 1.924.372 1.046.047 1.396.058 4.042.065h.31c2.647-.007 2.996-.018 4.042-.065 1.01-.046 1.56-.23 1.924-.372.479-.189.82-.414 1.176-.77.356-.356.581-.697.77-1.176.141-.365.325-.914.372-1.924.047-1.046.058-1.396.065-4.042v-.31c-.007-2.647-.018-2.996-.065-4.042-.046-1.01-.23-1.56-.372-1.924-.189-.479-.414-.82-.77-1.176-.356-.356-.697-.581-1.176-.77-.365-.141-.914-.325-1.924-.372-1.046-.047-1.396-.058-4.042-.065h-.31zM12 7a5 5 0 110 10 5 5 0 010-10zm0 2a3 3 0 100 6 3 3 0 000-6zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
