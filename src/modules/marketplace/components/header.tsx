/** @format */

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { SearchHeroBase } from "@/components/shared/layout/SearchHeroBase";
import { CATEGORY_OPTIONS, MARKETPLACE_HEADER } from "../constants";

export function MarketplaceHeader() {
  const inputSlot = (
    <>
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <span className="material-icons-outlined">search</span>
      </span>
      <Input
        placeholder={MARKETPLACE_HEADER.searchPlaceholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca]/40 placeholder-gray-400 dark:placeholder-gray-500 h-11"
      />
    </>
  );

  const ctaSlot = (
    <>
      <Select defaultValue={CATEGORY_OPTIONS[0]}>
        <SelectTrigger className="w-full md:w-48 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white h-11 focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca]/40">
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700">
          {CATEGORY_OPTIONS.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button className="bg-[#4338ca] hover:bg-[#3730a3] text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md shadow-indigo-500/20 h-11 flex items-center gap-2">
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
