/** @format */
/* eslint-disable react/no-unescaped-entities */

import { asArray, asRecord, asString } from "../../shared/content";

const DEFAULT_AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDJQyLqYHXu_X1wZsaax2Bce15VDBwAMhN7F6yp9a3Zuymg1lj3H4JAz0FlYnsh9msJnc5G1ChIqQBj9c7AVCg3f23Urf_9yKzWucPEgyKS-66zWINP3yP1TQSjsTcChK8_ZoIaino2DRNkAFtViq84wYei-1KoXOhIBM-gggYvk9FywzlqBa0mA2UrHtJtwBJLjOhG0bww9L7rFENARnkp9N8q_Qgb71vsNIh-t_OYaumPHVSSIVnKg31uSR3iunjTYveRyE3kjCEp",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCo8OibR19qMMxCTP9dzp90f8HT1ffvNstJV4NG1VLi-uHAeHeNSakKdmZmjhZk_RZijmFdfPfHxMxjn15azjMg_dc7mzBCrSc2XGXq_7EXr57zoNvwMoNEg_rH5ntLzOeNreK36SFQneYCNVFK-D_JG5sHps_o4Op0bHDxdi1DwSBJQpEIVgcjbbqZyUmMdx-0oiYyP_R4guy-65wa9wlG1tHOA2pT13d0HCqGT0XjO5Xdn5jPianjs3H8EIqdzj8SMmq9KPfZRPy2",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD6RwYslGpuimU611n0B45IhcL4cOP43NUA5BI1ZQFeUTKgP3nEDhNNTeVVamX9VskAR0pQM2dt9iDJO1Gh53xZd65RtLGPhZlQKbxWlfWTzDW_BKcI0NIpPsyDue9rOIvZU1lilF29a1b3O5SGQGKRVfvMzvLyhOcWihHiRuijjPfE7vrUweKgQ0d7CRZRv6eMdFjMnuRyL8vSO4ciGUx4R7e6XpnegI62ousnH5XHQxdxvOEuDJR0Y0uztkO8RXcwd57Vstss2ZIs",
];

const DEFAULT_ITEMS = [
  {
    name: "Ibu Siti",
    role: "Ibu Rumah Tangga",
    quote: "Belanja sayur jadi gampang banget, tinggal klik langsung diantar sama tetangga sendiri. Segar dan murah!",
    avatar_url: DEFAULT_AVATARS[0],
  },
  {
    name: "Budi Santoso",
    role: "Wisatawan",
    quote: "Wisata desanya dikelola profesional. Beli tiket online di sini prosesnya cepat, tidak perlu antre lagi.",
    avatar_url: DEFAULT_AVATARS[1],
  },
  {
    name: "Rizky P",
    role: "Tokoh Pemuda",
    quote: "Salut sama BUMDes! Pengelolaan sampahnya juara. Desa jadi bersih, pembayaran retribusi juga transparan.",
    avatar_url: DEFAULT_AVATARS[2],
  },
];

const CARD_BORDER = ["hover:border-market-yellow", "hover:border-market-blue", "hover:border-market-red"];
const ROLE_COLOR = ["text-market-orange", "text-market-blue", "text-market-red"];
const AVATAR_BORDER = ["border-market-yellow", "border-market-blue", "border-market-red"];

type TemplateTwoTestimonialsSectionProps = {
  data?: Record<string, any>;
};

export function TemplateTwoTestimonialsSection({ data }: TemplateTwoTestimonialsSectionProps) {
  const section = asRecord(data);
  const title = asString(section.title, "Suara Tetangga");
  const subtitle = asString(section.subtitle, "Testimoni Warga & Pelanggan");

  const parsedItems = asArray(section.items)
    .map((item, index) => {
      const itemMap = asRecord(item);
      return {
        name: asString(itemMap.name),
        role: asString(itemMap.role),
        quote: asString(itemMap.quote),
        avatar_url: asString(itemMap.avatar_url, DEFAULT_AVATARS[index % DEFAULT_AVATARS.length]),
      };
    })
    .filter((item) => item.name !== "" || item.quote !== "");

  const items = parsedItems.length > 0 ? parsedItems : DEFAULT_ITEMS;

  return (
    <section className="px-6 md:px-12 lg:px-20 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl lg:text-5xl font-black text-village-dark mb-4">{title}</h2>
        <p className="text-xl text-village-brown/60 font-bold uppercase tracking-widest">{subtitle}</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={`${item.name}-${index}`}
            className={`bg-white p-8 rounded-[2rem] shadow-lg border-2 border-village-dark/5 transition-all ${
              index === 1 ? "translate-y-0 lg:translate-y-4" : ""
            } ${CARD_BORDER[index % CARD_BORDER.length]}`}
          >
            <div className="flex gap-1 mb-4 text-market-yellow">
              {Array.from({ length: 5 }).map((_, starIndex) => (
                <span key={starIndex} className="material-symbols-outlined">
                  star
                </span>
              ))}
            </div>
            <p className="text-lg font-medium text-village-brown mb-6">"{item.quote}"</p>
            <div className="flex items-center gap-4">
              <img
                alt={item.name}
                className={`size-12 rounded-full object-cover border-2 ${AVATAR_BORDER[index % AVATAR_BORDER.length]}`}
                src={item.avatar_url}
              />
              <div>
                <div className="font-black text-village-dark">{item.name}</div>
                <div className={`text-xs font-bold uppercase ${ROLE_COLOR[index % ROLE_COLOR.length]}`}>{item.role}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
