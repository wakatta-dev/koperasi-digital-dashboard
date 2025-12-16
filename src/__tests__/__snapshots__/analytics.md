# Analytics Dashboard Snapshots (reference)

Manual captures (light/dark) to validate visual regressions:

- `analytics-light-loaded.png`: KPIs + Overview + notifications + quick actions + top products with populated data.
- `analytics-light-empty.png`: Empty states for KPIs/Overview/Products/Notifications.
- `analytics-dark-loaded.png`: Dark theme with populated data (ensure contrast meets WCAG).
- `analytics-error.png`: Error state for data load (alert styling visible).

Screenshots should be stored alongside this file when captured. Use seeded fixture data from `src/__tests__/fixtures/analytics.ts` to reproduce states.
