/** @format */

import { renderHook, act } from "@testing-library/react";
import { vi, describe, expect, it, beforeEach, afterEach } from "vitest";
import { useDateRange } from "@/modules/finance/penjualan-rinci/hooks/useDateRange";

describe("useDateRange", () => {
  const mockNow = new Date("2023-01-15T10:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initializes month preset with month bounds", () => {
    const { result } = renderHook(() => useDateRange("month"));

    expect(result.current.value.preset).toBe("month");
    expect(result.current.value.start).toBe("2023-01-01");
    expect(result.current.value.end).toBe("2023-01-31");
    expect(result.current.value.label).toBe("Bulan Ini");
    expect(result.current.value.queryParams).toMatchObject({
      preset: "month",
      start: "2023-01-01",
      end: "2023-01-31",
    });
  });

  it("switches to today preset", () => {
    const { result } = renderHook(() => useDateRange("month"));

    act(() => result.current.setPreset("today"));

    expect(result.current.value.preset).toBe("today");
    expect(result.current.value.start).toBe("2023-01-15");
    expect(result.current.value.end).toBe("2023-01-15");
    expect(result.current.value.label).toBe("Hari Ini");
  });

  it("handles custom range", () => {
    const { result } = renderHook(() => useDateRange("today"));

    act(() => result.current.setCustomRange("2023-01-05", "2023-01-10"));

    expect(result.current.value.preset).toBe("custom");
    expect(result.current.value.label).toBe("2023-01-05 - 2023-01-10");
    expect(result.current.value.queryParams).toMatchObject({
      preset: "custom",
      start: "2023-01-05",
      end: "2023-01-10",
    });
  });
});
