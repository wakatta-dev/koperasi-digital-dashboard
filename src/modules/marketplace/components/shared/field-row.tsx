/** @format */

import type { ReactNode } from "react";

type FieldRowProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export function FieldRow({ label, hint, children }: FieldRowProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  );
}
