"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type SelectFieldOption = {
  value: string
  label: string
  disabled?: boolean
}

type AccessibleLabel =
  | { label: string; ariaLabel?: never }
  | { label?: never; ariaLabel: string }

type SelectFieldProps = AccessibleLabel & {
  id?: string
  options: SelectFieldOption[]
  value?: string
  defaultValue?: string
  placeholder?: string
  disabled?: boolean
  helperText?: React.ReactNode
  errorText?: React.ReactNode
  onValueChange?: (value: string) => void
  className?: string
  labelClassName?: string
  triggerClassName?: string
}

function SelectField({
  id: idProp,
  label,
  ariaLabel,
  options,
  value,
  defaultValue,
  placeholder,
  disabled,
  helperText,
  errorText,
  onValueChange,
  className,
  labelClassName,
  triggerClassName,
}: SelectFieldProps) {
  const reactId = React.useId()
  const controlId = idProp ?? `select-${reactId}`
  const helperId = helperText ? `${controlId}-help` : undefined
  const errorId = errorText ? `${controlId}-error` : undefined
  const describedBy = [helperId, errorId].filter(Boolean).join(" ")

  return (
    <div className={cn("form-field", className)}>
      {label ? (
        <Label htmlFor={controlId} className={cn(labelClassName)}>
          {label}
        </Label>
      ) : null}

      <Select
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger
          id={controlId}
          aria-label={ariaLabel}
          aria-invalid={errorText ? true : undefined}
          aria-describedby={describedBy.length ? describedBy : undefined}
          className={cn("w-full", triggerClassName)}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

export { SelectField }
export type { SelectFieldOption, SelectFieldProps }
