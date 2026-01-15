/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import LandingPage from "@/app/(mvp)/bumdes/landing-page/page";

const now = () =>
  typeof performance !== "undefined" && typeof performance.now === "function"
    ? performance.now()
    : Date.now();

describe("BUMDes landing page performance smoke", () => {
  it("renders the landing page within a reasonable time budget", () => {
    const start = now();
    render(<LandingPage />);
    const duration = now() - start;
    expect(duration).toBeLessThan(200);
  });
});
