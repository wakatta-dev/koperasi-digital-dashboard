/** @format */

export type MarketplaceNavLink = {
  label: string;
  href: string;
  cta?: boolean;
  badge?: string;
  active?: boolean;
};

export type MarketplaceProductBadge = {
  label: string;
  variant?: "primary" | "danger";
};

export type MarketplaceProduct = {
  id: string;
  category: string;
  title: string;
  description: string;
  price: string;
  unit: string;
  image: string;
  badge?: MarketplaceProductBadge;
  ctaLabel?: string;
};

export type MarketplaceProductDetail = {
  id: string;
  title: string;
  breadcrumbTitle?: string;
  variantLabel: string;
  categoryTag: string;
  rating: { value: number; total: number };
  price: string;
  originalPrice: string;
  discountNote: string;
  shortDescription: string;
  longDescription: string[];
  features: string[];
  stock: string;
  seller: { name: string; location: string; avatar: string };
  badge?: MarketplaceProductBadge;
  gallery: { main: string; thumbnails: string[] };
  specs: { label: string; value: string }[];
  related: MarketplaceProduct[];
  reviews: {
    name: string;
    initials: string;
    colorClass: string;
    timeAgo: string;
    rating: number;
    comment: string;
  }[];
};

export const MARKETPLACE_NAV_LINKS: MarketplaceNavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Program", href: "#" },
  { label: "Layanan", href: "#" },
  { label: "Dashboard", href: "#" },
  { label: "Marketplace", href: "/marketplace", active: true },
  { label: "POS", href: "/login", badge: "Staff" },
  { label: "Penyewaan Aset", href: "#" },
  { label: "Daftar", href: "/register", cta: true },
];

export const MARKETPLACE_HEADER = {
  title: "Marketplace Desa",
  description:
    "Temukan produk lokal berkualitas langsung dari petani dan pengrajin desa Sukamaju. Dukung ekonomi lokal dengan berbelanja di sini.",
  searchPlaceholder: "Cari produk (kopi, beras, kerajinan)...",
};

export const CATEGORY_FILTERS = [
  { label: "Semua Produk", value: "all", defaultChecked: true },
  { label: "Pertanian & Perkebunan", value: "agriculture" },
  { label: "Makanan & Minuman", value: "food" },
  { label: "Kerajinan Tangan", value: "craft" },
  { label: "Jasa & Wisata", value: "service" },
];

export const CATEGORY_OPTIONS = [
  "Semua Kategori",
  "Pertanian",
  "Makanan & Minuman",
  "Kerajinan",
  "Wisata & Jasa",
];

export const PRODUCER_FILTERS = [
  { label: "Semua Produsen", value: "all", defaultChecked: true },
  { label: "UMKM Desa", value: "umkm" },
  { label: "BUMDes Unit", value: "bumdes" },
  { label: "Petani Mandiri", value: "farmer" },
];

export const SORT_OPTIONS = [
  "Terpopuler",
  "Terbaru",
  "Harga Terendah",
  "Harga Tertinggi",
];

