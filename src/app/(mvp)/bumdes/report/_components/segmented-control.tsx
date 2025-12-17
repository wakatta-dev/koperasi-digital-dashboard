/** @format */

"use client";

import { cn } from "@/lib/utils";

type SegmentedOption = {
  label: string;
  value: string;
  active?: boolean;
};

type SegmentedControlProps = {
  options: SegmentedOption[];
  activeValue?: string;
  onChange?: (value: string) => void;
  className?: string;
  buttonClassName?: string;
  activeClassName?: string;
  inactiveClassName?: string;
};

const baseButtonClass =
  "px-3 py-1.5 text-sm font-medium rounded-md transition-colors whitespace-nowrap";
const baseContainerClass =
  "flex flex-wrap bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-md p-1 shadow-sm";
const defaultActiveClass = "bg-indigo-600 text-white shadow-sm";
const defaultInactiveClass =
  "text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white";

export function SegmentedControl({
  options,
  activeValue,
  onChange,
  className,
  buttonClassName,
  activeClassName,
  inactiveClassName,
}: SegmentedControlProps) {
  return (
    <div className={cn(baseContainerClass, className)}>
      {options.map((option) => {
        const isActive = activeValue
          ? activeValue === option.value
          : Boolean(option.active);

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange?.(option.value)}
            className={cn(
              baseButtonClass,
              isActive
                ? cn(defaultActiveClass, activeClassName)
                : cn(defaultInactiveClass, inactiveClassName),
              buttonClassName
            )}
            aria-pressed={isActive}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
