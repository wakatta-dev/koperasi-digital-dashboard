/** @format */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_IMAGES = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDZuNLXVIbUhhuHqJbbQ1m7r7hTnuXv6hy8jZBUH2NHDGv0fIncIW5Sjcdy3mT6LkfvuBbRaY67Itijmu7eK1OiE8LXja67Jb8UIC1KhVb5KEV0Znq_aSrqZzPVGDR5BL5NinAL10xtXFGYkef5I8-s6SsKsLKlTUzJ_L9sMlHUYhajqR0gpVzDqIcQOX2NTXOm8hUgglCYs_QaJTZ4y_i-IDmkyBAEn25w2awsgx-MrDQSjBzjUAhVcC7rO-xWImx1phgO7TC1KRz8",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJOzwUtr4SmF6aNZrh5sjRwQFYx3UNFgL3lCVn2kiNkY27SwPdJYRawYAIFHKCWL3U4-2qRvzm9Vr1xLuetvX047FqiVH_kMd7YdU70KcLCwn-tVciK4GFSm0kF-VS7ynUL3iCzTIzt14K3iR8G7LV-VNSTMtXpf-OPNp9QsDhQ6OZWlCf_yvPqqu62DcCa8VaLDcLJzD9xyma0y5UgT-xHKH48mLT39ZNho1pO3xVt44xnd9LTKTkLClXRB2UUjAeu3_ffJGgrtX7",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDH4zsVZ-uPrWvspK0zwh-Bf-CYnNwiS4YSDTtXDcM0Ck9ZUsY8zEvzvUIABc-80qukqX3iNBG-eSDpd5Rm9tq3TK7u3u6id6LvnRDLnzTOGZvkc9UsHiTuSp74fQvnIvGVSI2VI2AJKmRkkAej__SniSNzCsHVo1YP7STB_1wuVhA8xhgHRkDpJTxkm75plkylmppQb8V75K7Q02-lyMwmyYaFq30RHjrYS5HeXI197DoVPMiEG9nwIF4upp75fJjb2QMv51KcDn9Q",
];

const DEFAULT_ITEMS = [
  {
    category: "Material Dasar",
    title: "Semen & Pasir",
    description:
      "Semen kualitas tinggi (Gresik, Tiga Roda) dan pasir muntilan bebas lumpur untuk cor beton yang kuat.",
    price: "Mulai Rp 55.000",
    image_url: DEFAULT_IMAGES[0],
  },
  {
    category: "Struktur",
    title: "Besi & Baja Ringan",
    description: "Besi beton full SNI berbagai ukuran dan baja ringan anti karat untuk rangka atap yang presisi.",
    price: "Harga Grosir",
    image_url: DEFAULT_IMAGES[1],
  },
  {
    category: "Perkakas",
    title: "Alat Pertukangan",
    description: "Lengkapi proyek Anda dengan alat pertukangan profesional. Palu, gergaji, bor listrik, dan safety gear.",
    price: "Diskon s.d 20%",
    image_url: DEFAULT_IMAGES[2],
  },
];

type TemplateOneProductsSectionProps = {
  data?: Record<string, any>;
};

export function TemplateOneProductsSection({ data }: TemplateOneProductsSectionProps) {
  const section = asRecord(data);
  const title = asString(section.title, "Produk Unggulan");
  const description = asString(
    section.description,
    "Pilihan material terbaik untuk fondasi yang kokoh dan hasil akhir yang sempurna."
  );
  const viewAllLabel = asString(section.view_all_label, "Lihat Semua Produk");

  const parsedItems = asArray(section.items)
    .map((item, index) => {
      const itemMap = asRecord(item);
      return {
        category: asString(itemMap.category, "Kategori"),
        title: asString(itemMap.title),
        description: asString(itemMap.description),
        price: asString(itemMap.price, "Harga"),
        image_url: asString(itemMap.image_url, DEFAULT_IMAGES[index % DEFAULT_IMAGES.length]),
      };
    })
    .filter((item) => item.title !== "");

  const items = parsedItems.length > 0 ? parsedItems : DEFAULT_ITEMS;

  return (
    <section className="py-20 bg-white dark:bg-surface-dark" id="products">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{title}</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-xl">{description}</p>
          </div>
          <button className="text-primary font-bold hover:text-primary-hover flex items-center gap-2 transition-colors">
            {viewAllLabel}
            <span className="material-symbols-outlined">arrow_forward</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <div
              key={`${item.title}-${index}`}
              className="group flex flex-col bg-background-light dark:bg-background-dark rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all duration-300"
            >
              <div
                className="h-48 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                data-alt={item.title}
                style={{ backgroundImage: `url('${item.image_url}')` }}
              ></div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-2">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">{item.category}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{item.price}</span>
                  <button className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-700 dark:text-white hover:bg-primary hover:text-white transition-colors">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
