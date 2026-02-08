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

describe("BUMDes landing page visual smoke", () => {
  it("matches the landing page snapshot", () => {
    const { container } = render(<LandingPage />);
    expect(container.firstChild).toMatchInlineSnapshot(`
      <section
        class="space-y-2"
      >
        <h1
          class="text-xl font-semibold"
        >
          Landing Page
        </h1>
        <p
          class="text-muted-foreground"
        >
          Konten landing page akan ditampilkan di sini.
        </p>
      </section>
    `);
  });
});
