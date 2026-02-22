/** @format */

import { asArray, asHref, asRecord, asString } from "../../shared/content";

const MARKETPLACE_URL = "/marketplace";
const ASSET_RENTAL_URL = "/penyewaan-aset";

function normalizeNavUrl(value: string): string {
  return value.trim().toLowerCase();
}

type TemplateTwoHeaderSectionProps = {
  data?: Record<string, any>;
};

export function TemplateTwoHeaderSection({ data }: TemplateTwoHeaderSectionProps) {
  const section = asRecord(data);
  const brandName = asString(section.brand_name, "Pasar");
  const brandHighlight = asString(section.brand_highlight, "Desa");
  const authButtonLabel = asString(section.auth_button_label, "Masuk / Daftar");
  const rawMarketplaceLabel =
    typeof section.marketplace_nav_label === "string"
      ? section.marketplace_nav_label
      : "";
  const rawAssetRentalLabel =
    typeof section.asset_rental_nav_label === "string"
      ? section.asset_rental_nav_label
      : "";

  const parsedNavLinks = asArray(section.nav_links)
    .map((item) => {
      const itemMap = asRecord(item);
      return {
        label: asString(itemMap.label),
        url: asHref(itemMap.url),
      };
    })
    .filter((item) => item.label !== "");

  const legacyMarketplace = parsedNavLinks.find(
    (item) => normalizeNavUrl(item.url) === MARKETPLACE_URL,
  );
  const legacyAssetRental = parsedNavLinks.find(
    (item) => normalizeNavUrl(item.url) === ASSET_RENTAL_URL,
  );

  const marketplaceNavLabel = asString(
    section.marketplace_nav_label,
    legacyMarketplace?.label ?? parsedNavLinks[0]?.label ?? "Marketplace",
  );
  const assetRentalNavLabel = asString(
    section.asset_rental_nav_label,
    legacyAssetRental?.label ?? parsedNavLinks[1]?.label ?? "Penyewaan Aset",
  );

  const shouldShiftLegacyLinks =
    rawMarketplaceLabel.trim() === "" &&
    rawAssetRentalLabel.trim() === "" &&
    !legacyMarketplace &&
    !legacyAssetRental;

  const candidateAdditionalLinks = shouldShiftLegacyLinks
    ? parsedNavLinks.slice(2)
    : parsedNavLinks;

  const additionalLinks = candidateAdditionalLinks
    .filter((item) => {
      const normalized = normalizeNavUrl(item.url);
      return normalized !== MARKETPLACE_URL && normalized !== ASSET_RENTAL_URL;
    })
    .slice(0, 3);

  const navLinks = [
    { label: marketplaceNavLabel, url: MARKETPLACE_URL },
    { label: assetRentalNavLabel, url: ASSET_RENTAL_URL },
    ...additionalLinks,
  ].slice(0, 5);

  return (
    <header className="sticky top-4 z-50 w-full px-4 md:px-6">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-md rounded-full border-4 border-market-yellow shadow-lg px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="size-12 flex items-center justify-center rounded-full bg-market-orange text-white shadow-md group-hover:rotate-12 transition-transform">
            <span className="material-symbols-outlined text-3xl">storefront</span>
          </div>
          <span className="text-2xl font-black text-village-dark tracking-tight hidden sm:block">
            {brandName}
            <span className="text-market-orange">{brandHighlight}</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 font-bold text-village-brown">
          {navLinks.map((item) => (
            <a key={`${item.label}-${item.url}`} className="hover:text-market-red transition-colors" href={item.url}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button className="size-12 rounded-full bg-market-teal/20 text-market-teal hover:bg-market-teal hover:text-white transition-colors flex items-center justify-center font-bold">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="hidden md:flex h-12 px-6 items-center rounded-full bg-village-dark text-white font-black text-sm hover:bg-market-red transition-all shadow-md btn-pop">
            {authButtonLabel}
          </button>
          <button className="md:hidden p-2 text-village-dark">
            <span className="material-symbols-outlined text-3xl">menu</span>
          </button>
        </div>
      </div>
    </header>
  );
}
