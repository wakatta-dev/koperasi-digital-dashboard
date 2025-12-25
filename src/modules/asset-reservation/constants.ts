/** @format */

import type { AssetItem } from "./types";

export const HERO_CONTENT = {
  badge: "Layanan BUMDes",
  title: "Sewa Aset & Fasilitas Desa",
  description:
    "Temukan dan sewa berbagai aset desa mulai dari gedung serbaguna, peralatan pertanian, hingga tenda acara dengan mudah dan transparan untuk mendukung kegiatan Anda.",
  searchPlaceholder: "Cari nama aset, misal: Gedung, Traktor...",
  backgroundPattern:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDsBzGTe0gUXQF2f7hjKMDeon7IxtLcxugGffliqlTH90QjJjd8lrEYCkQrbBSucc8XBMn4wJEAGfmmoY7wAESyeCA3rTJ8DPp2pNHMWtNrXtSeEPf_fzrD_r2w_atlDVzKOeYJUCskKkPDxrQe-rSZfggmgvnu7Vipl34CXepV2UE27zR7WXB7cWv0ZsQu05Ig3nysMoShMrnCpB8dz-vSH08P6bRpeQBMJS-DzVMyNiNcvT7yfpZp79WSPkjPohxeO92s7Hscf-I",
};

export const ASSET_CATEGORIES = [
  "Gedung & Ruangan",
  "Alat Pertanian",
  "Peralatan Pesta",
  "Kendaraan",
] as const;

export const SORT_OPTIONS = [
  { label: "Populer", value: "popular" },
  { label: "Harga Terendah", value: "price_asc" },
  { label: "Harga Tertinggi", value: "price_desc" },
  { label: "Terbaru", value: "newest" },
] as const;

export const ASSET_ITEMS: AssetItem[] = [
  {
    id: "asset-1",
    category: "Gedung & Ruangan",
    title: "Gedung Serbaguna Kartika Runa Wijaya",
    description:
      "Kapasitas 200 orang, cocok untuk resepsi pernikahan, rapat besar, dan acara komunitas. Dilengkapi sound system standar.",
    price: "Rp350.000",
    unit: "/hari",
    status: "available",
    imageUrl: "",
  },
  {
    id: "asset-2",
    category: "Alat Pertanian",
    title: "Traktor Tangan Quick G1000",
    description:
      "Traktor tangan handal untuk membajak sawah. Performa mesin diesel kuat, hemat bahan bakar.",
    price: "Rp150.000",
    unit: "/hari",
    status: "available",
    imageUrl: "",
  },
  {
    id: "asset-3",
    category: "Peralatan Pesta",
    title: "Paket Tenda Pernikahan (4x6m)",
    description:
      "Tenda dekoratif lengkap dengan plafon kain. Cocok untuk acara hajatan di halaman rumah.",
    price: "Rp250.000",
    unit: "/unit",
    status: "rented",
    imageUrl: "",
  },
  {
    id: "asset-4",
    category: "Kendaraan",
    title: "Mobil Pickup Grand Max",
    description:
      "Mobil pickup bak terbuka untuk angkutan barang, hasil panen, atau pindahan. Kondisi prima.",
    price: "Rp200.000",
    unit: "/hari",
    status: "available",
    imageUrl: "",
  },
  {
    id: "asset-5",
    category: "Peralatan Pesta",
    title: "Paket Sound System 5000W",
    description:
      "Paket lengkap speaker aktif, mixer, dan mic wireless. Suara jernih untuk acara indoor/outdoor.",
    price: "Rp500.000",
    unit: "/hari",
    status: "available",
    imageUrl: "",
  },
  {
    id: "asset-6",
    category: "Kendaraan Air",
    title: "Perahu Wisata Danau",
    description:
      "Perahu motor kapasitas 10 orang untuk keliling danau desa. Dilengkapi pelampung keselamatan.",
    price: "Rp75.000",
    unit: "/jam",
    status: "maintenance",
    imageUrl: "",
  },
];
