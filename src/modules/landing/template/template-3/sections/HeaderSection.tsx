/** @format */

import { asArray, asHref, asRecord, asString } from "../../shared/content";

const MARKETPLACE_URL = "/marketplace";
const ASSET_RENTAL_URL = "/penyewaan-aset";

function normalizeNavUrl(value: string): string {
  return value.trim().toLowerCase();
}

type TemplateThreeHeaderSectionProps = {
  data?: Record<string, any>;
};

export function TemplateThreeHeaderSection({ data }: TemplateThreeHeaderSectionProps) {
  const section = asRecord(data);

  const brandName = asString(section.brand_name, "Koperasi Sejahtera");
  const primaryButtonLabel = asString(section.primary_button_label, "Daftar Anggota");
  const secondaryButtonLabel = asString(section.secondary_button_label, "Login");
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
    <div className="w-full flex justify-center sticky top-0 z-50 bg-off-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="layout-content-container flex flex-col w-full max-w-[1280px]">
        <header className="flex items-center justify-between px-4 lg:px-10 py-5">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary text-accent rounded-xl flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-2xl">account_balance</span>
            </div>
            <h2 className="text-primary text-xl font-black tracking-tight">{brandName}</h2>
          </div>

          <div className="flex flex-1 justify-end gap-8">
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <a key={`${item.label}-${item.url}`} className="text-gray-700 hover:text-primary text-sm font-semibold transition-colors" href={item.url}>
                  {item.label}
                </a>
              ))}
            </div>

            <div className="flex gap-3">
              <button className="hidden sm:flex min-w-[120px] cursor-pointer items-center justify-center rounded-full h-11 px-6 bg-primary hover:bg-indigo-900 text-white text-sm font-bold transition-all shadow-md">
                {primaryButtonLabel}
              </button>
              <button className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-full h-11 px-6 bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 text-sm font-bold transition-all">
                {secondaryButtonLabel}
              </button>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
}
