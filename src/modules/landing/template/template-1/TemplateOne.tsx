/** @format */

import { Inter } from "next/font/google";
import { asRecord } from "../shared/content";
import { MaterialSymbolStyles } from "../shared/MaterialSymbolStyles";
import { TemplateOneAboutSection } from "./sections/AboutSection";
import { TemplateOneFeaturesSection } from "./sections/FeaturesSection";
import { TemplateOneFooterSection } from "./sections/FooterSection";
import { TemplateOneHeaderSection } from "./sections/HeaderSection";
import { TemplateOneHeroSection } from "./sections/HeroSection";
import { TemplateOneProductsSection } from "./sections/ProductsSection";
import { TemplateOneTestimonialsSection } from "./sections/TestimonialsSection";
import { TemplateOneStyles } from "./TemplateOneStyles";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

type TemplateOneProps = {
  content?: Record<string, any>;
};

export function TemplateOne({ content }: TemplateOneProps) {
  const root = asRecord(content);

  return (
    <div
      className={`${inter.className} template-one bg-background-light text-slate-900 dark:bg-background-dark dark:text-slate-100 min-h-screen flex flex-col font-display overflow-x-hidden`}
    >
      <MaterialSymbolStyles />
      <TemplateOneStyles />
      <TemplateOneHeaderSection data={asRecord(root.header)} />
      <TemplateOneHeroSection data={asRecord(root.hero)} />
      <TemplateOneFeaturesSection data={asRecord(root.features)} />
      <TemplateOneAboutSection data={asRecord(root.about)} />
      <TemplateOneProductsSection data={asRecord(root.products)} />
      <TemplateOneTestimonialsSection data={asRecord(root.testimonials)} />
      <TemplateOneFooterSection data={asRecord(root.footer)} />
    </div>
  );
}
