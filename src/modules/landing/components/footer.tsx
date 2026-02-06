/** @format */

import Link from "next/link";
import { DEFAULT_LANDING_CONTENT, FOOTER_SECTIONS } from "../constants";
import type { FooterSection } from "@/types/landing-page";

type LandingFooterProps = {
  footer?: FooterSection;
  brandName?: string;
};

export function LandingFooter({ footer, brandName }: LandingFooterProps) {
  const fallback = DEFAULT_LANDING_CONTENT.footer;
  const data = {
    ...fallback,
    ...footer,
    columns:
      footer?.columns && footer.columns.length > 0 ? footer.columns : fallback.columns,
  };
  return (
    <footer className="bg-brand-deep text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-icons-outlined text-white text-3xl">token</span>
              <span className="font-bold text-xl">{brandName || "BUMDes"}</span>
            </div>
          </div>
          {(data.columns?.length ? data.columns : FOOTER_SECTIONS).map((section) => {
            const links = section.links.map((link) =>
              typeof link === "string" ? { label: link, url: "#" } : link
            );
            return (
            <div key={section.title}>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-indigo-200">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-indigo-100">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.url || "#"} className="hover:text-white transition">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
          })}
        </div>
        <div className="border-t border-indigo-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-indigo-300">
            {data.copyright_text || "© 2024 Koperasi Anggota. Hak cipta dilindungi."}
          </p>
          <div className="flex gap-6 text-xs text-indigo-300">
            <Link href={data.privacy_url || "#"} className="hover:text-white">
              Kebijakan privasi
            </Link>
            <Link href={data.terms_url || "#"} className="hover:text-white">
              Syarat dan ketentuan
            </Link>
            <Link href="#" className="hover:text-white">
              Pengaturan cookies
            </Link>
          </div>
          <div className="flex gap-4">
            {(data.social_links ?? []).length > 0
              ? data.social_links.map((item) => (
                  <Link
                    key={item.platform}
                    href={item.url || "#"}
                    className="text-indigo-300 hover:text-white"
                  >
                    <span className="material-icons-outlined text-lg">{item.platform}</span>
                  </Link>
                ))
              : null}
          </div>
        </div>
      </div>
    </footer>
  );
}
