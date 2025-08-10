/** @format */

import { getDashboardSummary } from "@/actions/dashboard";

export default async function DashboardPage() {
  let summary;
  try {
    summary = await getDashboardSummary();
  } catch {
    summary = null;
  }

  return (
    <section className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      {summary ? (
        <pre className="text-sm bg-muted p-4 rounded">{JSON.stringify(summary, null, 2)}</pre>
      ) : (
        <p className="text-sm text-muted-foreground">Summary data is unavailable.</p>
      )}
    </section>
  );
}
