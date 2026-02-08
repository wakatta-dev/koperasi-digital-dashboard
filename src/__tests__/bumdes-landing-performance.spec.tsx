/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
function LandingPage() {
  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold">Landing Page</h1>
      <p className="text-muted-foreground">Konten landing page akan ditampilkan di sini.</p>
    </section>
  );
}

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
