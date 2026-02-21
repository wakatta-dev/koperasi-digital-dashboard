/** @format */

import { Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { asRecord } from "../shared/content";
import { MaterialSymbolStyles } from "../shared/MaterialSymbolStyles";
import { TemplateThreeAdvantagesSection } from "./sections/AdvantagesSection";
import { TemplateThreeFooterSection } from "./sections/FooterSection";
import { TemplateThreeHeaderSection } from "./sections/HeaderSection";
import { TemplateThreeHeroSection } from "./sections/HeroSection";
import { TemplateThreeServicesSection } from "./sections/ServicesSection";
import { TemplateThreeStatsSection } from "./sections/StatsSection";
import { TemplateThreeStyles } from "./TemplateThreeStyles";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
});

type TemplateThreeProps = {
  content?: Record<string, any>;
};

export function TemplateThree({ content }: TemplateThreeProps) {
  const root = asRecord(content);

  return (
    <div
      className={`${plusJakartaSans.className} template-three relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden transition-colors duration-200 bg-off-white text-[rgb(26,26,26)]`}
      style={{
        backgroundImage: "url('https://www.transparenttextures.com/patterns/p6.png')",
        ["--template-three-display-font" as any]: outfit.style.fontFamily,
      }}
    >
      <MaterialSymbolStyles />
      <TemplateThreeStyles />
      <TemplateThreeHeaderSection data={asRecord(root.header)} />
      <TemplateThreeHeroSection data={asRecord(root.hero)} />
      <TemplateThreeServicesSection data={asRecord(root.services)} />
      <TemplateThreeAdvantagesSection data={asRecord(root.advantages)} />
      <TemplateThreeStatsSection data={asRecord(root.stats)} />
      <TemplateThreeFooterSection data={asRecord(root.footer)} />
    </div>
  );
}
