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

export type CartItem = {
  id: string;
  title: string;
  store: string;
  variant?: string;
  price: string;
  originalPrice?: string;
  quantity: number;
  subtotal: string;
  image: string;
};

export type CartSummary = {
  subtotalLabel: string;
  subtotalValue: string;
  shippingLabel: string;
  shippingValue: string;
  discountLabel: string;
  discountValue: string;
  totalLabel: string;
  totalValue: string;
  itemsCountLabel: string;
  shippingPlaceholder: string;
  secureNote: string;
};

export const CART_BADGE = 2;

export type ShippingAddress = {
  fullName: string;
  phone: string;
  label: string;
  address: string;
  province: string;
  city: string;
  district: string;
  postalCode: string;
};

export type ShippingOption = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  recommended?: boolean;
  free?: boolean;
};

export type ShippingSummary = {
  totalItemsLabel: string;
  totalItemsValue: string;
  shippingLabel: string;
  shippingValue: string;
  serviceFeeLabel: string;
  serviceFeeValue: string;
  discountLabel: string;
  discountValue: string;
  totalLabel: string;
  totalValue: string;
  secureNote: string;
  avatarImages: string[];
  extraCountLabel: string;
};

export type PaymentOption = {
  id: string;
  title: string;
  subtitle: string;
  badgeText?: string;
  priceText?: string;
  icon?: string;
  iconColor?: string;
  bgColor?: string;
  recommended?: boolean;
};

export type ReviewAddress = {
  name: string;
  label: string;
  addressLine1: string;
  addressLine2: string;
  phone: string;
  courierTag: string;
  courierEta: string;
};

export type ReviewPayment = {
  bankName: string;
  note: string;
  logo: string;
};

export type ReviewItem = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  quantity: number;
  image?: string;
  icon?: string;
  iconBg?: string;
};

