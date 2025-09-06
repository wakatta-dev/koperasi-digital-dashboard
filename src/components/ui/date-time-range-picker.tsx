/** @format */

"use client";

import * as React from "react";
import { ChevronDownIcon } from "lucide-react";
import { format as fmt } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
  timeStep?: number; // seconds, default 60
};

function toLocalDateString(d?: Date | null): string | undefined {
  if (!d) return undefined;
  return fmt(d, "yyyy-MM-dd");
}

function toLocalTimeString(d?: Date | null): string | undefined {
  if (!d) return undefined;
  return fmt(d, "HH:mm");
}

function toLocalDateTimeString(date?: Date | null): string | undefined {
  if (!date) return undefined;
  return fmt(date, "yyyy-MM-dd'T'HH:mm");
}

function parseToDate(value?: string | Date): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return value;
  const d = new Date(value);
  return isNaN(d.getTime()) ? undefined : d;
}

function combine(date?: Date, time?: string, fallback: "start" | "end" = "start"): Date | undefined {
  if (!date) return undefined;
  const [hh, mm] = (time && time.includes(":")) ? time.split(":") : [undefined, undefined];
  const out = new Date(date);
  if (typeof hh !== "undefined" && typeof mm !== "undefined") {
    out.setHours(Number(hh), Number(mm), 0, 0);
  } else {
    if (fallback === "start") out.setHours(0, 0, 0, 0);
    else out.setHours(23, 59, 0, 0);
  }
  return out;
}

export function DateTimeRangePicker({
  id,
  label,
  placeholder = "Pilih rentang waktu",
  className,
  value,
  onChange,
  disabled,
  captionLayout = "dropdown",
  triggerClassName,
  numberOfMonths = 2,
  timeStep = 60,
}: Props) {
  const controlled = typeof value !== "undefined" || typeof onChange !== "undefined";
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [startDate, setStartDate] = React.useState<Date | undefined>(parseToDate(value?.start));
  const [endDate, setEndDate] = React.useState<Date | undefined>(parseToDate(value?.end));
  const [startTime, setStartTime] = React.useState<string | undefined>(toLocalTimeString(parseToDate(value?.start)));
  const [endTime, setEndTime] = React.useState<string | undefined>(toLocalTimeString(parseToDate(value?.end)));

  React.useEffect(() => {
    if (!controlled) return;
    const s = parseToDate(value?.start);
    const e = parseToDate(value?.end);
    setStartDate(s);
    setEndDate(e);
    setStartTime(toLocalTimeString(s));
    setEndTime(toLocalTimeString(e));
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

  function emitChange(nextStartDate?: Date, nextEndDate?: Date, nextStartTime?: string, nextEndTime?: string) {
    if (!onChange) return;
    const s = combine(nextStartDate, nextStartTime, "start");
    const e = combine(nextEndDate, nextEndTime, "end");
    onChange(toLocalDateTimeString(s), toLocalDateTimeString(e), { start: s, end: e });
  }

  const hasBoth = startDate && endDate;
  const display = hasBoth
    ? `${toLocalDateString(startDate)} ${startTime ?? "00:00"} – ${toLocalDateString(endDate)} ${endTime ?? "23:59"}`
    : placeholder;

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
          className={cn("w-[360px] justify-between font-normal", triggerClassName)}
          onClick={() => setOpen((v) => !v)}
          disabled={disabled}
        >
          {display}
          <ChevronDownIcon className="ml-2 size-4" />
        </Button>
        {open ? (
          <div className="absolute left-0 z-50 mt-1 w-auto overflow-hidden rounded-md border bg-popover p-3 shadow-md">
            <div className="flex flex-col gap-3">
              <Calendar
                mode="range"
                numberOfMonths={numberOfMonths}
                captionLayout={captionLayout}
                selected={{ from: startDate, to: endDate }}
                onSelect={(range) => {
                  const s = range?.from ?? undefined;
                  const e = range?.to ?? undefined;
                  if (controlled) {
                    emitChange(s, e, startTime, endTime);
                  } else {
                    setStartDate(s);
                    setEndDate(e);
                  }
                }}
              />
              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label className="text-xs">Mulai</Label>
                  <Input
                    type="time"
                    step={timeStep}
                    value={startTime ?? ""}
                    onChange={(e) => {
                      const t = e.target.value;
                      if (controlled) emitChange(startDate, endDate, t, endTime);
                      else setStartTime(t);
                    }}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label className="text-xs">Selesai</Label>
                  <Input
                    type="time"
                    step={timeStep}
                    value={endTime ?? ""}
                    onChange={(e) => {
                      const t = e.target.value;
                      if (controlled) emitChange(startDate, endDate, startTime, t);
                      else setEndTime(t);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default DateTimeRangePicker;

