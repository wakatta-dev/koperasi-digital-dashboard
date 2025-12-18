/** @format */

export function ShippingBreadcrumbs() {
  return (
    <nav className="flex mb-8 text-sm text-gray-500 dark:text-gray-400 overflow-x-auto whitespace-nowrap pb-2">
      <a className="hover:text-[#4338ca] transition" href="#">
        Beranda
      </a>
      <span className="mx-2">/</span>
      <a className="hover:text-[#4338ca] transition" href="#">
        Marketplace
      </a>
      <span className="mx-2">/</span>
      <a className="hover:text-[#4338ca] transition" href="#">
        Keranjang
      </a>
      <span className="mx-2">/</span>
      <span className="text-gray-900 dark:text-white font-medium">Informasi Pengiriman</span>
    </nav>
  );
}
