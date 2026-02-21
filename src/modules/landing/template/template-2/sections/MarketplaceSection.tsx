/** @format */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_TABS = [
  { icon: "grid_view", label: "Semua" },
  { icon: "water_drop", label: "Layanan Air" },
  { icon: "travel_explore", label: "Wisata" },
  { icon: "recycling", label: "Lingkungan" },
  { icon: "shopping_basket", label: "Produk UMKM" },
];

const DEFAULT_CARDS = [
  {
    badge: "Best Seller",
    title: "Langganan Air Bersih",
    type: "Jasa",
    description: "Layanan air bersih higienis langsung ke rumah anda dengan meteran digital.",
    price: "Rp 50rb",
    price_suffix: "/bulan",
    cta_label: "Berlangganan",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDLVm6NFKEk5KtV013galD87fC8Fpg1dgVEny3xChHB4fr5qhbGHjisZMaVRD80SteeOjx4lMl50QG36dJjvkZD2BZ7PcO00u4HhVbPG7Psr-JWoAxmW-QqTKXlGTw_Hm1yQdLOKhoUj44jL1-yhNZwUWftcNQocFJl7-PwjJvyGSvvHjvtWmBDGFKmm80Ylv62JFVo6JO38NPuHM618Z8bMFlBH6IKSybgNIm6Vdexq301jAxy-HpjWYuxBJRq8Mk-IWsUJxrqwdeX",
  },
  {
    badge: "Populer",
    title: "Tiket Masuk Ekowisata",
    type: "Wisata",
    description: "Nikmati keindahan alam desa dengan paket wisata edukasi keluarga.",
    price: "Rp 15rb",
    price_suffix: "/org",
    cta_label: "Beli Tiket",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDs2dbSHHePl2z52ji5dD6JBYrzw6IlBRWlcvgC81OZZ29KXQ_qaPZomuxhp3BYJ1dL-FTEWnZn7BFAl157u4Ku_BVUDxFo2ow3W9IVP_K8dutYTO56nVCkPqTuTnh2ZDFQF05l3646rw2de8AE6lQ0aVF7-93Zqn7XpQARaX3n0Af-L8NOawWnWZLWkwvJfgXVAK3pYUTxVAtD3IczAFq75bcJftJxiYC1V86nCH40ehq370UMQTQboI1sLHPtuNpFcNf6lwoBfEk1",
  },
  {
    badge: "Eco",
    title: "Retribusi Kebersihan",
    type: "Jasa",
    description: "Iuran pengelolaan sampah rumah tangga terpadu dengan sistem daur ulang.",
    price: "Rp 20rb",
    price_suffix: "/bulan",
    cta_label: "Bayar",
    image_url:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAEaHfzalraUtllPsxZzj2_SFz8qPV7Bbl2rOVcSDJIy0BqwN_6yIERLnx0_qeEZJVO1GS8ZK_Fxb2oARSittBcBcs5sq5n34kXVcvJK8SrPb9t2Fa7upT1FGTIFCV92MCQjsvB8BeaRhZCJBqc-2Xn21QyE__Q5pd4QhVjRZSzlbIb5_mk_FJddfKg_1iKLA3iLlk9CeLFJLM1KRkYFddAPs0tUu1D4UlpK2yrvEAacAF4jIllHsCSE0d7aYNyY_nlU3FK5PyQpKke",
  },
  {
    badge: "UMKM",
    title: "Keripik Pisang 'Makmur'",
    type: "UMKM",
    description: "Camilan khas desa yang renyah dan manis, dibuat oleh kelompok wanita tani.",
    price: "Rp 12rb",
    price_suffix: "/pcs",
    cta_label: "Beli",
    image_url: "",
    placeholder_icon: "shopping_bag",
    placeholder_tint: "bg-market-red/5",
  },
  {
    badge: "UMKM",
    title: "Kopi Robusta Desa",
    type: "UMKM",
    description: "Biji kopi pilihan petik merah yang diproses natural, aroma kuat.",
    price: "Rp 45rb",
    price_suffix: "/250gr",
    cta_label: "Beli",
    image_url: "",
    placeholder_icon: "local_cafe",
    placeholder_tint: "bg-market-yellow/10",
  },
];

const CARD_THEME = [
  {
    card: "border-r-market-blue border-b-market-blue hover:border-market-blue",
    badge: "text-blue-700",
    type: "bg-blue-100 text-blue-800",
    button: "bg-market-blue hover:bg-blue-600 text-white",
  },
  {
    card: "border-r-market-orange border-b-market-orange hover:border-market-orange",
    badge: "text-orange-700",
    type: "bg-orange-100 text-orange-800",
    button: "bg-market-orange hover:bg-orange-600 text-white",
  },
  {
    card: "border-r-market-green border-b-market-green hover:border-market-green",
    badge: "text-green-700",
    type: "bg-green-100 text-green-800",
    button: "bg-market-green hover:bg-green-600 text-white",
  },
  {
    card: "border-r-market-red border-b-market-red hover:border-market-red",
    badge: "text-red-700",
    type: "bg-red-100 text-red-800",
    button: "bg-market-red hover:bg-red-600 text-white",
  },
  {
    card: "border-r-market-yellow border-b-market-yellow hover:border-market-yellow",
    badge: "text-yellow-700",
    type: "bg-yellow-100 text-yellow-800",
    button: "bg-market-yellow hover:bg-yellow-500 text-village-dark",
  },
];

const TAB_THEME = [
  "hover:border-market-blue hover:bg-market-blue/10 hover:text-blue-700",
  "hover:border-market-orange hover:bg-market-orange/10 hover:text-orange-700",
  "hover:border-market-green hover:bg-market-green/10 hover:text-green-700",
  "hover:border-market-red hover:bg-market-red/10 hover:text-red-700",
];

