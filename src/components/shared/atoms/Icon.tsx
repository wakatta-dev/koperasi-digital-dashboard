/** @format */

"use client";

import React from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type IconName = "symbol-circle-warning" | "symbol-circle-checklist";

const ICON_MAP: Record<IconName, React.ElementType> = {
  "symbol-circle-warning": AlertCircle,
  "symbol-circle-checklist": CheckCircle2,
};

export default function Icon({ icon, className }: { icon: IconName; className?: string }) {
  const Cmp = ICON_MAP[icon] ?? AlertCircle;
  return <Cmp className={cn("inline-block", className)} />;
}

