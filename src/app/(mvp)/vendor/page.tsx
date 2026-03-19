/** @format */

import type { Metadata } from "next";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Vendor - Koperasi Digital",
  description: "Vendor page.",
};

export default function VendorIndexPage() {
  redirect("/vendor/dashboard");
}