type TemplateTwoMarketplaceSectionProps = {
  data?: Record<string, any>;
};

export function TemplateTwoMarketplaceSection({ data }: TemplateTwoMarketplaceSectionProps) {
  const section = asRecord(data);

  const badgeText = asString(section.badge_text, "Resmi Milik BUMDes Maju");
  const titleLine1 = asString(section.title_line_1, "Pusat Belanja &");
  const titleLine2 = asString(section.title_line_2, "Layanan Desa");
  const subtitle = asString(
    section.subtitle,
    "Jelajahi produk lokal terbaik dan layanan publik terpercaya dalam satu genggaman."
  );

  const parsedTabs = asArray(section.category_tabs)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        icon: asString(itemMap.icon, "grid_view"),
        label: asString(itemMap.label),
      };
    })
    .filter((item) => item.label !== "");
  const tabs = parsedTabs.length > 0 ? parsedTabs : DEFAULT_TABS;

  const parsedCards = asArray(section.cards)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        badge: asString(itemMap.badge, "Produk"),
        title: asString(itemMap.title),
        type: asString(itemMap.type, "Layanan"),
        description: asString(itemMap.description),
        price: asString(itemMap.price, "Rp 0"),
        price_suffix: asString(itemMap.price_suffix, ""),
        cta_label: asString(itemMap.cta_label, "Lihat"),
        image_url: asString(itemMap.image_url, ""),
        placeholder_icon: "",
        placeholder_tint: "",
      };
    })
    .filter((item) => item.title !== "");
  const cards = parsedCards.length > 0 ? parsedCards : DEFAULT_CARDS;

  return (
    <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto" id="marketplace">
      <div className="text-center mb-12 space-y-4">
        <span className="inline-block py-1 px-4 rounded-full bg-market-green/20 text-green-700 font-bold text-sm uppercase tracking-wider mb-2">
          {badgeText}
        </span>
        <h1 className="text-5xl md:text-7xl font-black text-village-dark leading-[0.9] tracking-tight">
          {titleLine1} <br />
          <span className="text-market-orange italic">{titleLine2}</span>
        </h1>
        <p className="text-xl text-village-brown/80 font-medium max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="flex overflow-x-auto pb-4 gap-3 justify-start md:justify-center mb-10 no-scrollbar">
        {tabs.map((tab, index) => (
          <button
            key={`${tab.label}-${index}`}
            className={`flex-shrink-0 px-6 py-3 rounded-xl font-bold text-sm transition-all ${
              index === 0
                ? "bg-village-dark text-white shadow-lg transform hover:-translate-y-1"
                : `bg-white text-village-brown border-2 border-village-brown/10 ${
                    TAB_THEME[(index - 1) % TAB_THEME.length]
                  }`
            }`}
          >
            <span className="material-symbols-outlined align-bottom mr-1 text-lg">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => {
          const theme = CARD_THEME[index % CARD_THEME.length];
          return (
            <div
              key={`${card.title}-${index}`}
              className={`group bg-white rounded-3xl p-3 border-b-8 border-r-8 border-2 border-village-dark transition-all duration-300 transform hover:-translate-y-2 ${theme.card}`}
            >
              <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-4 relative bg-gray-100">
                <span
                  className={`absolute top-3 left-3 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider shadow-sm z-10 ${theme.badge}`}
                >
                  {card.badge}
                </span>
                {card.image_url ? (
                  <img
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    src={card.image_url}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center relative">
                    <span className="material-symbols-outlined text-6xl text-village-brown/20">
                      {card.placeholder_icon || "shopping_bag"}
                    </span>
                    {card.placeholder_tint ? (
                      <div className={`absolute inset-0 ${card.placeholder_tint}`}></div>
                    ) : null}
                  </div>
                )}
                <button className="absolute bottom-3 right-3 size-10 bg-white rounded-full flex items-center justify-center text-village-dark hover:text-market-red shadow-lg transition-colors z-10">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>

              <div className="px-2 pb-2">
                <div className="flex justify-between items-start mb-2 gap-2">
                  <h3 className="text-xl font-black text-village-dark leading-tight">{card.title}</h3>
                  <div className={`text-xs font-bold px-2 py-1 rounded-md ${theme.type}`}>{card.type}</div>
                </div>
                <p className="text-village-brown/70 text-sm font-medium line-clamp-2 mb-4">{card.description}</p>
                <div className="flex items-center justify-between mt-auto gap-3">
                  <span className="text-lg font-black text-village-dark">
                    {card.price}
                    {card.price_suffix ? (
                      <span className="text-xs font-semibold text-village-brown/50">{card.price_suffix}</span>
                    ) : null}
                  </span>
                  <button className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors shadow-sm ${theme.button}`}>
                    {card.cta_label}
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        <a
          className="group bg-village-dark rounded-3xl p-8 border-b-8 border-r-8 border-market-teal border-b-market-teal hover:bg-market-teal hover:border-village-dark transition-all duration-300 transform hover:-translate-y-2 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
          href="#"
        >
          <div className="size-20 rounded-full bg-white/10 flex items-center justify-center mb-6 group-hover:bg-white/20">
            <span className="material-symbols-outlined text-5xl text-white">arrow_forward</span>
          </div>
          <h3 className="text-3xl font-black text-white leading-tight mb-2">
            Lihat Semua
            <br />
            Produk Desa
          </h3>
          <p className="text-white/70 font-medium">Masih ada 50+ produk lainnya</p>
        </a>
      </div>
    </section>
  );
}
