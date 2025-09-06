/** @format */

"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { format as fmt } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Dateish = string | Date | undefined;

type Props = {
  id?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  value?: { start?: Dateish; end?: Dateish };
  onChange?: (start?: string, end?: string, dates?: { start?: Date; end?: Date }) => void;
  disabled?: boolean;
  captionLayout?: "label" | "dropdown";
  triggerClassName?: string;
  numberOfMonths?: number;
};

function toISODateString(date?: Date | null): string | undefined {
  if (!date) return undefined;
  return fmt(date, "yyyy-MM-dd");
}

function parseToDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

export function DateRangePicker({
  id,
  label,
  placeholder = "Select date range",
  className,
  value,
  onChange,
  disabled,
  captionLayout = "dropdown",
  triggerClassName,
  numberOfMonths = 2,
}: Props) {
  const controlled = typeof value !== "undefined" || typeof onChange !== "undefined";
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [start, setStart] = React.useState<Date | undefined>(parseToDate(value?.start));
  const [end, setEnd] = React.useState<Date | undefined>(parseToDate(value?.end));

  React.useEffect(() => {
    if (!controlled) return;
    setStart(parseToDate(value?.start));
    setEnd(parseToDate(value?.end));
  }, [controlled, value?.start, value?.end]);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const display = start && end ? `${toISODateString(start)} – ${toISODateString(end)}` : placeholder;

  return (
    <div className={cn("flex flex-col gap-2", className)} ref={containerRef}>
      {label ? (
        <Label htmlFor={id} className="px-1">
          {label}
        </Label>
      ) : null}
      <div className="relative inline-block">
        <Button
          type="button"
          variant="outline"
          id={id}
          className={cn("w-[280px] justify-between font-normal", triggerClassName)}
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
        >
          {display}
          <ChevronDownIcon className="ml-2 size-4" />
        </Button>
        {open ? (
          <div className="absolute left-0 z-50 mt-1 w-auto overflow-hidden rounded-md border bg-popover p-0 shadow-md">
            <Calendar
              mode="range"
              numberOfMonths={numberOfMonths}
              captionLayout={captionLayout}
              selected={{ from: start, to: end }}
              onSelect={(range) => {
                const s = range?.from ?? undefined;
                const e = range?.to ?? undefined;
                if (controlled) {
                  onChange?.(toISODateString(s), toISODateString(e), { start: s, end: e });
                } else {
                  setStart(s);
                  setEnd(e);
                }
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DateRangePicker;