export const MARKETPLACE_NAV_LINKS: MarketplaceNavLink[] = [
  { label: "Beranda", href: "/" },
  { label: "Marketplace", href: "/marketplace", active: true },
  { label: "POS", href: "/login", badge: "Staff" },
  { label: "Penyewaan Aset", href: "#" },
  { label: "Login", href: "/login", cta: true },
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

export const CART_ITEMS: CartItem[] = [
  {
    id: "kopi-robusta",
    title: "Kopi Robusta Sukamaju Premium (250gr)",
    store: "UMKM Desa Sukamaju",
    variant: "Giling Medium (V60)",
    price: "Rp 45.000",
    originalPrice: "Rp 55.000",
    quantity: 2,
    subtotal: "Rp 90.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDk6WiWQf_QgIaN5-P8j6WqumkJbpN7CNOrbLVJL4NqhzL2kZv5p2c-xG_IPVd485z8sut7eTI1LDMZsupIGJG0-_o8LxeqavKVThVj5Y_U09bLl6QJBtw7vRHlYK-AuskH2OlQ0ovj-UbYjy9RK5E5cEXrjy7xyZ6Di9sIcWlwr58cb0kF1iNZnSCXtgqjF0eL3JKLzwT9puC1Exf_a1HefEywcsxN6T-dmwWxXlq5As-_gnl2l3mMAorsefJyZ5GUeZai4j9_HB4",
  },
  {
    id: "beras-pandan",
    title: "Beras Pandan Wangi Organik (5kg)",
    store: "Gapoktan Suka Makmur",
    price: "Rp 70.000",
    quantity: 1,
    subtotal: "Rp 70.000",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsm2KPnTd51o5-yVR4bXFUsjINiCdbRbctJ3FGycF_0XZx5sgxe7fde1Z7JQLR9Zkene-23lJjPxeUy6fqWsmmdlhrHVRfP4Scq5sJAl6bwbRgzqApv5IZB9vwagdDRE0stsht16xWPz8d3inB8MhHZrNrjoT6T4jGdaxY3_0Zop35b9s31PUDZOnpsKvhtNlV6vFtP7-9inEZWpMWgwemGTSACyN3QY8N2P4gC5O2zkLFwqVHojRSn_5nxEXq8InlXtD7kDVEb1U",
  },
];

export const CART_SUMMARY: CartSummary = {
  subtotalLabel: "Subtotal Barang (3 item)",
  subtotalValue: "Rp 160.000",
  shippingLabel: "Biaya Pengiriman",
  shippingValue: "Rp 15.000",
  discountLabel: "Diskon",
  discountValue: "- Rp 0",
  totalLabel: "Total Pembayaran",
  totalValue: "Rp 175.000",
  itemsCountLabel: "Termasuk pajak jika berlaku",
  shippingPlaceholder: "Kecamatan / Kode Pos",
  secureNote: "Transaksi Aman & Terpercaya BUMDes",
};

export const SHIPPING_ADDRESS: ShippingAddress = {
  fullName: "Budi Santoso",
  phone: "08123456789",
  label: "Rumah",
  address: "Jl. Melati No. 45, RT 02/RW 05, Dusun Sukamaju",
  province: "Jawa Barat",
  city: "Kab. Bogor",
  district: "Kec. Cibinong",
  postalCode: "16914",
};

export const SHIPPING_OPTIONS: ShippingOption[] = [
  {
    id: "bumdes-logistics",
    title: "Kurir Desa (BUMDes Logistics)",
    subtitle: "Estimasi tiba: Besok (08:00 - 17:00)",
    price: "Rp 15.000",
    recommended: true,
  },
  {
    id: "jne-reg",
    title: "JNE Reguler",
    subtitle: "Estimasi tiba: 2-3 Hari",
    price: "Rp 18.000",
  },
  {
    id: "pickup",
    title: "Ambil Sendiri di Kantor BUMDes",
    subtitle: "Siap diambil: Hari ini jam 14:00",
    price: "Gratis",
    free: true,
  },
];

export const SHIPPING_SUMMARY: ShippingSummary = {
  totalItemsLabel: "Total Harga (3 Barang)",
  totalItemsValue: "Rp 160.000",
  shippingLabel: "Biaya Pengiriman",
  shippingValue: "Rp 15.000",
  serviceFeeLabel: "Biaya Layanan",
  serviceFeeValue: "Rp 1.000",
  discountLabel: "Diskon",
  discountValue: "- Rp 0",
  totalLabel: "Total Tagihan",
  totalValue: "Rp 176.000",
  secureNote: "Data pribadi Anda dilindungi dengan aman",
  avatarImages: [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDk6WiWQf_QgIaN5-P8j6WqumkJbpN7CNOrbLVJL4NqhzL2kZv5p2c-xG_IPVd485z8sut7eTI1LDMZsupIGJG0-_o8LxeqavKVThVj5Y_U09bLl6QJBtw7vRHlYK-AuskH2OlQ0ovj-UbYjy9RK5E5cEXrjy7xyZ6Di9sIcWlwr58cb0kF1iNZnSCXtgqjF0eL3JKLzwT9puC1Exf_a1HefEywcsxN6T-dmwWxXlq5As-_gnl2l3mMAorsefJyZ5GUeZai4j9_HB4",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCsm2KPnTd51o5-yVR4bXFUsjINiCdbRbctJ3FGycF_0XZx5sgxe7fde1Z7JQLR9Zkene-23lJjPxeUy6fqWsmmdlhrHVRfP4Scq5sJAl6bwbRgzqApv5IZB9vwagdDRE0stsht16xWPz8d3inB8MhHZrNrjoT6T4jGdaxY3_0Zop35b9s31PUDZOnpsKvhtNlV6vFtP7-9inEZWpMWgwemGTSACyN3QY8N2P4gC5O2zkLFwqVHojRSn_5nxEXq8InlXtD7kDVEb1U",
  ],
  extraCountLabel: "+1",
};

export const PAYMENT_BANK_LOGOS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBpbf31piTJF8ShOfTdmNrsGGfBrw2Q2KCtni_DusoSKfyPh2QILCoSTFb8cQgGhwsOgAsgviDEt33oBoWsk_Ol-cJ0d1q4qnjH19rr-kYByZYIi66qCbCU5jlXxnMG1Xj3WIqE9ODNxzL_xLIzN3G8GbyJU-pFDmhAxfCXocjOB3Fe4AHbYiJQbflapKmtAWaGidm-N4cLDBhO2YzDSLBbIEW5KeHMEl2k5zLNd4FFfigG4Ukqti3XLjbrkg8wfdsWe1IF4DQ_WpI",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCHAhQCWJ6nNZZIpNeTdDOOqw8sAmIlxWSJym8reQBVojgcnavR2lFrjTg0lTygZC6jI2LpfT2AdxPPARsBJkXCR-M0rNJ_OZCdbxo1y_752ukuts8nJpuy2k2wMiEdGCgEPlqOwiDEklOzX1UuwgxD_dFJ91qM_ZlgtczHLFqOGlc1YWFY0q6e6kTfFuzGqJIea4Fu69KuZMzTTWWfbYbKbtOa94vvTmGh1snixGYDyOl0kjWxvqcA6PFZ9i0EYQW7nkn4Mp61S4k",
];

