/** @format */

import type { Metadata } from "next";

import { LandingPageManagement } from "@/modules/landing/management/LandingPageManagement";

export const metadata: Metadata = {
  title: "Bumdes - Landing Page - Koperasi Digital",
  description: "Bumdes - Landing Page page.",
};

export default function LandingPageIndexPage() {
  return <LandingPageManagement />;
}
