# Quickstart: WP07 Operational Hard-Gate Execution (Frontend Unit)

Feature: `003-marketplace-mvp-security-release-gates`

Use this quickstart to generate an audit-ready evidence bundle and a deterministic no-override release decision.

## 1) Run Core Verification Commands

Backend:

- `cd /Users/faizalfakhri/Documents/koperasi/project/backend`
- `go test ./internal/modules/client/marketplace/... -count=1`

Frontend:

- `cd /Users/faizalfakhri/Documents/koperasi/project/frontend`
- `npm run test -- src/__tests__/marketplace`

E2E:

- `cd /Users/faizalfakhri/Documents/koperasi/project/e2e-frontend`
- `npm run gate:marketplace:critical`

E2E mandatory env (minimum):

- `E2E_BUMDES_FRONTEND_BASE_URL`
- `E2E_BUMDES_REQUESTER_EMAIL`
- `E2E_BUMDES_REQUESTER_PASSWORD`
- `E2E_BUMDES_REVIEWER_EMAIL`
- `E2E_BUMDES_REVIEWER_PASSWORD`
- `E2E_BACKEND_BASE_URL`

## 2) Fill Manual Checklist

- Open `docs/spec-kitty/003-marketplace-mvp-security-release-gates/checklists/hard-gate-operational-checklist.md`.
- Evaluate every mandatory gate item.
- Apply fail-fast rule: one mandatory fail/missing evidence means release `rejected`.

## 3) Evidence Bundle Schema (Required)

Each entry must include all fields below:

- `evidence_id`: unique stable ID.
- `gate_id`: checklist gate item ID.
- `unit`: `backend|frontend|e2e|ops`.
- `command`: exact command executed.
- `timestamp_utc`: RFC3339 UTC timestamp (`YYYY-MM-DDTHH:MM:SSZ`).
- `outcome`: `pass|fail`.
- `artifact_path_or_link`: path/link to output, report, trace, or log.
- `reviewer`: reviewer identity.
- `failure_summary`: required only when `outcome=fail`.

Failure summary format (required when fail):

```json
{
  "symptom": "short incident symptom",
  "likely_scope": "tenant|endpoint|flow",
  "first_failing_step": "command or gate step",
  "next_action": "single next mitigation action"
}
```

## 4) Evidence Examples

Backend example:

```json
{
  "evidence_id": "ev-backend-001",
  "gate_id": "security.fail-closed-flag",
  "unit": "backend",
  "command": "go test ./internal/modules/client/marketplace/... -count=1",
  "timestamp_utc": "2026-02-15T08:10:00Z",
  "outcome": "pass",
  "artifact_path_or_link": "artifacts/backend/marketplace-gate-test.txt",
  "reviewer": "backend-reviewer"
}
```

Frontend example:

```json
{
  "evidence_id": "ev-frontend-001",
  "gate_id": "tests.frontend-marketplace",
  "unit": "frontend",
  "command": "npm run test -- src/__tests__/marketplace",
  "timestamp_utc": "2026-02-15T08:20:00Z",
  "outcome": "pass",
  "artifact_path_or_link": "artifacts/frontend/marketplace-vitest.txt",
  "reviewer": "frontend-reviewer"
}
```

E2E example:

```json
{
  "evidence_id": "ev-e2e-001",
  "gate_id": "tests.e2e-critical-marketplace",
  "unit": "e2e",
  "command": "npm run gate:marketplace:critical",
  "timestamp_utc": "2026-02-15T08:35:00Z",
  "outcome": "fail",
  "artifact_path_or_link": "artifacts/e2e/report/index.html",
  "reviewer": "e2e-reviewer",
  "failure_summary": {
    "symptom": "Critical checkout denial scenario failed on retry flow",
    "likely_scope": "payment",
    "first_failing_step": "tests.e2e-critical-marketplace",
    "next_action": "Run INC-TRACKING-PAYMENT-PATTERN runbook and fix contract parity"
  }
}
```

## 5) Scenario Walkthrough Validation

1. Run the three core command groups.
2. Record one pass and one fail sample entry using the schema above.
3. Mark checklist items based on real outcomes.
4. Verify release decision logic:
   - Any mandatory fail or missing evidence -> `rejected`.
   - All mandatory pass with complete evidence -> `approved`.

## 6) Final Decision Rule

- `approved`: all mandatory items `pass` with complete evidence and no active High/Critical finding.
- `rejected`: any other condition.
- Override is prohibited.
