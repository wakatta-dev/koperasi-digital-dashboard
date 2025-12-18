/** @format */

import { LandingNavbar } from "./components/navbar";
import { LandingHero } from "./components/hero";
import { LandingAbout } from "./components/about";
import { BusinessUnits } from "./components/business-units";
import { ProductHighlight } from "./components/product-highlight";
import { AdvantagesSection } from "./components/advantages";
import { TestimonialSection } from "./components/testimonial";
import { LandingFooter } from "./components/footer";

export function LandingPage() {
  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] text-[#334155] dark:text-[#cbd5e1] min-h-screen">
      <LandingNavbar activeLabel="Beranda" />
      <main>
        <LandingHero />
        <LandingAbout />
        <BusinessUnits />
        <ProductHighlight />
        <AdvantagesSection />
        <TestimonialSection />
      </main>
      <LandingFooter />
    </div>
  );
}
