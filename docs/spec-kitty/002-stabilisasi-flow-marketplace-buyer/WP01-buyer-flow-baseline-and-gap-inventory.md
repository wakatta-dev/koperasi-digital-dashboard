# WP01 - Buyer Flow Baseline and Gap Inventory (Frontend Unit)

This baseline is the frontend-unit implementation artifact for WP01. It captures T001-T005 deliverables with concrete references used by WP03/WP04/WP07.

## T001 - Buyer Route / Action Matrix

| Route | Key buyer actions (visible) | Actor mode | Priority | Backend dependency |
|---|---|---|---|---|
| `/marketplace` | Search product, apply price filter, change sort, paginate list, open detail page, quick add-to-cart (non-variant), open tracking page (`Lacak Pesanan`) | both | P1 | `GET /marketplace/products`, `GET /marketplace/cart`, `POST /marketplace/cart/items` |
| `/marketplace/[id]` | Load detail, load variants, select variant group/option, adjust qty, add-to-cart, open related products | both | P1 | `GET /marketplace/products/{id}`, `GET /marketplace/products/{id}/variants`, `POST /marketplace/cart/items`, `GET /marketplace/cart` |
| `/marketplace/keranjang` | Load cart, increase/decrease qty, remove item, proceed checkout submit | both | P1 | `GET /marketplace/cart`, `PATCH /marketplace/cart/items/{item_id}`, `DELETE /marketplace/cart/items/{item_id}`, `POST /marketplace/checkout` |
| `/marketplace/pembayaran` | Load order context, upload payment proof, submit manual payment, retry on failure | both | P1 | `POST /marketplace/orders/{id}/manual-payment` (+ `GET /marketplace/orders/{id}` for logged-in enrichment) |
| `/marketplace/konfirmasi` | View finalized order summary/status, continue shopping, open tracking flow | both | P1 | `GET /marketplace/orders/{id}` or checkout result context |
| `/marketplace/pengiriman` | Submit guest tracking lookup, load guest status detail, retry/reset, open review action | both | P2 | `POST /marketplace/orders/track`, `GET /marketplace/orders/{id}/guest-status`, `POST /marketplace/orders/{id}/reviews` |
| `/marketplace/ulasan` | Open review flow using order context, submit item ratings/comment, recover from failure | both | P2 | `GET /marketplace/orders/{id}/guest-status`, `POST /marketplace/orders/{id}/reviews` |

## T002 - Backend Endpoint Coverage Gap Map

Reference sources:
- Contract: `kitty-specs/002-stabilisasi-flow-marketplace-buyer/contracts/marketplace-buyer-stabilization.openapi.yaml`
- Backend handlers: `backend/internal/modules/client/marketplace/routes.go`, `backend/internal/modules/client/marketplace/handler.go`
- Shared-risk files: `backend/internal/modules/client/marketplace/view.go`, `backend/internal/modules/client/marketplace/dto.go`, `backend/internal/modules/client/marketplace/service.go`

| Gap ID | Contract vs implementation mismatch | Severity | Affected story | Owning unit |
|---|---|---|---|---|
| BE-G01 | Contract does not define `GET /marketplace/products/{id}/variants`, but frontend variant selection depends on it and backend exposes it. | Blocking | US1, US2 | backend (contract update) |
| BE-G02 | Contract does not define `GET /marketplace/orders/{id}` (used to build real payment/confirmation context for logged-in flow). | Blocking | US3, US4 | backend (contract update) |
| BE-G03 | `GuestStatusDetail` contract omits `status_history` field that backend returns and frontend needs for timeline rendering. | Non-blocking | US4 | backend (contract update) |
| BE-G04 | Manual-payment contract response is generic, but backend returns structured manual-payment payload; generated clients can lose typed fields. | Non-blocking | US3, US4 | backend (contract update) |
| BE-G05 | `toGuestOrderStatusDetailResponse` in `view.go` does not map `shipping_tracking_number` even though DTO supports it, so buyer tracking can miss courier reference. | Blocking | US4 | backend |
| BE-G06 | `toOrderDetailResponse` in `view.go` also omits `shipping_tracking_number`, reducing post-checkout status fidelity for buyer confirmation pages. | Blocking | US3, US4 | backend |

Shared-layer risk points:
- `view.go`: response-shaping drift can silently break frontend state assumptions.
- `dto.go`: fields present in DTO but absent in contract make integration inconsistent.
- `service.go`: tracking token validation and review eligibility logic are strict; frontend must surface 403/409 branches deterministically.

## T003 - E2E Harness Baseline (Marketplace Module)

Current harness findings:
- `e2e-frontend/src/config/module-catalog.yaml` has no `marketplace` module entry.
- `e2e-frontend/src/flows/core/flow-registry.ts` has no marketplace flow registration.
- Existing fixtures are requester/reviewer-role oriented; buyer guest path needs dedicated fixture/state bootstrap.

