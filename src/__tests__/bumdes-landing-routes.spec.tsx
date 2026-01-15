/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import LandingPage from "@/app/(mvp)/bumdes/landing-page/page";
import IdentitasNavigasiPage from "@/app/(mvp)/bumdes/landing-page/identitas-navigasi/page";
import HeroSectionPage from "@/app/(mvp)/bumdes/landing-page/hero-section/page";
import TentangBumdesPage from "@/app/(mvp)/bumdes/landing-page/tentang-bumdes/page";
import UnitUsahaPage from "@/app/(mvp)/bumdes/landing-page/unit-usaha/page";
import ProdukUnggulanPage from "@/app/(mvp)/bumdes/landing-page/produk-unggulan/page";
import KeunggulanPage from "@/app/(mvp)/bumdes/landing-page/keunggulan/page";
import TestimoniPage from "@/app/(mvp)/bumdes/landing-page/testimoni/page";
import FooterKontakPage from "@/app/(mvp)/bumdes/landing-page/footer-kontak/page";

const routes = [
  { label: "Landing Page", Component: LandingPage },
  { label: "Identitas & Navigasi", Component: IdentitasNavigasiPage },
  { label: "Hero Section", Component: HeroSectionPage },
  { label: "Tentang BUMDes", Component: TentangBumdesPage },
  { label: "Unit Usaha", Component: UnitUsahaPage },
  { label: "Produk Unggulan", Component: ProdukUnggulanPage },
  { label: "Keunggulan", Component: KeunggulanPage },
  { label: "Testimoni", Component: TestimoniPage },
  { label: "Footer & Kontak", Component: FooterKontakPage },
];

describe("BUMDes landing page routes", () => {
  it.each(routes)("renders a heading for %s", ({ label, Component }) => {
    render(<Component />);
    const heading = screen.getByRole("heading", { name: label });
    expect(heading).toBeTruthy();
  });
});
