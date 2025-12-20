/** @format */

import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export type SearchHeroProps = {
  title: string;
  description: string;
  input: {
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    placeholder: string;
    icon?: ReactNode;
  };
  cta: {
    label: string;
    onClick: () => void;
  };
  badge?: string | ReactNode;
  backgroundImage?: string;
  children?: ReactNode;
  className?: string;
};

export function SearchHero({
  title,
  description,
  input,
  cta,
  badge,
  backgroundImage,
  children,
  className,
}: SearchHeroProps) {
  return (
    <div
      className={cn(
        "relative bg-card border-b border-border overflow-hidden",
        className,
      )}
    >
      {backgroundImage ? (
        <div className="absolute inset-0 z-0 opacity-10 dark:opacity-20 pointer-events-none">
          <img
            src={backgroundImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-3xl space-y-6">
          {badge ? (
            <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary font-semibold text-xs uppercase tracking-wide">
              {badge}
            </span>
          ) : null}
          <h1 className="text-3xl md:text-5xl font-extrabold text-foreground">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            {description}
          </p>

          <div className="bg-card p-2 rounded-2xl shadow-lg border border-border flex flex-col sm:flex-row gap-2 max-w-2xl">
            <div className="relative flex-grow">
              {input.icon ? (
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {input.icon}
                </span>
              ) : null}
              <Input
                type="text"
                value={input.value}
                onChange={(e) => input.onChange(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    input.onSubmit();
                  }
                }}
                placeholder={input.placeholder}
                className={cn(
                  "w-full pr-4 py-3 bg-transparent border-none focus-visible:ring-0 text-foreground placeholder:text-muted-foreground h-[48px]",
                  input.icon ? "pl-12" : "pl-4",
                )}
              />
            </div>
            <div className="sm:border-l border-border sm:pl-2">
              <Button
                onClick={cta.onClick}
                className="w-full sm:w-auto h-[48px] px-8 py-3 rounded-xl font-semibold transition shadow-md"
              >
                {cta.label}
              </Button>
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
