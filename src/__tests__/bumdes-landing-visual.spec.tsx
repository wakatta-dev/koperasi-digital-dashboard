/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";

import LandingPage from "@/app/(mvp)/bumdes/landing-page/page";

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
