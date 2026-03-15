/** @format */

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AssetRentalDialogShellProps = Readonly<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  contentTestId?: string;
}>;

export function AssetRentalDialogShell({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  contentTestId,
}: AssetRentalDialogShellProps) {
  const fallbackDescription = "Dialog aksi asset rental";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="border-slate-200 bg-white sm:max-w-lg"
        data-testid={contentTestId}
      >
        <DialogHeader>
          <DialogTitle className="text-slate-800">{title}</DialogTitle>
          <DialogDescription className={description ? "text-slate-500" : "sr-only"}>
            {description ?? fallbackDescription}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">{children}</div>
        {footer ? <DialogFooter>{footer}</DialogFooter> : null}
      </DialogContent>
    </Dialog>
  );
}
