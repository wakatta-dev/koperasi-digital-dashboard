/** @format */

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { DEFAULT_LANDING_CONTENT } from "../constants";
import type { AboutSection } from "@/types/landing-page";

type LandingAboutProps = {
  about?: AboutSection;
};

export function LandingAbout({ about }: LandingAboutProps) {
  const fallback = DEFAULT_LANDING_CONTENT.about;
  const data = {
    ...fallback,
    ...about,
    values: about?.values && about.values.length > 0 ? about.values : fallback.values,
  };
  return (
    <section className="py-20 bg-white dark:bg-[#1e293b]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative order-2 lg:order-1">
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={data.image_url || fallback.image_url}
                alt="Pemandangan desa pegunungan"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-[#4338ca] rounded-full flex items-center justify-center text-white shadow-lg">
              <span className="material-icons-outlined text-4xl">landscape</span>
            </div>
          </div>
            <div className="order-1 lg:order-2 space-y-8">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {data.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {data.body}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {data.values.map((item) => (
                <div key={item.title}>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-4 pt-4">
              <Button
                variant="outline"
                className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full hover:bg-gray-50 dark:hover:bg-gray-700 transition font-medium"
              >
                {data.cta_label || "Pelajari"}
              </Button>
              <Button
                variant="ghost"
                className="flex items-center gap-1 text-[#4338ca] hover:text-[#3730a3] font-semibold px-4 py-2"
              >
                Detail <span className="material-icons-outlined text-sm">arrow_forward</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
