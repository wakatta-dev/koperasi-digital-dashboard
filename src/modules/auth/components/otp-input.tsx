/** @format */

"use client";

import type React from "react";
import { useMemo, useRef } from "react";
import { OTP_LENGTH } from "../constants";
import { cn } from "@/lib/utils";

type OtpInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
};

export function OtpInput({
  value,
  onChange,
  length = OTP_LENGTH,
  className,
}: OtpInputProps) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const normalizedValue = useMemo(
    () => value.slice(0, length).padEnd(length, " "),
    [value, length],
  );

  const focusInput = (index: number) => {
    const target = inputsRef.current[index];
    if (target) {
      target.focus();
      target.select();
    }
  };

  const handleChange = (index: number, nextValue: string) => {
    const char = nextValue.replace(/\D/g, "").slice(-1);
    const chars = normalizedValue.split("");
    chars[index] = char || " ";
    const newValue = chars.join("").replaceAll(" ", "");
    onChange(newValue);
    if (char && index < length - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !normalizedValue[index] && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }
    if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusInput(index - 1);
      return;
    }
    if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusInput(index + 1);
    }
  };

  const handlePaste = (index: number, event: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData
      ?.getData("text")
      .trim()
      .replace(/\D/g, "")
      .slice(0, length);

    if (!pasted) return;
    event.preventDefault();
    const chars = normalizedValue.split("");
    pasted.split("").forEach((char, offset) => {
      const targetIndex = index + offset;
      if (targetIndex < length) {
        chars[targetIndex] = char;
      }
    });
    onChange(chars.join("").replaceAll(" ", ""));
    const lastIndex = Math.min(index + pasted.length - 1, length - 1);
    focusInput(lastIndex);
  };

  return (
    <div className={cn("flex w-full justify-center gap-2 sm:gap-3", className)}>
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(node) => {
            inputsRef.current[index] = node;
          }}
          value={normalizedValue[index] === " " ? "" : normalizedValue[index]}
          inputMode="numeric"
          maxLength={1}
          className="h-12 w-11 rounded-md border border-input bg-card text-center text-lg font-semibold tracking-widest text-foreground shadow-sm outline-none transition-shadow focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px] sm:h-14 sm:w-12"
          onChange={(event) => handleChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
        />
      ))}
    </div>
  );
}
