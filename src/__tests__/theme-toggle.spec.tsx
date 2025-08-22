/** @format */

// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, fireEvent, cleanup } from "@testing-library/react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

const setTheme = vi.fn();
let theme = "light";
vi.mock("next-themes", () => ({
  useTheme: () => ({ theme, setTheme }),
}));

describe("ThemeToggle", () => {
  beforeEach(() => {
    setTheme.mockClear();
  });

  afterEach(() => {
    cleanup();
  });

  it("switches to dark when currently light", () => {
    theme = "light";
    const { getByRole } = render(<ThemeToggle />);
    fireEvent.click(getByRole("switch"));
    expect(setTheme).toHaveBeenCalledWith("dark");
  });

  it("switches to light when currently dark", () => {
    theme = "dark";
    const { getByRole } = render(<ThemeToggle />);
    fireEvent.click(getByRole("switch"));
    expect(setTheme).toHaveBeenCalledWith("light");
  });
});

