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
    <>
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
        <span className="material-icons-outlined">search</span>
      </span>
      <Input
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSubmit();
          }
        }}
        placeholder={MARKETPLACE_HEADER.searchPlaceholder}
        className="w-full pl-10 pr-4 py-2.5 rounded-lg h-11"
      />
    </>
  );

  const ctaSlot = (
    <>
      <Select defaultValue={CATEGORY_OPTIONS[0]}>
        <SelectTrigger
          style={{ height: 44 }}
          className="w-full md:w-48 px-4 rounded-lg"
        >
          <SelectValue placeholder="Semua Kategori" />
        </SelectTrigger>
        <SelectContent className="bg-popover text-foreground border border-border">
          {CATEGORY_OPTIONS.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        onClick={onSubmit}
        className="bg-indigo-600 h-11 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg font-medium transition shadow-md shadow-indigo-500/20 flex items-center gap-2"
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
