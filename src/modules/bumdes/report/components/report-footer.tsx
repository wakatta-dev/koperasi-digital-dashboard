/** @format */

import { cn } from "@/lib/utils";

type ReportFooterProps = {
  updatedLabel: string;
  brandText?: string;
  className?: string;
};

export function ReportFooter({
  updatedLabel,
  brandText = "© 2023 3Portals App. Hak Cipta Dilindungi.",
  className,
}: ReportFooterProps) {
  return (
    <div
      className={cn(
        "pt-4 border-t border-border text-xs text-muted-foreground flex flex-col sm:flex-row justify-between items-center gap-2",
        className
      )}
    >
      <span>{brandText}</span>
      <span>{updatedLabel}</span>
    </div>
  );
}
