/** @format */

import type { Metadata } from "next";

import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Bumdes - Accounting - Tax - Koperasi Digital",
  description: "Bumdes - Accounting - Tax page.",
};

export default function AccountingTaxIndexPage() {
  redirect("/bumdes/accounting/tax/summary");
}
