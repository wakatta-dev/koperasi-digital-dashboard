/** @format */
/* eslint-disable react/no-unescaped-entities */

import { asArray, asNumber, asRecord, asString } from "../../shared/content";

const DEFAULT_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCP0kYrTi6R_GrtxhWhVkWK5Cn-q__nAKBxEwRfCLlkBCIg6vWrSYqblMivrSRM04iBN6OBT3SnG2U5oIdthtBKzpmwJko5OPik8h1JhYlVxPb0GSF5QWvS8TTviDqfLSBb468fWzMyXhy5YZHbhSdVjX7b8n5momiZXyxN4kySTa1Jg5B5HHKB-jfSZVZRKOvhIL7vkPNwmjAh7nXII9GH39f08FmEH0iCia_o2Q3DXtd5r0Z55Ae-T5oCfiPe3t-5HRDUuyehs6pa",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDm5cBH16t-SDjX_F0N7jHWUUbO0oBYT4ahGigXcT1V4-3yb7_H1PlK4SYCgzzshqGlSHrDG68Rh5C8NVbTFJoX_ieeIPDhsMjsov5x4Msk6x6aFsgFOcJmjGChAlPbjVQAxbqtWXiVEqUzzXS8ye4qIoliBAI8k5WOMMVBixgJzxAQSRUw5pTaX6bi5sBFMNndzs5fpg66JttZBXlo7IW_B0HYzON_zS2td7g0TmgFfhxAYXBEUvGOif9DYbly_x8Bywdxr1RGVryv",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuClLkaN9Sr84D02Dkjd88cbpAzcbuP0n_LNQyV4qJp6HuC-lbwo3Yao6ZiaLcmix1ChtBVaZyIJ4jO3OpYmOMkFkmiPhity7xlf-6NLeQAwBR-csGf7Ip6ipFAeFkmzK92RPmXevwBbHP8oRJsUTyMRvw4erFT_1T8b3-1y_kttv7R3zEim8X1V-_5vXwIUrwpwAhRM9q1k2FvMtMr4R8oFYyAYNwFmIMzFDXNi8OxlgWnpqkQCmDZGOOeWxw4DVHi0IUTRQxgMirHE",
];

const DEFAULT_ITEMS = [
  {
    name: "Budi Santoso",
    role: "Kontraktor Mandiri",
    quote: "Pengiriman sangat cepat, pesan pagi siang sudah sampai di lokasi proyek. Kualitas pasirnya juga bagus, tidak banyak lumpur.",
    rating: 5,
    stars: ["star", "star", "star", "star", "star"],
    photo_url: DEFAULT_AVATARS[0],
  },
  {
    name: "Siti Rahayu",
    role: "Renovasi Rumah",
    quote: "Harga besi beton di sini paling kompetitif dibanding toko lain. Pelayanannya ramah dan sangat membantu menghitung kebutuhan.",
    rating: 4.5,
    stars: ["star", "star", "star", "star", "star_half"],
    photo_url: DEFAULT_AVATARS[1],
  },
  {
    name: "Hendra Wijaya",
    role: "Developer Properti",
    quote: "Toko bangunan langganan untuk semua proyek perumahan saya. Stok selalu lengkap dan administrasinya rapi.",
    rating: 5,
    stars: ["star", "star", "star", "star", "star"],
    photo_url: DEFAULT_AVATARS[2],
  },
];

type TemplateOneTestimonialsSectionProps = {
  data?: Record<string, any>;
};

export function TemplateOneTestimonialsSection({ data }: TemplateOneTestimonialsSectionProps) {
  const section = asRecord(data);
  const title = asString(section.title, "Apa Kata Pelanggan Kami");
  const description = asString(
    section.description,
    "Kepuasan pelanggan adalah prioritas utama kami dalam setiap pelayanan."
  );

  const parsedItems = asArray(section.items)
    .map((item, index) => {
      const itemMap = asRecord(item);
      const parsedStars = asArray(itemMap.stars)
        .map((value) => asString(value))
        .filter((value) => value !== "");
      return {
        name: asString(itemMap.name),
        role: asString(itemMap.role),
        quote: asString(itemMap.quote),
        rating: Math.max(1, Math.min(5, Math.round(asNumber(itemMap.rating, 5)))),
        stars: parsedStars,
        photo_url: asString(itemMap.photo_url, DEFAULT_AVATARS[index % DEFAULT_AVATARS.length]),
      };
    })
    .filter((item) => item.name !== "" || item.quote !== "");

  const items = parsedItems.length > 0 ? parsedItems : DEFAULT_ITEMS;

  return (
    <section className="py-20 bg-background-light dark:bg-background-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">{title}</h2>
          <p className="text-slate-600 dark:text-slate-400">{description}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={`${item.name}-${index}`}
              className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800"
            >
              <div className="flex text-yellow-400 mb-4">
                {(item.stars.length > 0
                  ? [...item.stars, ...Array.from({ length: Math.max(0, 5 - item.stars.length) }, () => "star_outline")]
                  : Array.from({ length: 5 }).map((_, starIndex) => (starIndex < item.rating ? "star" : "star_outline"))
                )
                  .slice(0, 5)
                  .map((starIcon, starIndex) => (
                  <span key={starIndex} className="material-symbols-outlined fill-current text-[20px]">
                    {starIcon}
                  </span>
                ))}
              </div>
              <p className="text-slate-700 dark:text-slate-300 mb-6 italic">"{item.quote}"</p>
              <div className="flex items-center gap-4">
                <div
                  className="size-10 rounded-full bg-slate-200 bg-cover bg-center"
                  data-alt={item.name}
                  style={{ backgroundImage: `url('${item.photo_url}')` }}
                ></div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
