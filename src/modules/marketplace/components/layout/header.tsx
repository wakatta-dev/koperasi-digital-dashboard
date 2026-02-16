/** @format */

import { InputField } from "@/components/shared/inputs/input-field";
import { Button } from "@/components/ui/button";
import { SearchHeroBase } from "@/components/shared/layout/SearchHeroBase";
import Link from "next/link";
import { MARKETPLACE_HEADER } from "../../constants";

type Props = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  onSubmit: () => void;
};

export function MarketplaceHeader({
  searchValue,
  onSearchChange,
  onSubmit,
}: Props) {
  const inputSlot = (
    <InputField
      data-testid="marketplace-header-search-input"
      ariaLabel={MARKETPLACE_HEADER.searchPlaceholder}
      size="lg"
      startIcon={<span className="material-icons-outlined">search</span>}
      value={searchValue}
      onValueChange={onSearchChange}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onSubmit();
        }
      }}
      placeholder={MARKETPLACE_HEADER.searchPlaceholder}
    />
  );

  const ctaSlot = (
    <>
      <Link
        data-testid="marketplace-header-track-order-link"
        href="/marketplace/pengiriman"
        className="inline-flex h-11 items-center rounded-xl border border-indigo-100 bg-indigo-50 px-4 text-sm font-medium text-indigo-600 transition hover:bg-indigo-100"
      >
        Lacak Pesanan
      </Link>
      <Button
        data-testid="marketplace-header-search-submit-button"
        onClick={onSubmit}
        className="h-11 rounded-xl bg-indigo-600 px-6 py-2.5 font-medium text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-700"
      >
        Cari
      </Button>
    </>
  );

  return (
    <SearchHeroBase
      title={MARKETPLACE_HEADER.title}
      description={MARKETPLACE_HEADER.description}
      inputSlot={inputSlot}
      ctaSlot={ctaSlot}
    />
  );
}
