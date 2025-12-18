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
import { CATEGORY_OPTIONS, MARKETPLACE_HEADER } from "../constants";

export function MarketplaceHeader() {
  return (
    <div className="mb-10">
      <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
        {MARKETPLACE_HEADER.title}
      </h1>
      <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        {MARKETPLACE_HEADER.description}
      </p>

      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <span className="material-icons-outlined">search</span>
          </span>
          <Input
            placeholder={MARKETPLACE_HEADER.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus-visible:border-[#4338ca] focus-visible:ring-[#4338ca]/40 placeholder-gray-400 dark:placeholder-gray-500 h-11"
          />
        </div>

        <div className="flex gap-2">
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
        </div>
      </div>
    </div>
  );
}
