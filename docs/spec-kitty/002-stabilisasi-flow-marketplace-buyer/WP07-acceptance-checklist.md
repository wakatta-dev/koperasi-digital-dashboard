# WP07 - Full Regression Gate Acceptance Checklist (Frontend Unit)

This checklist records WP07 subtasks T035-T039 outcomes for the frontend unit worktree.

## T035 Cross-Unit Regression Execution

| Command | Result | Evidence |
|---|---|---|
| `cd backend && go test ./internal/modules/client/marketplace/...` | PASS | Marketplace package passed (`ok .../client/marketplace`). |
| `cd backend && GOCACHE=$(pwd)/.gocache GOTMPDIR=$(pwd)/.gotmp go test ./...` | PASS | Full backend regression passed in local run after writable Go cache path setup. |
| `cd frontend && npm run test -- src/__tests__/marketplace` | PASS | 14 files passed, 35 tests passed. |
| `cd frontend && npm run test` | PASS | 58 files passed, 127 tests passed. |
| `cd frontend && npm run lint` | PASS with warnings | Lint passed; two pre-existing warnings in `src/modules/asset-reservation/...`. |
| `cd e2e-frontend && E2E_RUN_REAL=true npm run test:module -- --tenant bumdes --module marketplace` | PASS | 15 passed, 0 skipped (latest rerun after F005 stabilization). |
| `cd e2e-frontend && npm run test:critical` | PASS | 21 passed, 0 skipped. |
| `cd e2e-frontend && npm run test:ci` | PASS | 54 passed, 0 skipped (CI-format reporters printed to stdout). |
| `cd e2e-frontend && CI=1 npx playwright test` | PASS | 54 passed, 0 skipped; artifacts refreshed in `artifacts/`. |

## T036 Quickstart Validation and Evidence

Quickstart file: `/Users/faizalfakhri/Documents/koperasi/project/kitty-specs/002-stabilisasi-flow-marketplace-buyer/quickstart.md`

| Quickstart step | Status | Notes |
|---|---|---|
| Service startup backend (`go run ./cmd/main.go`) | Done | Command executed; returned `EADDRINUSE` on `:8080` indicating service already running. |
| Service startup frontend (`npm run dev`) | Done | Command executed; returned `EADDRINUSE` on `:3004` indicating service already running. |
| Service reachability check | Done | HTTP probe returned `200` for `http://localhost:8080/`, `http://localhost:3004/`, and `http://localhost:3004/marketplace`. |
| Frontend regression commands | Done | `npm run test -- src/__tests__/marketplace`, `npm run test`, `npm run lint` passed. |
| Backend regression commands | Done | Marketplace package and full backend suite passed in local WP07 run. |
| Playwright gate commands | Done | `E2E_RUN_REAL=true test:module` passed (`15 passed, 0 skipped`) after stock-conflict stabilization; `test:critical` and `test:ci` remain green in WP07 baseline with `skipped=0`. |
| Artifact verification | Done | Verified `artifacts/junit.xml` (`tests="54"`, `skipped="0"`) and `artifacts/report.json` (`"expected": 54`, `"skipped": 0`). |

## T037 Scope Guard and Legacy Path Regression

| Check | Result | Evidence |
|---|---|---|
| Seller/admin workflows untouched by frontend unit changes | PASS | Diff scope remains buyer marketplace + shared support/tests/spec docs. |
| Buyer routes remain canonical | PASS | `src/app/marketplace/` keeps canonical routes (`keranjang`, `pembayaran`, `konfirmasi`, `pengiriman`, `ulasan`). |
| Legacy buyer path leakage | PASS | Buyer navigation continues pointing to canonical routes only. |

## T038 SC Traceability

| Success Criterion | Status | Evidence |
|---|---|---|
| SC-001: all buyer pages/actions executed and documented | PASS | Baseline matrix in `docs/spec-kitty/002-stabilisasi-flow-marketplace-buyer/WP01-buyer-flow-baseline-and-gap-inventory.md`. |
| SC-002: P1 stories pass for guest + logged-in | PASS | Browser-level guest/logged-in marketplace critical scenarios pass in Playwright suite. |
| SC-003: zero blocking defects in buyer core flow | PASS | Cross-unit backend/frontend/e2e gates are green for WP07 local verification. |
| SC-004: one successful checkout maps to one order | PASS | Covered by frontend integration tests and E2E checkout assertions. |
| SC-005: backend-failure scenarios recoverable | PASS | Recovery/error branches covered by frontend tests and E2E negative scenarios. |
| SC-006: no regression in in-scope buyer actions | PASS | Frontend marketplace/full tests and lint passed. |
| SC-007: browser-level e2e main flows pass | PASS | Marketplace module + critical + CI runs pass with `skipped=0`. |

## Open Blockers and Follow-up

1. No blocking issue remains for WP07 local gate.
Mitigation: keep backend full-test command with explicit local `GOCACHE`/`GOTMPDIR` and keep Playwright CI gate with `skipped=0` enforcement.
