# WP07 - Full Regression Gate Acceptance Checklist (Frontend Unit)

This checklist records WP07 subtasks T035-T039 outcomes for the frontend unit worktree.

## T035 Cross-Unit Regression Execution

| Command | Result | Evidence |
|---|---|---|
| `cd backend && go test ./internal/modules/client/marketplace/...` | PASS | Marketplace package test passed (`ok .../client/marketplace`). |
| `cd backend && go test ./...` | FAIL (blocking, non-frontend ownership) | Go cache permission errors under `~/Library/Caches/go-build`; failing suites: `internal/modules/client/inventory` and `internal/modules/core/authorization`. |
| `cd frontend && npm run test -- src/__tests__/marketplace` | PASS | 14 files passed, 35 tests passed. |
| `cd frontend && npm run test` | PASS | 58 files passed, 127 tests passed. |
| `cd frontend && npm run lint` | PASS with warnings | Lint passed; two pre-existing warnings in `src/modules/asset-reservation/...`. |
| `cd e2e-frontend && npm run test:module -- --tenant bumdes --module marketplace` | FAIL (blocking, e2e ownership) | Playwright returned `Error: No tests found` for `@module:marketplace`. |
| `cd e2e-frontend && npm run test:critical` | PASS with skipped tests | 6 tests skipped (requires `E2E_RUN_REAL=true` and credentials). |
| `cd e2e-frontend && npm run test:ci` | PASS with skipped tests | 21 passed, 6 skipped; artifacts updated in `e2e-frontend/artifacts/`. |

## T036 Quickstart Validation and Evidence

Quickstart file: `/Users/faizalfakhri/Documents/koperasi/project/kitty-specs/002-stabilisasi-flow-marketplace-buyer/quickstart.md`

| Quickstart step | Status | Notes |
|---|---|---|
| Service startup (`go run ./cmd/main.go`, `npm run dev`) | Not executed in this run | WP07 unit execution focused on regression gate commands and artifact verification. |
| Frontend regression commands | Done | `npm run test`, `npm run lint` executed and passed in this worktree. |
| Backend regression commands | Done with blocker | Marketplace package pass; full suite blocked by cross-unit failures and local Go cache permission issue. |
| Playwright gate commands | Done with blocker | `test:ci` pass, `test:critical` skipped, `test:module` failed due missing marketplace-tagged tests. |
| Artifact verification | Done | Verified `e2e-frontend/artifacts/junit.xml`, `e2e-frontend/artifacts/report.json`, `e2e-frontend/artifacts/html-report/index.html`. |

## T037 Scope Guard and Legacy Path Regression

| Check | Result | Evidence |
|---|---|---|
| Seller/admin flow untouched | PASS | `git diff --name-only development...HEAD` shows only marketplace buyer files, shared API/query keys, tests, and spec docs. |
| Buyer routes remain canonical | PASS | `src/app/marketplace/` contains canonical Indonesian routes (`keranjang`, `pembayaran`, `konfirmasi`, `pengiriman`, `ulasan`). |
| Legacy route leakage into active buyer journey | PASS | Current navigation references canonical routes only (`src/modules/marketplace/cart-page.tsx`, `src/modules/marketplace/payment-page.tsx`, `src/modules/marketplace/confirmation-page.tsx`, `src/modules/marketplace/review-page.tsx`). |

## T038 SC Traceability Checklist

| Success Criterion | Status | Evidence |
|---|---|---|
| SC-001: all buyer pages/actions executed and documented | PASS | Baseline matrix + gap inventory in `docs/spec-kitty/002-stabilisasi-flow-marketplace-buyer/WP01-buyer-flow-baseline-and-gap-inventory.md`. |
| SC-002: P1 stories pass for guest + logged-in | PARTIAL (unit-verified) | Frontend automated coverage and context/order flow tests pass; full live e2e guest/logged-in confirmation blocked by missing `@module:marketplace` suite. |
| SC-003: zero blocking defects in buyer core flow | PARTIAL | Frontend buyer blockers addressed in WP03/WP04; remaining blockers are cross-unit backend/e2e gate items listed below. |
| SC-004: one successful checkout maps to one order | PASS | Verified by core journey integration and checkout guard tests in `src/__tests__/marketplace/core-journey-integration.spec.ts` and `src/__tests__/marketplace/core-journey-stabilization.spec.tsx`. |
| SC-005: backend failure scenarios are recoverable | PASS | Error/retry behavior covered by marketplace tests, especially tracking/review recovery in `src/__tests__/marketplace/tracking-review-overlay.spec.tsx`. |
| SC-006: no regression in previously passing buyer actions | PASS | `npm run test -- src/__tests__/marketplace`, `npm run test`, and `npm run lint` passed in this worktree. |
| SC-007: required browser-level e2e main flows pass | FAIL (blocking) | `npm run test:module -- --module marketplace` returns no tests found; `test:critical` scenarios are skipped without live credentials. |

## Open Blockers and Mitigation

1. E2E marketplace module suite missing (`No tests found` for `@module:marketplace`).
Mitigation: e2e-frontend unit must add marketplace-tagged scenarios and module catalog/flow registration before final acceptance.

2. Full backend regression unstable in local run.
Mitigation: backend unit to resolve permission issue for Go build cache access and fix failing tests in `internal/modules/client/inventory` and `internal/modules/core/authorization`.

3. Live critical browser scenarios are skipped without runtime credentials.
Mitigation: run quickstart with `E2E_RUN_REAL=true` plus bumdes requester/reviewer credentials and attach refreshed artifacts.