export const PRODUCTS: MarketplaceProduct[] = [
  {
    id: "kopi-robusta",
    category: "Pertanian",
    title: "Kopi Robusta Sukamaju Premium",
    description:
      "Kopi petik merah pilihan dari perkebunan dataran tinggi desa.",
    price: "Rp 45.000",
    unit: "250gr",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDk6WiWQf_QgIaN5-P8j6WqumkJbpN7CNOrbLVJL4NqhzL2kZv5p2c-xG_IPVd485z8sut7eTI1LDMZsupIGJG0-_o8LxeqavKVThVj5Y_U09bLl6QJBtw7vRHlYK-AuskH2OlQ0ovj-UbYjy9RK5E5cEXrjy7xyZ6Di9sIcWlwr58cb0kF1iNZnSCXtgqjF0eL3JKLzwT9puC1Exf_a1HefEywcsxN6T-dmwWxXlq5As-_gnl2l3mMAorsefJyZ5GUeZai4j9_HB4",
    badge: { label: "Terlaris", variant: "primary" },
  },
  {
    id: "jagung-manis",
    category: "Pertanian",
    title: "Jagung Manis Segar Organik",
    description:
      "Dipanen langsung dari ladang petani saat pemesanan, dijamin segar.",
    price: "Rp 8.000",
    unit: "kg",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC5hJ6iOYENMp-KECjY1cG9AAROFfzl916kuBY31D4r4uB1_-8ydlkWgt6NoRzilWlOeLRI4p_NKn1y57_DlHkxfOSeWOmtJjUU8XJ6atp501dZIZDAyq0HoK_jPKnnUyDO5SA0F0_Fp2VAhVJMU3TBLstEL9wv_0UDrDNsvF_NyjV8_ubRV-cRvvicvhsq061toM0ne4JgAZ1H4s85dbIclIqqRrSC97XMktMyA_Qpb1RCf-XiNu-O7_U9L95zXtTef16Lh0SttQM",
  },
  {
    id: "tas-anyaman",
    category: "Kerajinan",
    title: "Tas Anyaman Bambu Tradisional",
    description:
      "Karya tangan pengrajin desa dengan desain modern dan ramah lingkungan.",
    price: "Rp 125.000",
    unit: "pcs",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAeDCIgfPxzE_cX3sMArJ1_4Ppdhf1IJwRd2hOcnd4EMXMY9MP45pmHK7rca5_z5mMWWQ2NdTnuk1l53IJOY0ewUmzGy5C-U86ATYOOfnn8ae5Qu1Qi0PMKPAYBDwoY-HpK4vO9cYbblOSvqzGhWgXdoIcdQkFzFtvVpZmXSIeueHWp9N2EsKP2Lzhx-xwsxEmHTKrG3Gq7qOADkrnOm8_swqf2Wm3PyyQNVT-io54s2OdsAECthIKrtLfsyleQShtm4ksAdefudpg",
  },
  {
    id: "paket-wisata",
    category: "Wisata",
    title: "Paket Camping Danau Sukamaju",
    description:
      "Nikmati akhir pekan dengan pemandangan danau yang asri bersama keluarga.",
    price: "Rp 75.000",
    unit: "org",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBUclA-a8qYMZ5m-aCuoylUmTNoI-zG48IFltn2w-Ca7ihnaJ7MLiwIvyjpupeMoQEc_RhZuADR4AuCNVf94RV3rndACJPbeG41aoYgmvopwxXTuUHEgd2u8hUT5Fyi_bG0lNOwNu7_qo2D4CooDIjf8Ir9G1p0L5d0SbZ4BWuvYxh_Ad-npGv9fuMOK7hSiJDRBwDtS_xxw36Rtbm8nD_TbSqhQtYSPYHpr4G_4aquXrcLJi7oqqKHYkON9kHNGratLc7J7VYLKfI",
    badge: { label: "Promo", variant: "danger" },
    ctaLabel: "Pesan",
  },
  {
    id: "sewa-traktor",
    category: "Penyewaan",
    title: "Sewa Traktor Tangan",
    description:
      "Alat bantu pertanian modern untuk efisiensi pengolahan lahan warga.",
    price: "Rp 150.000",
    unit: "hari",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDsBzGTe0gUXQF2f7hjKMDeon7IxtLcxugGffliqlTH90QjJjd8lrEYCkQrbBSucc8XBMn4wJEAGfmmoY7wAESyeCA3rTJ8DPp2pNHMWtNrXtSeEPf_fzrD_r2w_atlDVzKOeYJUCskKkPDxrQe-rSZfggmgvnu7Vipl34CXepV2UE27zR7WXB7cWv0ZsQu05Ig3nysMoShMrnCpB8dz-vSH08P6bRpeQBMJS-DzVMyNiNcvT7yfpZp79WSPkjPohxeO92s7Hscf-I",
    ctaLabel: "Sewa",
  },
  {
    id: "oleh-oleh",
    category: "Makanan",
    title: "Paket Oleh-oleh Khas Desa",
    description:
      "Berisi aneka jajanan pasar dan keripik buatan ibu-ibu PKK.",
    price: "Rp 50.000",
    unit: "paket",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAIKy98Qr9BaKfa4F9wbOvLAcsVleQBczGsYAKZQ2T_wf47SjNMo-A1iCxiEt2b1Qcb7swn3EeJOriZ9QIgLV6dsKdFFXxNHGCbkZh2DYDHMO2IdwdLrEQhTSt8Zp3XzFjgV8UOAAR0wcKQiez2mSN-mj3mQc1Z4Ydh8oSmyxdBgZySLhsgp_GulmDJideGh0Hnl3YfOoDtXN-xynfBdjWWS0xGk07vrVmNQdmNDXX1dZj5QGZe2rsxzABDybTlCCopy1RJD8vkmVE",
  },
];

