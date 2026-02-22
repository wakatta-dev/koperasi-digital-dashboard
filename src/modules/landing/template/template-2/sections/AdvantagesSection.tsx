/** @format */

import { asArray, asRecord, asString } from "../../shared/content";

const ADVANTAGE_IMAGE_LEFT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuADyBPn7cnHmU5cuNCIMo-P_tzkp2ZU4RKgPellUDtrzBUKO4UI-r0cv9u3qsR1JmT1pFx9R3U0vZs114ZDARc90W8oYjIaadhxQxqZUTmVecjCr8FC8rsEoI7F9WrrgnvPS_E-iI4HRJQv9Esd6QTkpA0AcNl0Wmw5QWPsK9oYIQ5WXuXV39JbVTHwmZHVYArK-ERg7TVhBw4uWGv2RozDZtHHdHdeKuSKqf53tlI9FnWAx7fXEmwECDhE3K70_x8Y-TpJJgYljuiC";

const ADVANTAGE_IMAGE_RIGHT =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGcoKAD9Kj1JoJB-KDhiBajTDVhGUrX4uMX9Pex6RcZvAFlR3Kl-vspqFKcW6sQdPIijx-ciepsfcFi6w8wlTFYyU_Kt1r21Ony3gN5h0FohfXc3_ckmUlAHXEJuLyDwuNwjeafUEI9ZnbgZSKM3A6BHkf3iHupMDEgTju_GpP3eSshBwRvvpCmrHBwOR2rDLBKBUr5JvPv5ZIZ6AwZYh5_9tuZ_6F6_Dt-pLK4z3l7V8S9tV4V52sNE-054pdZj-0SrXXc6eY3_2A";

const DEFAULT_ITEMS = [
  {
    icon: "savings",
    title: "Harga Transparan",
    description: "Langsung dari produsen tanpa perantara",
  },
  {
    icon: "local_shipping",
    title: "Pengiriman Cepat",
    description: "Kurir lokal desa yang ramah & sigap",
  },
  {
    icon: "verified_user",
    title: "Kualitas Terjamin",
    description: "Kurasi ketat standar BUMDes",
  },
];

const ITEM_THEME = [
  {
    itemClass:
      "bg-warm-bg p-4 rounded-2xl flex items-center gap-4 border-2 border-village-dark/5 hover:border-market-yellow transition-colors",
    iconWrap:
      "size-12 bg-market-yellow rounded-xl flex items-center justify-center shrink-0 border-2 border-village-dark text-village-dark",
  },
  {
    itemClass:
      "bg-warm-bg p-4 rounded-2xl flex items-center gap-4 border-2 border-village-dark/5 hover:border-market-blue transition-colors",
    iconWrap:
      "size-12 bg-market-blue rounded-xl flex items-center justify-center shrink-0 border-2 border-village-dark text-white",
  },
  {
    itemClass:
      "bg-warm-bg p-4 rounded-2xl flex items-center gap-4 border-2 border-village-dark/5 hover:border-market-red transition-colors",
    iconWrap:
      "size-12 bg-market-red rounded-xl flex items-center justify-center shrink-0 border-2 border-village-dark text-white",
  },
];

type TemplateTwoAdvantagesSectionProps = {
  data?: Record<string, any>;
};

export function TemplateTwoAdvantagesSection({ data }: TemplateTwoAdvantagesSectionProps) {
  const section = asRecord(data);

  const title = asString(section.title, "Belanja Sambil");
  const highlightTitle = asString(section.highlight_title, "Membangun Desa");
  const description = asString(
    section.description,
    "Setiap rupiah yang Anda belanjakan di sini kembali untuk pembangunan infrastruktur dan pemberdayaan masyarakat desa."
  );

  const parsedItems = asArray(section.items)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        icon: asString(itemMap.icon, "check_circle"),
        title: asString(itemMap.title),
        description: asString(itemMap.description),
      };
    })
    .filter((item) => item.title !== "");
  const items = parsedItems.length > 0 ? parsedItems : DEFAULT_ITEMS;

  return (
    <section className="py-12 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto" id="keunggulan">
      <div className="bg-white rounded-[3rem] p-8 md:p-12 border-4 border-village-dark relative">
        <div className="absolute -top-6 -right-6 size-24 bg-market-pink rounded-full border-4 border-village-dark hidden lg:block"></div>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl lg:text-5xl font-black text-village-dark mb-4">
                {title} <span className="text-market-green">{highlightTitle}</span>
              </h2>
              <p className="text-lg text-village-brown/80 font-medium">{description}</p>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => {
                const theme = ITEM_THEME[index % ITEM_THEME.length];
                return (
                  <div key={`${item.title}-${index}`} className={theme.itemClass}>
                    <div className={theme.iconWrap}>
                      <span className="material-symbols-outlined font-bold">{item.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-village-dark">{item.title}</h4>
                      <p className="text-sm font-bold text-village-brown/60">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-market-teal/20 rounded-full blur-3xl -z-10"></div>
            <div className="grid grid-cols-2 gap-4">
              <img
                alt="Villagers happy"
                className="rounded-3xl w-full h-48 lg:h-64 object-cover border-4 border-white shadow-xl rotate-[-6deg] hover:rotate-0 transition-transform duration-500 z-10"
                src={ADVANTAGE_IMAGE_LEFT}
              />
              <img
                alt="Product showcase"
                className="rounded-3xl w-full h-48 lg:h-64 object-cover border-4 border-white shadow-xl rotate-[6deg] hover:rotate-0 transition-transform duration-500 translate-y-8"
                src={ADVANTAGE_IMAGE_RIGHT}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
