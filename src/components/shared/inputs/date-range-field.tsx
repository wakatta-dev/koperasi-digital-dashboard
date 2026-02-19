"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

import { Input } from "./input"

type AccessibleLabel =
  | { label: string; ariaLabel?: never }
  | { label?: never; ariaLabel: string }

type DateRangeValue = {
  start: string
  end: string
}

type DateRangeFieldProps = AccessibleLabel & {
  id?: string
  value: DateRangeValue
  disabled?: boolean
  helperText?: React.ReactNode
  errorText?: React.ReactNode
  className?: string
  labelClassName?: string
  inputClassName?: string
  startPlaceholder?: string
  endPlaceholder?: string
  onValueChange?: (value: DateRangeValue) => void
}

function DateRangeField({
  id: idProp,
  label,
  ariaLabel,
  value,
  disabled,
  helperText,
  errorText,
  className,
  labelClassName,
  inputClassName,
  startPlaceholder,
  endPlaceholder,
  onValueChange,
}: DateRangeFieldProps) {
  const reactId = React.useId()
  const controlId = idProp ?? `date-range-${reactId}`
  const helperId = helperText ? `${controlId}-help` : undefined
  const errorId = errorText ? `${controlId}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(" ")

  return (
    <div className={cn("form-field", className)}>
      {label ? (
        <Label htmlFor={`${controlId}-start`} className={cn(labelClassName)}>
          {label}
        </Label>
      ) : null}

      <div className="grid grid-cols-2 gap-2">
        <Input
          id={`${controlId}-start`}
          type="date"
          value={value.start}
          disabled={disabled}
          placeholder={startPlaceholder}
          aria-label={label ? undefined : `${ariaLabel} mulai`}
          aria-invalid={errorText ? true : undefined}
          aria-describedby={describedBy.length ? describedBy : undefined}
          className={inputClassName}
          onChange={(event) => {
            onValueChange?.({ ...value, start: event.currentTarget.value })
          }}
        />
        <Input
          id={`${controlId}-end`}
          type="date"
          value={value.end}
          disabled={disabled}
          placeholder={endPlaceholder}
          aria-label={label ? undefined : `${ariaLabel} selesai`}
          aria-invalid={errorText ? true : undefined}
          aria-describedby={describedBy.length ? describedBy : undefined}
          className={inputClassName}
          onChange={(event) => {
            onValueChange?.({ ...value, end: event.currentTarget.value })
          }}
        />
      </div>

      {helperText ? (
        <p id={helperId} data-slot="field-helper" className="form-field__helper">
          {helperText}
        </p>
      ) : null}
      {errorText ? (
        <p id={errorId} data-slot="field-error" role="alert" className="form-field__error">
          {errorText}
        </p>
      ) : null}
    </div>
  )
}

export { DateRangeField }
export type { DateRangeFieldProps, DateRangeValue }
