"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

type FieldSize = "sm" | "md" | "lg"

type AccessibleLabel =
  | { label: string; ariaLabel?: never }
  | { label?: never; ariaLabel: string }

type FieldMessages = {
  helperText?: React.ReactNode
  errorText?: React.ReactNode
}

type FieldProps = AccessibleLabel &
  FieldMessages & {
    id?: string
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    size?: FieldSize
    disabled?: boolean

    className?: string
    labelClassName?: string
    controlWrapperClassName?: string
    controlClassName?: string
    startIconClassName?: string
    endIconClassName?: string

    /**
     * Escape hatch for custom controls.
     * Must be a single React element that accepts standard input/textarea aria props.
     */
    children: React.ReactElement

    /**
     * Controls icon vertical alignment. Defaults to "center" (inputs).
     * Textareas typically want "top" to align with the first line.
     */
    iconAlign?: "center" | "top"
  }

const fieldControlVariants = cva("", {
  variants: {
    size: {
      sm: "h-8 text-sm",
      md: "",
      lg: "h-11",
    },
    hasStartIcon: {
      true: "",
      false: "",
    },
    hasEndIcon: {
      true: "",
      false: "",
    },
  },
  compoundVariants: [
    { size: "sm", hasStartIcon: true, className: "pl-9" },
    { size: "md", hasStartIcon: true, className: "pl-10" },
    { size: "lg", hasStartIcon: true, className: "pl-11" },
    { size: "sm", hasEndIcon: true, className: "pr-9" },
    { size: "md", hasEndIcon: true, className: "pr-10" },
    { size: "lg", hasEndIcon: true, className: "pr-11" },
  ],
  defaultVariants: {
    size: "md",
    hasStartIcon: false,
    hasEndIcon: false,
  },
})

function Field({
  id: idProp,
  label,
  ariaLabel,
  startIcon,
  endIcon,
  size = "md",
  disabled,
  helperText,
  errorText,
  className,
  labelClassName,
  controlWrapperClassName,
  controlClassName,
  startIconClassName,
  endIconClassName,
  children,
  iconAlign = "center",
}: FieldProps) {
  const reactId = React.useId()
  const childId = (children.props as { id?: string }).id
  const controlId = idProp ?? childId ?? `field-${reactId}`

  const helperId = helperText ? `${controlId}-help` : undefined
  const errorId = errorText ? `${controlId}-error` : undefined

  const childDescribedBy = (children.props as { "aria-describedby"?: string })[
    "aria-describedby"
  ]

  const describedBy = [childDescribedBy, helperId, errorId]
    .filter(Boolean)
    .join(" ")
    .trim()

  const mergedControlProps = {
    id: controlId,
    disabled,
    "aria-label": ariaLabel,
    "aria-describedby": describedBy.length > 0 ? describedBy : undefined,
    "aria-invalid": errorText ? true : (children.props as any)["aria-invalid"],
    className: cn(
      (children.props as { className?: string }).className,
      fieldControlVariants({
        size,
        hasStartIcon: Boolean(startIcon),
        hasEndIcon: Boolean(endIcon),
      } as VariantProps<typeof fieldControlVariants>),
      controlClassName
    ),
  }

  return (
    <div
      data-slot="field"
      data-disabled={disabled ? "true" : undefined}
      className={cn("form-field", className)}
    >
      {label ? (
        <Label
          data-slot="field-label"
          htmlFor={controlId}
          className={cn(labelClassName)}
        >
          {label}
        </Label>
      ) : null}

      <div
        data-slot="field-control-wrapper"
        className={cn("form-field__control", controlWrapperClassName)}
      >
        {startIcon ? (
          <span
            data-slot="field-start-icon"
            className={cn(
              "form-field__start-icon [&>svg]:size-4 [&>svg]:shrink-0",
              iconAlign === "top"
                ? "top-3"
                : "top-1/2 -translate-y-1/2",
              startIconClassName
            )}
          >
            {startIcon}
          </span>
        ) : null}

        {React.cloneElement(children, mergedControlProps)}

        {endIcon ? (
          <span
            data-slot="field-end-icon"
            className={cn(
              "form-field__end-icon [&>svg]:size-4 [&>svg]:shrink-0",
              iconAlign === "top"
                ? "top-3"
                : "top-1/2 -translate-y-1/2",
              endIconClassName
            )}
          >
            {endIcon}
          </span>
        ) : null}
      </div>

      {helperText ? (
        <p
          id={helperId}
          data-slot="field-helper"
          className="form-field__helper"
        >
          {helperText}
        </p>
      ) : null}

      {errorText ? (
        <p
          id={errorId}
          data-slot="field-error"
          role="alert"
          className="form-field__error"
        >
          {errorText}
        </p>
      ) : null}
    </div>
  )
}

export { Field }
export type { FieldProps, FieldSize }
