"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

import { Field, type FieldSize } from "./field"

type AccessibleLabel =
  | { label: string; ariaLabel?: never }
  | { label?: never; ariaLabel: string }

type TextareaFieldProps = AccessibleLabel & {
  id?: string
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
  size?: FieldSize
  disabled?: boolean
  helperText?: React.ReactNode
  errorText?: React.ReactNode

  className?: string
  labelClassName?: string
  controlWrapperClassName?: string
  controlClassName?: string
  startIconClassName?: string
  endIconClassName?: string

  onValueChange?: (value: string) => void
} & Omit<
    React.ComponentProps<"textarea">,
    "className" | "disabled" | "id" | "onChange"
  > & {
    onChange?: React.ChangeEventHandler<HTMLTextAreaElement>
  }

function TextareaField({
  id,
  label,
  ariaLabel,
  startIcon,
  endIcon,
  size,
  disabled,
  helperText,
  errorText,
  className,
  labelClassName,
  controlWrapperClassName,
  controlClassName,
  startIconClassName,
  endIconClassName,
  onChange,
  onValueChange,
  ...props
}: TextareaFieldProps) {
  const sizePadding =
    size === "sm" ? "py-1.5" : size === "lg" ? "py-3" : undefined

  const a11yProps =
    label !== undefined ? { label } : { ariaLabel: ariaLabel! }

  return (
    <Field
      id={id}
      {...a11yProps}
      startIcon={startIcon}
      endIcon={endIcon}
      size={size}
      disabled={disabled}
      helperText={helperText}
      errorText={errorText}
      className={className}
      labelClassName={labelClassName}
      controlWrapperClassName={controlWrapperClassName}
      controlClassName={cn(sizePadding, controlClassName)}
      startIconClassName={startIconClassName}
      endIconClassName={endIconClassName}
      iconAlign="top"
    >
      <Textarea
        {...props}
        disabled={disabled}
        onChange={(event) => {
          onChange?.(event)
          onValueChange?.(event.currentTarget.value)
        }}
      />
    </Field>
  )
}

export { TextareaField }
export type { TextareaFieldProps }
