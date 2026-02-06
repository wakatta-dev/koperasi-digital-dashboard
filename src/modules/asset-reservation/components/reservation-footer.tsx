/** @format */

import Link from "next/link";

import { FOOTER_SECTIONS } from "@/modules/landing/constants";

export function AssetReservationFooter() {
  return (
    <footer className="bg-brand-deep text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <span className="material-icons-outlined text-white text-3xl">token</span>
              <span className="font-bold text-xl">BUMDes</span>
            </div>
            <p className="text-indigo-200 text-sm leading-relaxed mb-4">
              Mitra terpercaya pembangunan ekonomi desa yang berkelanjutan dan mandiri.
            </p>
          </div>
          {FOOTER_SECTIONS.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-indigo-200">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-indigo-100">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-white transition">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-indigo-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-indigo-300">© 2024 BUMDes Sukamaju. Hak cipta dilindungi.</p>
          <div className="flex gap-6 text-xs text-indigo-300">
            <Link href="#" className="hover:text-white">
              Kebijakan privasi
            </Link>
            <Link href="#" className="hover:text-white">
              Syarat dan ketentuan
            </Link>
            <Link href="#" className="hover:text-white">
              Pengaturan cookies
            </Link>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-indigo-300 hover:text-white">
              <span className="material-icons-outlined text-lg">social_leaderboard</span>
            </Link>
            <Link href="#" className="text-indigo-300 hover:text-white">
              <span className="material-icons-outlined text-lg">camera_alt</span>
            </Link>
            <Link href="#" className="text-indigo-300 hover:text-white">
              <span className="material-icons-outlined text-lg">alternate_email</span>
            </Link>
            <Link href="#" className="text-indigo-300 hover:text-white">
              <span className="material-icons-outlined text-lg">smart_display</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