Required marketplace harness shape:
- Module metadata:
  - `module_id: marketplace`
  - `module_type: tenant-specific` (or `shared` if validated cross-tenant)
  - `eligible_tenants: [bumdes]` initially (expand after deterministic data parity)
  - `default_flow_ids`: include core and post-order flows
- Flow IDs:
  - `marketplace-core-journey`
  - `marketplace-post-order-recovery`
- Tagging strategy:
  - `@module:marketplace`
  - `@tenant:bumdes` (plus other tenants when enabled)
  - `@critical` for catalog->cart->checkout->post-order happy path
- Evidence outputs (release gate):
  - `e2e-frontend/artifacts/junit.xml`
  - `e2e-frontend/artifacts/report.json`
  - `e2e-frontend/artifacts/html-report/`
  - failure bundle indexes `*.bundle.json`

Credential and scope baseline:
- Guest path: no login, cookie-backed buyer session.
- Logged-in path: tenant requester credentials from `tenant-profiles.yaml`.
- Both paths required for FR-010 and SC-002.

## T004 - Cross-Unit Defect Ownership Map

| Defect ID | Problem summary | Unit owner | Dependency edge | Priority |
|---|---|---|---|---|
| FE-D01 | Shipping page uses demo constants and simulated status branches. | frontend | none | P1 blocker |
| FE-D02 | Payment page uses draft/cart placeholder order reference and no backend manual-payment submit. | frontend | BE-G02 impacts enrichment path | P1 blocker |
| FE-D03 | Confirmation page is static and not tied to real order result. | frontend | depends on FE-D02 | P1 blocker |
| FE-D04 | Checkout flow lacks hardened duplicate-submit guard and deterministic recoverable validation feedback. | frontend | none | P1 blocker |
| BE-D01 | Missing `shipping_tracking_number` mapping in guest/order detail view shaping. | backend | blocks FE shipping confirmation fidelity | P1 blocker |
| BE-D02 | Contract incompleteness for variants and order detail paths. | backend | blocks strict contract parity for FE/E2E | P1 blocker |
| E2E-D01 | Marketplace module/flows absent in module catalog and registry. | e2e-frontend | depends on FE stabilization + BE contract clarity | P1 blocker |

## T005 - FR/SC Evidence Baseline

Evidence locations:
- Frontend tests: `frontend/src/__tests__/marketplace/`
- Frontend lint output: `frontend` command logs (`npm run lint`)
- Backend tests: `backend` command logs (`go test ...`)
- Playwright artifacts: `e2e-frontend/artifacts/`
- Acceptance summary: `docs/spec-kitty/002-stabilisasi-flow-marketplace-buyer/WP07-acceptance-notes.md`

### FR Traceability

| Requirement | Planned verification artifact |
|---|---|
| FR-001 | Route/action matrix in this document (T001) + review checklist entry |
| FR-002 | Frontend integration tests for route-level load/error states |
| FR-003 | Core journey tests covering listing/detail actions |
| FR-004 | Cart mutation tests and runtime mutation handlers (add from listing/detail) |
| FR-005 | Cart update/remove/totals consistency tests |
| FR-006 | Checkout form validation tests + invalid-submit assertions |
| FR-007 | Checkout submit-guard test (double-trigger) + order creation assertion |
| FR-008 | Payment/confirmation/tracking pages bound to backend order state tests |
| FR-009 | Error/empty/retry branch tests for core and post-order routes |
| FR-010 | Guest + logged-in verification entries in E2E module scenarios |
| FR-011 | Scope guard review in WP07 acceptance notes |
| FR-012 | Defect list closed in ownership map + per-WP commit/test evidence |
| FR-013 | Regression suite pass (`src/__tests__/marketplace`, lint, backend, E2E) |
| FR-014 | Playwright browser-level marketplace module tests (`test:module`, `test:critical`) |
| FR-015 | Mandatory Playwright gate pass recorded in WP07 evidence |

### SC Traceability

| Success criterion | Planned evidence |
|---|---|
| SC-001 | Completed route/action checklist with pass state references |
| SC-002 | Guest/logged-in scenario table in E2E run report |
| SC-003 | No blocking defects left in ownership map at WP07 handoff |
| SC-004 | Checkout duplicate-submit regression test + backend order count evidence |
| SC-005 | Error/retry tests for backend failure scenarios on buyer pages |
| SC-006 | Regression suite history and pass logs |
| SC-007 | Playwright outputs (`junit.xml`, `report.json`, html report) with pass status |

Mandatory gate:
- Playwright browser gate is required and non-optional before acceptance (`npm run test:module -- --tenant bumdes --module marketplace`, `npm run test:critical`, `npm run test:ci`).
