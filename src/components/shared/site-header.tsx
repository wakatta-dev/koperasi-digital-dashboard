/** @format */
"use client";

import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useLanguage } from "@/contexts/language-context";
import { Button } from "../ui/button";

export function SiteHeader() {
  const { lang, toggleLanguage, t } = useLanguage();
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{t("documents")}</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleLanguage}
        className="mr-2"
      >
        {lang === "en" ? "ID" : "EN"}
      </Button>
    </header>
  );
}
