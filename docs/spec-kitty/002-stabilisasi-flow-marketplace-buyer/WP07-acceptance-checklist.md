# WP07 - Full Regression Gate Acceptance Checklist (Frontend Unit)

This checklist records WP07 subtasks T035-T039 for the frontend unit worktree.

Unit-scope decision:
- This run is valid for frontend-unit handoff evidence.
- Full feature acceptance remains blocked by cross-unit gates (backend full regression and marketplace Playwright module coverage).

## T035 Cross-Unit Regression Execution

| Command | Result | Evidence |
|---|---|---|
| `cd backend && go test ./internal/modules/client/marketplace/...` | PASS | Marketplace package passed (`ok .../client/marketplace`). |
| `cd backend && go test ./...` | FAIL (blocking, backend-owned) | Go cache permission errors under `~/Library/Caches/go-build`; failing suites include `internal/modules/client/inventory` and `internal/modules/core/authorization`. |
| `cd frontend && npm run test -- src/__tests__/marketplace` | PASS | 14 files passed, 35 tests passed. |
| `cd frontend && npm run test` | PASS | 58 files passed, 127 tests passed. |
| `cd frontend && npm run lint` | PASS with warnings | Lint passed; two pre-existing warnings in `src/modules/asset-reservation/...`. |
| `cd e2e-frontend && npm run test:module -- --tenant bumdes --module marketplace` | FAIL (blocking, e2e-owned) | `Error: No tests found`. |
| `cd e2e-frontend && E2E_RUN_REAL=true npm run test:module -- --tenant bumdes --module marketplace` | FAIL (blocking, e2e-owned) | Same `Error: No tests found`, proving failure is not caused by `E2E_RUN_REAL` mode. |
| `cd e2e-frontend && npm run test:critical` | PASS with skipped tests | 6 skipped (`@module:asset-rental` tests require live credentials). |
| `cd e2e-frontend && npm run test:ci` | PASS with skipped tests | 21 passed, 6 skipped. |
| `cd e2e-frontend && rg -n \"@module:marketplace|marketplace\" tests scripts src` | PASS (diagnostic) | No matches found for `@module:marketplace` in current e2e tree. |

## T036 Quickstart Validation and Evidence

Quickstart file: `/Users/faizalfakhri/Documents/koperasi/project/kitty-specs/002-stabilisasi-flow-marketplace-buyer/quickstart.md`

| Quickstart step | Status | Notes |
|---|---|---|
| Service startup backend (`go run ./cmd/main.go`) | Attempted, blocked by environment | Fails in this sandbox: `migrations: dial tcp [::1]:5432: connect: operation not permitted`. |
| Service startup frontend (`npm run dev`) | Attempted, blocked by environment | Fails in this sandbox: `listen EPERM: operation not permitted 0.0.0.0:3004`. |
| Frontend regression commands | Done | `npm run test -- src/__tests__/marketplace`, `npm run test`, `npm run lint` all passed. |
| Backend regression commands | Done with blocker | Marketplace package pass; full suite fails (permission + existing backend failures). |
| Playwright gate commands | Done with blocker | `test:module` fails (no tests found), `test:critical` skipped, `test:ci` passes with skips. |
| Artifact verification | Done with caveat | `e2e-frontend/artifacts/junit.xml` and `e2e-frontend/artifacts/report.json` currently reflect the last module run (`No tests found`); `test:ci` detailed results are available in command output and `e2e-frontend/playwright-report/`. |

## T037 Scope Guard and Legacy Path Regression

| Check | Result | Evidence |
|---|---|---|
| Seller/admin workflows untouched by frontend unit changes | PASS | `git diff --name-only development...HEAD` is limited to buyer marketplace files, shared API/query helpers, tests, and spec docs. |
| Buyer routes remain canonical | PASS | `src/app/marketplace/` routes remain `keranjang`, `pembayaran`, `konfirmasi`, `pengiriman`, `ulasan`. |
| Legacy buyer path leakage | PASS | Buyer navigation points to canonical routes in `src/modules/marketplace/cart-page.tsx`, `src/modules/marketplace/payment-page.tsx`, `src/modules/marketplace/confirmation-page.tsx`, `src/modules/marketplace/review-page.tsx`. |

## T038 SC Traceability

| Success Criterion | Status | Evidence |
|---|---|---|
| SC-001: all buyer pages/actions executed and documented | PASS | Baseline matrix in `docs/spec-kitty/002-stabilisasi-flow-marketplace-buyer/WP01-buyer-flow-baseline-and-gap-inventory.md`. |
| SC-002: P1 stories pass for guest + logged-in | PARTIAL (frontend-unit only) | Frontend P1 behavior covered by marketplace tests; full browser validation for marketplace guest/logged-in remains blocked by missing module tests. |
| SC-003: zero blocking defects in buyer core flow | PARTIAL | Frontend buyer blockers fixed (WP03/WP04), but backend full regression still red. |
| SC-004: one successful checkout maps to one order | PASS | Verified by `src/__tests__/marketplace/core-journey-integration.spec.ts` and `src/__tests__/marketplace/core-journey-stabilization.spec.tsx`. |
| SC-005: backend-failure scenarios recoverable | PASS | Recovery/error branches covered by `src/__tests__/marketplace/tracking-review-overlay.spec.tsx`. |
| SC-006: no regression in in-scope buyer actions | PASS | Marketplace suite, full frontend tests, and lint all pass. |
| SC-007: browser-level e2e main flows pass | FAIL (blocking) | Marketplace module command returns `No tests found`; critical suite does not execute marketplace flows and contains skipped tests. |

## Open Blockers and Follow-up

1. Marketplace e2e module coverage is absent in current `e2e-frontend` baseline.
Owner: e2e-frontend (WP05/WP06 lineage).
Action: add `@module:marketplace` scenarios and rerun `npm run test:module -- --tenant bumdes --module marketplace`.

2. Full backend regression is red.
Owner: backend.
Action: resolve Go cache permission/runtime issue and existing failing suites (`inventory`, `authorization`) to close T035 global gate.

3. Local quickstart startup cannot be fully executed in this sandbox.
Owner: environment/runtime.
Action: rerun quickstart startup + live e2e gate in a local env that permits service bind and DB access.
