/** @format */

"use client";

import { useEffect, useMemo, useState } from "react";
import { LandingNavbar } from "@/components/shared/navigation/landing-navbar";
import { LandingHero } from "./components/hero";
import { LandingAbout } from "./components/about";
import { BusinessUnits } from "./components/business-units";
import { ProductHighlight } from "./components/product-highlight";
import { AdvantagesSection } from "./components/advantages";
import { TestimonialSection } from "./components/testimonial";
import { LandingFooter } from "./components/footer";
import { getLandingPagePublic } from "@/services/landing-page";
import { DEFAULT_LANDING_CONTENT } from "./constants";
import type { LandingPageConfig } from "@/types/landing-page";

const FALLBACK_CONFIG = DEFAULT_LANDING_CONTENT as unknown as LandingPageConfig;

const mergeList = <T,>(base?: T[], incoming?: T[]) =>
  incoming && incoming.length > 0 ? incoming : base ?? [];

const mergeConfig = (
  base: LandingPageConfig,
  incoming?: LandingPageConfig
): LandingPageConfig => {
  if (!incoming) return base;
  const navigationItems = mergeList(base.navigation?.items, incoming.navigation?.items);
  const aboutValues = mergeList(base.about?.values, incoming.about?.values);
  const advantageItems = mergeList(base.advantages?.items, incoming.advantages?.items);
  const businessUnits = mergeList(
    base.business_units?.items,
    incoming.business_units?.items
  );
  const testimonials = mergeList(base.testimonials?.items, incoming.testimonials?.items);
  const footerColumns = mergeList(base.footer?.columns, incoming.footer?.columns);
  const footerSocialLinks = mergeList(
    base.footer?.social_links,
    incoming.footer?.social_links
  );
  return {
    ...base,
    ...incoming,
    navigation: {
      ...base.navigation,
      ...incoming.navigation,
      items: navigationItems,
    },
    hero: { ...base.hero, ...incoming.hero },
    about: {
      ...base.about,
      ...incoming.about,
      values: aboutValues,
    },
    advantages: {
      ...base.advantages,
      ...incoming.advantages,
      items: advantageItems,
    },
    featured_product: {
      ...base.featured_product,
      ...incoming.featured_product,
    },
    business_units: {
      ...base.business_units,
      ...incoming.business_units,
      items: businessUnits,
    },
    testimonials: {
      ...base.testimonials,
      ...incoming.testimonials,
      items: testimonials,
    },
    footer: {
      ...base.footer,
      ...incoming.footer,
      social_links: footerSocialLinks,
      columns: footerColumns,
    },
  };
};

export function LandingPage() {
  const [config, setConfig] = useState<LandingPageConfig>(FALLBACK_CONFIG);

  useEffect(() => {
    let active = true;
    async function load() {
      const res = await getLandingPagePublic();
      if (!active) return;
      if (res.success) {
        // TODO: fix this error types
        setConfig(mergeConfig(FALLBACK_CONFIG, res.data ?? undefined));
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const navigation = useMemo(() => config.navigation, [config.navigation]);

  return (
    <div className="bg-surface-subtle dark:bg-surface-dark text-surface-text dark:text-surface-text-dark min-h-screen">
      <LandingNavbar activeLabel="Beranda" navigation={navigation} />
      <main>
        <LandingHero hero={config.hero} />
        <LandingAbout about={config.about} />
        <BusinessUnits businessUnits={config.business_units} />
        <ProductHighlight featuredProduct={config.featured_product} />
        <AdvantagesSection advantages={config.advantages} />
        <TestimonialSection testimonials={config.testimonials} />
      </main>
      <LandingFooter
        footer={config.footer}
        brandName={navigation?.brand_name}
      />
    </div>
  );
}
