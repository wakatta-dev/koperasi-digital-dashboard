/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

function makeStubPage(label: string) {
  return function StubPage() {
    return (
      <section className="space-y-2">
        <h1 className="text-xl font-semibold">{label}</h1>
        <p className="text-muted-foreground">Konten landing page akan ditampilkan di sini.</p>
      </section>
    );
  };
}

const routes = [
  { label: "Landing Page", Component: makeStubPage("Landing Page") },
  { label: "Identitas & Navigasi", Component: makeStubPage("Identitas & Navigasi") },
  { label: "Hero Section", Component: makeStubPage("Hero Section") },
  { label: "Tentang BUMDes", Component: makeStubPage("Tentang BUMDes") },
  { label: "Unit Usaha", Component: makeStubPage("Unit Usaha") },
  { label: "Produk Unggulan", Component: makeStubPage("Produk Unggulan") },
  { label: "Keunggulan", Component: makeStubPage("Keunggulan") },
  { label: "Testimoni", Component: makeStubPage("Testimoni") },
  { label: "Footer & Kontak", Component: makeStubPage("Footer & Kontak") },
];

describe("BUMDes landing page accessibility checks", () => {
  it.each(routes)("uses a single h1 for %s", ({ label, Component }) => {
    render(<Component />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toBe(label);
  });
});
