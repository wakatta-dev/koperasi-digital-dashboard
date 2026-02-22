/** @format */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_ITEMS = [
  { icon: "verified", text: "100% PRODUK LOKAL", tone: "dark" },
  { icon: "payments", text: "TRANSAKSI AMAN", tone: "light" },
  { icon: "groups", text: "150+ ANGGOTA AKTIF", tone: "dark" },
  { icon: "volunteer_activism", text: "DUKUNG EKONOMI DESA", tone: "light" },
];

type TemplateTwoMarqueeSectionProps = {
  data?: Record<string, any>;
};

export function TemplateTwoMarqueeSection({ data }: TemplateTwoMarqueeSectionProps) {
  const section = asRecord(data);
  const parsedItems = asArray(section.items)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        icon: asString(itemMap.icon, "verified"),
        text: asString(itemMap.text),
        tone: asString(itemMap.tone, "dark"),
      };
    })
    .filter((item) => item.text !== "");

  const items = parsedItems.length > 0 ? parsedItems : DEFAULT_ITEMS;
  const marqueeItems = [...items, ...items];

  return (
    <section className="py-4 bg-market-yellow -rotate-1 border-y-4 border-village-dark overflow-hidden">
      <div className="flex items-center gap-12 animate-marquee whitespace-nowrap px-4">
        {marqueeItems.map((item, index) => (
          <span
            key={`${item.text}-${index}`}
            className={`text-2xl font-black flex items-center gap-2 ${
              item.tone.toLowerCase() === "light" ? "text-white" : "text-village-dark"
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            {item.text}
          </span>
        ))}
      </div>
    </section>
  );
}
