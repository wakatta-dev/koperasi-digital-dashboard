/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { LanguageProvider } from "@/contexts/language-context";
import { LanguageToggle } from "@/components/shared/language-toggle";

describe("LanguageToggle", () => {
  it("toggles language on click", () => {
    const { getByRole } = render(
      <LanguageProvider>
        <LanguageToggle />
      </LanguageProvider>
    );
    const button = getByRole("button");
    expect(button.textContent).toBe("ID");
    fireEvent.click(button);
    expect(button.textContent).toBe("EN");
  });
});

