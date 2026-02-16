# WP07 Operational Hard-Gate Checklist (Frontend Unit)

Feature: `003-marketplace-mvp-security-release-gates`

This checklist is the release decision source of truth for manual hard-gate execution.

## Gate Categories

Required categories: `security`, `policy`, `fallback`, `tests`, `operations`.

## Checklist Items

| gate_id | category | mandatory | pass_criteria | minimum_evidence |
|---|---|---|---|---|
| `security.authorization-matrix` | security | yes | Role matrix and tenant/ownership guard outcomes match approved baseline with no unresolved mismatch. | Latest matrix artifact + reviewer note |
| `security.fail-closed-flag` | security | yes | `OFF` and `UNAVAILABLE` states deny marketplace API and UI flows. | Test output or run log proving deny on both states |
| `policy.endpoint-coverage` | policy | yes | All active marketplace endpoints are covered by policy inventory and enforcement map. | Policy coverage artifact with timestamp |
| `fallback.production-governance` | fallback | yes | Development-only fallback is disabled in production; production-local fallback is clearly labeled and bounded. | Frontend test evidence + UI capture/reference |
| `tests.frontend-marketplace` | tests | yes | Frontend marketplace blocker suite is green with zero failing tests. | Test command output + report link/path |
| `tests.e2e-critical-marketplace` | tests | yes | Critical marketplace E2E real-run suite is green and artifact-complete. | E2E report + trace/screenshot bundle |
| `operations.incident-runbook-ready` | operations | yes | Incident runbook reviewed and mapped to alert triggers. | Runbook review note + approver |
| `operations.observability-baseline-ready` | operations | yes | Gate telemetry and alerts are defined and linked to explicit runbook actions. | Dashboard/alert config reference |
| `operations.dashboard-snapshot` | operations | no | Dashboard snapshot for release window is attached for audit convenience. | Snapshot artifact |

## Mandatory vs Optional Rules

- Mandatory items must all be `pass` before release can be approved.
- Optional items may stay `not_evaluated` without blocking release, but cannot contradict any mandatory result.

## Fail-Fast Rule

- One mandatory item with `status=fail` causes immediate release decision `rejected`.
- One mandatory item with `status=not_evaluated` causes immediate release decision `rejected`.
- One mandatory item with missing evidence causes immediate release decision `rejected`.
- No override path is allowed.

## Decision SOP (No Override)

### Reviewers and Approver

- `backend reviewer`: validates security and policy gates.
- `frontend reviewer`: validates fallback and frontend test gates.
- `e2e reviewer`: validates critical E2E gate.
- `release manager`: final approver for `approved` or `rejected` decision.

### Automatic Reject Conditions

Release is automatically `rejected` when any of these occur:

- A mandatory gate is `fail`.
- A mandatory gate is `not_evaluated`.
- Evidence bundle entry is missing required fields.
- High/Critical finding remains open for authorization, policy, fallback, contract/UX, or blocker tests.

### Rerun Process After Fix (Without Override)

1. Record remediation ticket IDs for each failed gate.
2. Re-run only the failed checks to verify fix impact.
3. Generate fresh evidence entries with new UTC timestamps.
4. Re-evaluate all mandatory gates in one final pass window.
5. Set final decision:
   - `approved` only when all mandatory gates are `pass`.
   - `rejected` for any other state.

## Decision Output Format

```json
{
  "decision": "approved|rejected",
  "override_used": false,
  "decided_at": "YYYY-MM-DDTHH:MM:SSZ",
  "decided_by": "release-manager",
  "reason": "single-line justification",
  "evidence_bundle_ref": "path-or-link"
}
```