export const PAYMENT_VA_OPTIONS: PaymentOption[] = [
  {
    id: "bri",
    title: "Bank BRI",
    subtitle: "Dicek Otomatis",
    badgeText: "Bebas Biaya",
    icon: "account_balance",
    iconColor: "text-blue-700 dark:text-blue-400",
    bgColor: "bg-blue-50 dark:bg-blue-900/20",
    recommended: true,
  },
  {
    id: "mandiri",
    title: "Bank Mandiri",
    subtitle: "Dicek Otomatis",
    badgeText: "Rp 1.000",
    icon: "account_balance",
    iconColor: "text-yellow-700 dark:text-yellow-400",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/20",
  },
];

export const PAYMENT_OTHER_OPTIONS: PaymentOption[] = [
  {
    id: "qris",
    title: "QRIS",
    subtitle: "Scan kode QR (GoPay, OVO, Dana, LinkAja)",
    icon: "qr_code_scanner",
    iconColor: "text-gray-700 dark:text-gray-300",
    bgColor: "bg-gray-50 dark:bg-gray-800",
  },
  {
    id: "cod",
    title: "Bayar di Tempat (COD)",
    subtitle: "Bayar tunai saat kurir tiba",
    icon: "payments",
    iconColor: "text-green-700 dark:text-green-400",
    bgColor: "bg-green-50 dark:bg-green-900/20",
  },
];

export const PAYMENT_SUMMARY: ShippingSummary = {
  ...SHIPPING_SUMMARY,
  secureNote: "Pembayaran Anda dijamin aman",
};

export const REVIEW_ADDRESS: ReviewAddress = {
  name: "Budi Santoso",
  label: "Rumah",
  addressLine1: "Jl. Melati No. 45, RT 02/RW 05, Desa Sukamaju",
  addressLine2: "Kecamatan Caringin, Kabupaten Bogor, Jawa Barat 16730",
  phone: "0812-3456-7890",
  courierTag: "Kurir Desa (BUMDes)",
  courierEta: "Estimasi tiba: Besok, 10:00 - 14:00",
};

export const REVIEW_PAYMENT: ReviewPayment = {
  bankName: "Bank BRI Virtual Account",
  note: "Bebas biaya admin",
  logo:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBpbf31piTJF8ShOfTdmNrsGGfBrw2Q2KCtni_DusoSKfyPh2QILCoSTFb8cQgGhwsOgAsgviDEt33oBoWsk_Ol-cJ0d1q4qnjH19rr-kYByZYIi66qCbCU5jlXxnMG1Xj3WIqE9ODNxzL_xLIzN3G8GbyJU-pFDmhAxfCXocjOB3Fe4AHbYiJQbflapKmtAWaGidm-N4cLDBhO2YzDSLBbIEW5KeHMEl2k5zLNd4FFfigG4Ukqti3XLjbrkg8wfdsWe1IF4DQ_WpI",
};

export const REVIEW_ITEMS: ReviewItem[] = [
  {
    id: "beras-wangi",
    title: "Beras Wangi Pandan (10kg)",
    subtitle: "Produk Unggulan Desa",
    price: "Rp 115.000",
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDk6WiWQf_QgIaN5-P8j6WqumkJbpN7CNOrbLVJL4NqhzL2kZv5p2c-xG_IPVd485z8sut7eTI1LDMZsupIGJG0-_o8LxeqavKVThVj5Y_U09bLl6QJBtw7vRHlYK-AuskH2OlQ0ovj-UbYjy9RK5E5cEXrjy7xyZ6Di9sIcWlwr58cb0kF1iNZnSCXtgqjF0eL3JKLzwT9puC1Exf_a1HefEywcsxN6T-dmwWxXlq5As-_gnl2l3mMAorsefJyZ5GUeZai4j9_HB4",
  },
  {
    id: "minyak-kelapa",
    title: "Minyak Goreng Kelapa (2L)",
    subtitle: "Murni & Higienis",
    price: "Rp 35.000",
    quantity: 1,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCsm2KPnTd51o5-yVR4bXFUsjINiCdbRbctJ3FGycF_0XZx5sgxe7fde1Z7JQLR9Zkene-23lJjPxeUy6fqWsmmdlhrHVRfP4Scq5sJAl6bwbRgzqApv5IZB9vwagdDRE0stsht16xWPz8d3inB8MhHZrNrjoT6T4jGdaxY3_0Zop35b9s31PUDZOnpsKvhtNlV6vFtP7-9inEZWpMWgwemGTSACyN3QY8N2P4gC5O2zkLFwqVHojRSn_5nxEXq8InlXtD7kDVEb1U",
  },
  {
    id: "gula-pasir",
    title: "Gula Pasir Lokal (1kg)",
    subtitle: "Manis Alami",
    price: "Rp 10.000",
    quantity: 1,
    icon: "grocery",
    iconBg: "bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 text-orange-400",
  },
];

export const REVIEW_SUMMARY: ShippingSummary = {
  ...PAYMENT_SUMMARY,
  secureNote: "Pembayaran Anda dijamin aman",
};
