/** @format */

"use client";

import { useCallback, useState } from "react";

export function useCursorStack<TCursor extends string | number = string>() {
  const [cursorStack, setCursorStack] = useState<TCursor[]>([]);

  const reset = useCallback(() => {
    setCursorStack([]);
  }, []);

  const goBack = useCallback(() => {
    setCursorStack((current) => current.slice(0, -1));
  }, []);

  const goNext = useCallback((nextCursor?: TCursor | null) => {
    if (nextCursor == null) {
      return;
    }

    setCursorStack((current) => [...current, nextCursor]);
  }, []);

  return {
    currentCursor: cursorStack.at(-1),
    canGoBack: cursorStack.length > 0,
    reset,
    goBack,
    goNext,
  } as const;
}
