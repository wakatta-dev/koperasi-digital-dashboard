/** @format */

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { HERO_IMAGES, HERO_TEXT } from "../constants";

export function LandingHero() {
  return (
    <header className="pt-32 pb-16 lg:pt-40 lg:pb-24 bg-[#f8fafc] dark:bg-[#0f172a] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10 relative">
            <h1 className="text-4xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight">
              Bangun Ekonomi Desa, <br className="hidden lg:block" />
              Majukan Masyarakat <br className="hidden lg:block" />
              Bersama{" "}
              <span className="text-[#4338ca]">{HERO_TEXT.highlight}</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-lg leading-relaxed">
              {HERO_TEXT.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                asChild
                className="bg-[#4338ca] hover:bg-[#3730a3] text-white px-8 py-3.5 rounded-full font-semibold transition shadow-lg shadow-indigo-500/30"
              >
                <Link href="#products">Jelajahi Produk Desa</Link>
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] lg:h-[600px] w-full mt-8 lg:mt-0">
            <div className="absolute right-0 top-0 w-3/4 h-[85%] rounded-2xl overflow-hidden shadow-2xl z-10 transform translate-x-4 lg:translate-x-0">
              <img
                src={HERO_IMAGES.main}
                alt="Suasana pasar tradisional desa"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute left-0 bottom-0 w-1/2 h-1/2 rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-[#0f172a] z-20 transform -translate-y-8 lg:translate-y-0">
              <img
                src={HERO_IMAGES.inset}
                alt="Warga desa berdiskusi"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute right-10 bottom-10 w-32 h-32 bg-yellow-400 rounded-full blur-3xl opacity-20 z-0" />
          </div>
        </div>
      </div>
    </header>
  );
}
