/** @format */

"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { format as fmt } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
  id?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  /**
   * Controlled value. If string, expected format is yyyy-MM-dd
   */
  value?: string | Date;
  /**
   * Controlled change handler. First arg is yyyy-MM-dd or undefined
   */
  onChange?: (value?: string, date?: Date) => void;
  disabled?: boolean;
  /**
   * Calendar caption layout
   */
  captionLayout?: "label" | "dropdown";
  /**
   * Button className for the trigger
   */
  triggerClassName?: string;
};

function toISODateString(date?: Date | null): string | undefined {
  if (!date) return undefined;
  return fmt(date, "yyyy-MM-dd");
}

function parseToDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  // Parsing yyyy-MM-dd into Date (local)
  // Use Date constructor; it treats yyyy-MM-dd as UTC, which is fine for pure date usage
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

export function DatePicker({
  id,
  label,
  placeholder = "Select date",
  className,
  value,
  onChange,
  disabled,
  captionLayout = "dropdown",
  triggerClassName,
}: Props) {
  const controlled = typeof value !== "undefined" || typeof onChange !== "undefined";
  const [open, setOpen] = React.useState(false);
  const [innerDate, setInnerDate] = React.useState<Date | undefined>(parseToDate(value));
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Keep internal state in sync when controlled
  React.useEffect(() => {
    if (!controlled) return;
    setInnerDate(parseToDate(value));
  }, [controlled, value]);

  React.useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!containerRef.current) return;
      if (!(e.target instanceof Node)) return;
      if (!containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const selected = innerDate;
  const display = selected ? toISODateString(selected) : undefined;

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
          className={cn("w-48 justify-between font-normal", triggerClassName)}
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
        >
          {display || placeholder}
          <ChevronDownIcon className="ml-2 size-4" />
        </Button>
        {open ? (
          <div
            className="absolute left-0 z-50 mt-1 w-auto overflow-hidden rounded-md border bg-popover p-0 shadow-md"
            role="dialog"
            aria-modal="true"
          >
            <Calendar
              mode="single"
              captionLayout={captionLayout}
              selected={selected}
              onSelect={(date) => {
                if (controlled) {
                  onChange?.(toISODateString(date), date ?? undefined);
                } else {
                  setInnerDate(date ?? undefined);
                }
                setOpen(false);
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DatePicker;

