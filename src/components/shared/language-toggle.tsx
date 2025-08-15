/** @format */

"use client";

import { useLanguage } from "@/contexts/language-context";
import { Button } from "@/components/ui/button";

export function LanguageToggle() {
  const { lang, toggleLanguage } = useLanguage();
  return (
    <Button variant="ghost" size="sm" onClick={toggleLanguage}>
      {lang.toUpperCase()}
    </Button>
  );
}
