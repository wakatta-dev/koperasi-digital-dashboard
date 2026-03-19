"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import { formatLocalDateOnly, parseLocalDateInput } from "@/lib/date-only"
import { cn } from "@/lib/utils"

type AccessibleLabel =
  | { label: string; ariaLabel?: never }
  | { label?: never; ariaLabel: string }

type DatePickerFieldProps = AccessibleLabel & {
  id?: string
  name?: string
  value: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  helperText?: React.ReactNode
  errorText?: React.ReactNode
  placeholder?: string
  className?: string
  labelClassName?: string
  triggerClassName?: string
  dialogTitle?: string
  minDate?: Date
  maxDate?: Date
  "data-testid"?: string
}

function formatDisplayDate(value?: string) {
  const parsed = parseLocalDateInput(value)
  if (!parsed) return ""
  return parsed.toLocaleDateString("id-ID", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function isSameMonth(left: Date, right: Date) {
  return (
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth()
  )
}

function DatePickerField({
  id: idProp,
  name,
  label,
  ariaLabel,
  value,
  onValueChange,
  disabled,
  helperText,
  errorText,
  placeholder = "Pilih tanggal",
  className,
  labelClassName,
  triggerClassName,
  dialogTitle,
  minDate,
  maxDate,
  "data-testid": dataTestId,
}: DatePickerFieldProps) {
  const reactId = React.useId()
  const id = idProp ?? `date-picker-${reactId}`
  const [open, setOpen] = React.useState(false)
  const selectedDate = parseLocalDateInput(value)
  const selectedTimestamp = selectedDate?.getTime() ?? null
  const minTimestamp = minDate?.getTime() ?? null
  const [viewMonth, setViewMonth] = React.useState<Date>(
    selectedDate ?? minDate ?? new Date(),
  )
  const wrapperRef = React.useRef<HTMLDivElement | null>(null)
  const displayValue = formatDisplayDate(value)
  const computedAriaLabel = label ?? ariaLabel

  React.useEffect(() => {
    if (!open) return
    const nextMonth = selectedDate ?? minDate ?? new Date()
    setViewMonth((current) =>
      isSameMonth(current, nextMonth) ? current : nextMonth
    )
  }, [open, selectedTimestamp, minTimestamp])

  React.useEffect(() => {
    if (!open) return

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return
      if (wrapperRef.current?.contains(target)) return
      setOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handlePointerDown)
    document.addEventListener("touchstart", handlePointerDown)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
      document.removeEventListener("touchstart", handlePointerDown)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  return (
    <div ref={wrapperRef} className={cn("form-field relative", className)}>
      {label ? (
        <Label htmlFor={id} className={cn(labelClassName)}>
          {label}
        </Label>
      ) : null}

      <input id={id} name={name} type="hidden" value={value} readOnly />

      <Button
        type="button"
        variant="outline"
        disabled={disabled}
        aria-label={computedAriaLabel}
        aria-expanded={open}
        aria-haspopup="dialog"
        data-testid={dataTestId}
        className={cn(
          "w-full justify-start border-gray-300 bg-background text-left font-normal text-foreground",
          !displayValue && "text-muted-foreground",
          errorText && "border-red-500 focus-visible:ring-red-500",
          triggerClassName,
        )}
        onClick={() => setOpen((current) => !current)}
      >
        <CalendarIcon className="h-4 w-4" />
        <span>{displayValue || placeholder}</span>
      </Button>

      {helperText ? (
        <p data-slot="field-helper" className="form-field__helper">
          {helperText}
        </p>
      ) : null}
      {errorText ? (
        <p data-slot="field-error" role="alert" className="form-field__error">
          {errorText}
        </p>
      ) : null}

      {open ? (
        <div
          role="dialog"
          aria-label={dialogTitle ?? computedAriaLabel}
          className="absolute left-0 top-full z-50 mt-2 rounded-xl border border-border bg-popover p-3 shadow-2xl"
        >
          <div className="mb-2 px-1 text-sm font-semibold text-foreground">
            {dialogTitle ?? computedAriaLabel}
          </div>
          <Calendar
            mode="single"
            selected={selectedDate ?? undefined}
            month={viewMonth}
            onMonthChange={setViewMonth}
            onSelect={(date) => {
              if (!date) return
              onValueChange?.(formatLocalDateOnly(date))
              setOpen(false)
            }}
            disabled={(date) => {
              if (minDate && date < minDate) return true
              if (maxDate && date > maxDate) return true
              return false
            }}
          />
        </div>
      ) : null}
    </div>
  )
}

export { DatePickerField }
export type { DatePickerFieldProps }
