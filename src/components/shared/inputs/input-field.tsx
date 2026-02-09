"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"

import { Field, type FieldSize } from "./field"

type AccessibleLabel =
  | { label: string; ariaLabel?: never }
  | { label?: never; ariaLabel: string }

type InputFieldProps = AccessibleLabel & {
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
    React.ComponentProps<"input">,
    "size" | "className" | "disabled" | "id" | "onChange"
  > & {
    onChange?: React.ChangeEventHandler<HTMLInputElement>
  }

function InputField({
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
}: InputFieldProps) {
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
      controlClassName={controlClassName}
      startIconClassName={startIconClassName}
      endIconClassName={endIconClassName}
    >
      <Input
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

export { InputField }
export type { InputFieldProps }
