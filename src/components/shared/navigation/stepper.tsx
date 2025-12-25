/** @format */

import { cn } from "@/lib/utils";

type StepState = "done" | "active" | "pending";

export type StepperStep = {
  label: string;
  icon: string;
  state?: StepState;
};

type StepperProps = {
  steps: StepperStep[];
  /** Optional progress bar fill percentage (0-100). */
  progressPercent?: number;
  className?: string;
  /** Controls the color treatment of the active step label. */
  activeLabelTone?: "default" | "primary";
};

export function Stepper({
  steps,
  progressPercent,
  className,
  activeLabelTone = "default",
}: StepperProps) {
  const clampedProgress =
    typeof progressPercent === "number"
      ? Math.max(0, Math.min(progressPercent, 100))
      : undefined;

  return (
    <div className={cn("w-full max-w-4xl mx-auto mb-16 pt-2", className)}>
      <div className="relative flex items-center justify-between">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-border rounded-full z-0" />
        {clampedProgress !== undefined ? (
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-indigo-600 rounded-full z-0 transition-all duration-500"
            style={{ width: `${clampedProgress}%` }}
          />
        ) : null}
        {steps.map((step) => {
          const state: StepState = step.state ?? "pending";
          const isActive = state === "active";
          const isDone = state === "done";

          const circleClass = isActive
            ? "bg-indigo-600 shadow-lg shadow-indigo-500/40 scale-110"
            : isDone
              ? "bg-indigo-600 shadow-lg shadow-indigo-500/30 group-hover:scale-105"
              : "bg-card border-2 border-border text-muted-foreground";

          const labelClass = isActive
            ? cn(
                "font-bold",
                activeLabelTone === "primary"
                  ? "text-indigo-600 dark:text-indigo-400"
                  : "text-foreground"
              )
            : isDone
              ? "font-bold text-indigo-600 dark:text-indigo-400"
              : "font-medium text-muted-foreground";

          return (
            <div
              key={step.label}
              className="relative flex flex-col items-center z-10 group cursor-default"
            >
              <div
                className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white ring-4 ring-background transition",
                  circleClass
                )}
              >
                <span className="material-icons-outlined text-2xl">
                  {step.icon}
                </span>
              </div>
              <div className="absolute -bottom-9 w-32 text-center">
                <span className={cn("text-sm", labelClass)}>{step.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
