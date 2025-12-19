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
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIKy98Qr9BaKfa4F9wbOvLAcsVleQBczGsYAKZQ2T_wf47SjNMo-A1iCxiEt2b1Qcb7swn3EeJOriZ9QIgLV6dsKdFFXxNHGCbkZh2DYDHMO2IdwdLrEQhTSt8Zp3XzFjgV8UOAAR0wcKQiez2mSN-mj3mQc1Z4Ydh8oSmyxdBgZySLhsgp_GulmDJideGh0Hnl3YfOoDtXN-xynfBdjWWS0xGk07vrVmNQdmNDXX1dZj5QGZe2rsxzABDybTlCCopy1RJD8vkmVE",
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
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5hJ6iOYENMp-KECjY1cG9AAROFfzl916kuBY31D4r4uB1_-8ydlkWgt6NoRzilWlOeLRI4p_NKn1y57_DlHkxfOSeWOmtJjUU8XJ6atp501dZIZDAyq0HoK_jPKnnUyDO5SA0F0_Fp2VAhVJMU3TBLstEL9wv_0UDrDNsvF_NyjV8_ubRV-cRvvicvhsq061toM0ne4JgAZ1H4s85dbIclIqqRrSC97XMktMyA_Qpb1RCf-XiNu-O7_U9L95zXtTef16Lh0SttQM",
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
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsBzGTe0gUXQF2f7hjKMDeon7IxtLcxugGffliqlTH90QjJjd8lrEYCkQrbBSucc8XBMn4wJEAGfmmoY7wAESyeCA3rTJ8DPp2pNHMWtNrXtSeEPf_fzrD_r2w_atlDVzKOeYJUCskKkPDxrQe-rSZfggmgvnu7Vipl34CXepV2UE27zR7WXB7cWv0ZsQu05Ig3nysMoShMrnCpB8dz-vSH08P6bRpeQBMJS-DzVMyNiNcvT7yfpZp79WSPkjPohxeO92s7Hscf-I",
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
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBC8onBd71OyJVJWlZNfD5N4vq0KDkm2XXw6zNswGNnyjLsyE5kwMzTcxiQnESBTcqLGL4VZFCtGAuOrvfQX_8mxMxG65jnPFnQ4ZcvSs5VTqpS0fggQqNP4sEsCDB-iivBuicDPWydp5LQ7oTulsAOyYI99LM5eM_pWCaalRq3wOlaWQr1Lowuspy3b6RmT1FV2w22wKW234i0j6CTwmuuLjn08a9xnMjpEPz2NSHICPS5R69Q1v07DijrIgWp7sRP5dQd1oinWJU",
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
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeDCIgfPxzE_cX3sMArJ1_4Ppdhf1IJwRd2hOcnd4EMXMY9MP45pmHK7rca5_z5mMWWQ2NdTnuk1l53IJOY0ewUmzGy5C-U86ATYOOfnn8ae5Qu1Qi0PMKPAYBDwoY-HpK4vO9cYbblOSvqzGhWgXdoIcdQkFzFtvVpZmXSIeueHWp9N2EsKP2Lzhx-xwsxEmHTKrG3Gq7qOADkrnOm8_swqf2Wm3PyyQNVT-io54s2OdsAECthIKrtLfsyleQShtm4ksAdefudpg",
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
    imageUrl:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUclA-a8qYMZ5m-aCuoylUmTNoI-zG48IFltn2w-Ca7ihnaJ7MLiwIvyjpupeMoQEc_RhZuADR4AuCNVf94RV3rndACJPbeG41aoYgmvopwxXTuUHEgd2u8hUT5Fyi_bG0lNOwNu7_qo2D4CooDIjf8Ir9G1p0L5d0SbZ4BWuvYxh_Ad-npGv9fuMOK7hSiJDRBwDtS_xxw36Rtbm8nD_TbSqhQtYSPYHpr4G_4aquXrcLJi7oqqKHYkON9kHNGratLc7J7VYLKfI",
  },
];