export const DISPLAY_META = {
  start: 1,
  end: 6,
  total: 24,
};

export const PRODUCT_DETAIL: MarketplaceProductDetail = {
  id: "kopi-robusta",
  breadcrumbTitle: "Kopi Robusta Sukamaju Premium",
  title: "Kopi Robusta Sukamaju Premium (250gr)",
  variantLabel: "Varian Gilingan",
  categoryTag: "Pertanian",
  rating: { value: 4.8, total: 124 },
  price: "Rp 45.000",
  originalPrice: "Rp 55.000",
  discountNote: "Hemat 18%",
  shortDescription:
    "Kopi Robusta asli pilihan yang dipetik merah dari perkebunan dataran tinggi Desa Sukamaju. Diolah dengan metode tradisional untuk menjaga cita rasa otentik yang kuat dan harum. Cocok untuk menemani pagi Anda.",
  longDescription: [
    "Nikmati cita rasa kopi asli pedesaan dengan Kopi Robusta Sukamaju Premium. Diproduksi langsung oleh petani lokal yang tergabung dalam BUMDes Sukamaju, setiap biji kopi dipilih dengan teliti melalui proses petik merah (cherry) untuk memastikan kualitas terbaik.",
    "Proses roasting dilakukan oleh tenaga ahli desa menggunakan mesin modern namun tetap mempertahankan profil rasa tradisional yang khas: *bold body*, aroma cokelat yang kuat, dan tingkat keasaman yang rendah. Sangat cocok diseduh sebagai kopi tubruk, espresso, maupun kopi susu kekinian.",
  ],
  features: [
    "100% Biji Kopi Robusta Asli tanpa campuran.",
    "Diambil dari perkebunan ketinggian 800 mdpl.",
    "Proses pasca panen yang higienis.",
    "Packaging alumunium foil dengan valve untuk menjaga kesegaran.",
    "Membeli berarti mendukung kesejahteraan petani lokal.",
  ],
  stock: "Stok tersedia: 50 pcs",
  seller: {
    name: "UMKM Desa Sukamaju",
    location: "Desa Sukamaju, Jawa Barat",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDM8etsHELqFxIHuddh3n_0DsRIF5CrpMThKBSUhlRdzP08Yl9XoybzgsB8S2x3S89eoxHhdWeigrYXHaAl3tgamqfSfHWTBigc2qppeOa7bXgo2x_qmr-Xkw8Uxnv3U0hHbjEJrMpDiB6L91TxUsKI5Au_Wf63UvTiXyp7S2ILzefXeWDyYYVjvmMXg9T2-c_t3KnOwyfl96795X0IFVxYM8I2xbED2bJYcLydQ2DG3MNm9ET52hlAi3Z9puxYqoqkAa3XL9rMjrE",
  },
  badge: { label: "Terlaris", variant: "primary" },
  gallery: {
    main:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDk6WiWQf_QgIaN5-P8j6WqumkJbpN7CNOrbLVJL4NqhzL2kZv5p2c-xG_IPVd485z8sut7eTI1LDMZsupIGJG0-_o8LxeqavKVThVj5Y_U09bLl6QJBtw7vRHlYK-AuskH2OlQ0ovj-UbYjy9RK5E5cEXrjy7xyZ6Di9sIcWlwr58cb0kF1iNZnSCXtgqjF0eL3JKLzwT9puC1Exf_a1HefEywcsxN6T-dmwWxXlq5As-_gnl2l3mMAorsefJyZ5GUeZai4j9_HB4",
    thumbnails: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDk6WiWQf_QgIaN5-P8j6WqumkJbpN7CNOrbLVJL4NqhzL2kZv5p2c-xG_IPVd485z8sut7eTI1LDMZsupIGJG0-_o8LxeqavKVThVj5Y_U09bLl6QJBtw7vRHlYK-AuskH2OlQ0ovj-UbYjy9RK5E5cEXrjy7xyZ6Di9sIcWlwr58cb0kF1iNZnSCXtgqjF0eL3JKLzwT9puC1Exf_a1HefEywcsxN6T-dmwWxXlq5As-_gnl2l3mMAorsefJyZ5GUeZai4j9_HB4",
      "",
      "",
      "",
    ],
  },
  specs: [
    { label: "Kategori", value: "Pertanian > Kopi" },
    { label: "Berat Bersih", value: "250 gram" },
    { label: "Jenis Kopi", value: "Robusta" },
    { label: "Roasting Level", value: "Medium to Dark" },
    { label: "Kadaluarsa", value: "12 Bulan" },
    { label: "Izin P-IRT", value: "2103271010-24" },
  ],
  related: [
    {
      id: "jagung-manis",
      category: "Pertanian",
      title: "Jagung Manis Segar Organik",
      description: "",
      price: "Rp 8.000",
      unit: "kg",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuC5hJ6iOYENMp-KECjY1cG9AAROFfzl916kuBY31D4r4uB1_-8ydlkWgt6NoRzilWlOeLRI4p_NKn1y57_DlHkxfOSeWOmtJjUU8XJ6atp501dZIZDAyq0HoK_jPKnnUyDO5SA0F0_Fp2VAhVJMU3TBLstEL9wv_0UDrDNsvF_NyjV8_ubRV-cRvvicvhsq061toM0ne4JgAZ1H4s85dbIclIqqRrSC97XMktMyA_Qpb1RCf-XiNu-O7_U9L95zXtTef16Lh0SttQM",
    },
    {
      id: "tas-anyaman",
      category: "Kerajinan",
      title: "Tas Anyaman Bambu Tradisional",
      description: "",
      price: "Rp 125.000",
      unit: "pcs",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAeDCIgfPxzE_cX3sMArJ1_4Ppdhf1IJwRd2hOcnd4EMXMY9MP45pmHK7rca5_z5mMWWQ2NdTnuk1l53IJOY0ewUmzGy5C-U86ATYOOfnn8ae5Qu1Qi0PMKPAYBDwoY-HpK4vO9cYbblOSvqzGhWgXdoIcdQkFzFtvVpZmXSIeueHWp9N2EsKP2Lzhx-xwsxEmHTKrG3Gq7qOADkrnOm8_swqf2Wm3PyyQNVT-io54s2OdsAECthIKrtLfsyleQShtm4ksAdefudpg",
    },
    {
      id: "oleh-oleh",
      category: "Makanan",
      title: "Paket Oleh-oleh Khas Desa",
      description: "",
      price: "Rp 50.000",
      unit: "paket",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuAIKy98Qr9BaKfa4F9wbOvLAcsVleQBczGsYAKZQ2T_wf47SjNMo-A1iCxiEt2b1Qcb7swn3EeJOriZ9QIgLV6dsKdFFXxNHGCbkZh2DYDHMO2IdwdLrEQhTSt8Zp3XzFjgV8UOAAR0wcKQiez2mSN-mj3mQc1Z4Ydh8oSmyxdBgZySLhsgp_GulmDJideGh0Hnl3YfOoDtXN-xynfBdjWWS0xGk07vrVmNQdmNDXX1dZj5QGZe2rsxzABDybTlCCopy1RJD8vkmVE",
    },
    {
      id: "beras-pandan",
      category: "Pertanian",
      title: "Beras Pandan Wangi Organik",
      description: "",
      price: "Rp 70.000",
      unit: "5kg",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCsm2KPnTd51o5-yVR4bXFUsjINiCdbRbctJ3FGycF_0XZx5sgxe7fde1Z7JQLR9Zkene-23lJjPxeUy6fqWsmmdlhrHVRfP4Scq5sJAl6bwbRgzqApv5IZB9vwagdDRE0stsht16xWPz8d3inB8MhHZrNrjoT6T4jGdaxY3_0Zop35b9s31PUDZOnpsKvhtNlV6vFtP7-9inEZWpMWgwemGTSACyN3QY8N2P4gC5O2zkLFwqVHojRSn_5nxEXq8InlXtD7kDVEb1U",
      badge: { label: "Baru", variant: "primary" },
    },
  ],
  reviews: [
    {
      name: "Budi Pratama",
      initials: "BP",
      colorClass: "bg-indigo-100 text-primary",
      timeAgo: "2 Hari yang lalu",
      rating: 5,
      comment:
        "Kopinya mantap! Aromanya wangi banget pas dibuka kemasannya. Rasa bold-nya dapet, cocok buat temen begadang ngerjain tugas. Pengiriman juga cepet.",
    },
    {
      name: "Siti Aminah",
      initials: "SA",
      colorClass: "bg-pink-100 text-pink-600",
      timeAgo: "1 Minggu yang lalu",
      rating: 4,
      comment:
        "Rasanya enak, cuma pengiriman agak lama sedikit karena kurir desa. Tapi worth it sama kualitas barangnya. Semangat BUMDes!",
    },
  ],
};
