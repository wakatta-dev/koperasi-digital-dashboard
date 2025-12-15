/** @format */

import type { ReactNode } from "react";
import { AuthHero } from "./auth-hero";
import { cn } from "@/lib/utils";

type AuthLayoutProps = {
  children: ReactNode;
  heroPosition?: "left" | "right";
  className?: string;
};

export function AuthLayout({
  children,
  heroPosition = "left",
  className,
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-muted/60">
      <div
        className={cn(
          "flex min-h-screen w-full  flex-col overflow-hidden border bg-card text-foreground shadow-xl lg:flex-row",
          className
        )}
      >
        {heroPosition === "left" && <AuthHero />}
        <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-1/2 lg:px-14 xl:px-20">
          <div className="w-full max-w-md">{children}</div>
        </div>
        {heroPosition === "right" && <AuthHero />}
      </div>
    </div>
  );
}
