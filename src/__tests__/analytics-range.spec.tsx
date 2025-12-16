/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { DateRangeSelector } from "@/modules/dashboard/analytics/components/date-range";

describe("DateRangeSelector", () => {
  it("calls onChange when selecting range", async () => {
    const onChange = vi.fn();
    render(<DateRangeSelector value="today" onChange={onChange} />);
    const nativeSelect = screen.getByTestId("range-native");
    fireEvent.change(nativeSelect, { target: { value: "7d" } });
    expect(onChange).toHaveBeenCalledWith("7d");
  });
});
