/** @format */

import { Nunito, Quicksand } from "next/font/google";
import { asRecord } from "../shared/content";
import { MaterialSymbolStyles } from "../shared/MaterialSymbolStyles";
import { TemplateTwoAdvantagesSection } from "./sections/AdvantagesSection";
import { TemplateTwoFooterSection } from "./sections/FooterSection";
import { TemplateTwoHeaderSection } from "./sections/HeaderSection";
import { TemplateTwoMarketplaceSection } from "./sections/MarketplaceSection";
import { TemplateTwoMarqueeSection } from "./sections/MarqueeSection";
import { TemplateTwoTestimonialsSection } from "./sections/TestimonialsSection";
import { TemplateTwoStyles } from "./TemplateTwoStyles";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
});

type TemplateTwoProps = {
  content?: Record<string, any>;
};

export function TemplateTwo({ content }: TemplateTwoProps) {
  const root = asRecord(content);

  return (
    <div
      className={`${quicksand.className} template-two antialiased selection:bg-market-yellow selection:text-village-dark`}
      style={{
        color: "rgb(93, 64, 55)",
        ["--template-two-display-font" as any]: nunito.style.fontFamily,
      }}
    >
      <MaterialSymbolStyles />
      <TemplateTwoStyles />

      <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-warm-bg relative">
        <div className="absolute inset-0 wavy-pattern z-0 pointer-events-none fixed" />
        <TemplateTwoHeaderSection data={asRecord(root.header)} />
        <main className="relative z-10 pt-8 pb-20 space-y-24">
          <TemplateTwoMarketplaceSection data={asRecord(root.marketplace)} />
          <TemplateTwoMarqueeSection data={asRecord(root.marquee)} />
          <TemplateTwoAdvantagesSection data={asRecord(root.advantages)} />
          <TemplateTwoTestimonialsSection data={asRecord(root.testimonials)} />
        </main>
        <TemplateTwoFooterSection data={asRecord(root.footer)} />
      </div>
    </div>
  );
}
