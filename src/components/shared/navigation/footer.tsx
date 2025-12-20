/** @format */

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type FooterSection = {
  title: string;
  links: Array<{ label: string; href: string }>;
};

export type FooterProps = {
  brand: { name: string; icon?: ReactNode };
  sections: FooterSection[];
  legalLinks?: Array<{ label: string; href: string }>;
  socials?: Array<{ icon: ReactNode; href: string; label?: string }>;
  copyright?: string;
  className?: string;
};

export function Footer({
  brand,
  sections,
  legalLinks,
  socials,
  copyright,
  className,
}: FooterProps) {
  return (
    <footer className={cn("bg-primary text-primary-foreground pt-16 pb-8", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              {brand.icon ? brand.icon : null}
              <span className="font-bold text-xl">{brand.name}</span>
            </div>
          </div>
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-primary-foreground/80">
                {section.title}
              </h4>
              <ul className="space-y-2 text-sm text-primary-foreground/90">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="hover:underline">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/80">
            {copyright ?? "All rights reserved."}
          </p>
          {legalLinks ? (
            <div className="flex gap-6 text-xs text-primary-foreground/80">
              {legalLinks.map((link) => (
                <a key={link.label} href={link.href} className="hover:underline">
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
          {socials ? (
            <div className="flex gap-4">
              {socials.map((social, idx) => (
                <a
                  key={`${social.href}-${idx}`}
                  href={social.href}
                  aria-label={social.label ?? "social link"}
                  className="text-primary-foreground/80 hover:text-primary-foreground transition"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
