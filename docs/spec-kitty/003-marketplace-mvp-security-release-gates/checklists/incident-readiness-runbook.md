# WP07 Incident Readiness Runbook for Gate-Critical Failures

Feature: `003-marketplace-mvp-security-release-gates`

This runbook covers incident response for gate-critical failures without introducing release overrides.

## Trigger Matrix

| incident_id | trigger | severity default | source signal |
|---|---|---|---|
| `INC-FLAG-OUTAGE` | Mass deny caused by `marketplace_disabled` or `flag_unavailable` | SEV-1 | Gate deny metric spike + availability checks |
| `INC-DENY-SPIKE` | Rapid increase in one deny reason (`forbidden_tenant`, `forbidden_ownership`, `invalid_tracking_token`, `forbidden_role`) | SEV-2 | Deny reason ratio and rate alerts |
| `INC-TRACKING-PAYMENT-PATTERN` | Tracking/payment failures crossing error threshold | SEV-2 | Flow failure and service-unavailable alerts |

## Common Response Protocol

1. Acknowledge alert and assign `incident_commander` within 5 minutes.
2. Freeze release decision to `rejected` while incident is active.
3. Capture first evidence bundle entry (UTC timestamp, trigger, on-call owner).
4. Triage scope by tenant, endpoint class, and deny reason distribution.
5. Execute scenario-specific runbook actions.
6. Post status updates at minimum cadence (see communication section).
7. Close incident only after recovery validation and evidence completion.

## Scenario A: Flag Outage / Fail-Closed Mass Deny (`INC-FLAG-OUTAGE`)

### Detection Baseline

- Alert: `marketplace_gate_deny_total` spikes above normal baseline.
- Threshold:
  - Deny ratio > 80% for 5 minutes, and
  - dominant reason is `marketplace_disabled` or `flag_unavailable`.

### Actions

1. Confirm current flag state per environment (`ON/OFF/UNAVAILABLE`).
2. Validate config service health and last successful flag sync time.
3. Check whether deny is global or tenant-specific.
4. If outage confirmed, recover flag/config service path.
5. Re-run gate verification commands and update evidence bundle.

### Exit Criteria

- Deny ratio returns below 20% for 10 consecutive minutes.
- Fresh gate verification evidence shows expected allow/deny behavior.

## Scenario B: Deny Reason Spike (`INC-DENY-SPIKE`)

### Detection Baseline

- Alert: single deny reason ratio exceeds threshold.
- Threshold:
  - any one deny reason > 40% of total gate decisions for 10 minutes, or
  - deny volume increases 3x compared with previous 60-minute baseline.

### Actions

1. Identify top deny reason and affected endpoints.
2. Validate recent deploy, config, and policy changes.
3. Compare tenant and actor distribution for anomaly detection.
4. Apply remediation (policy fix, tenant mapping fix, ownership validation fix).
5. Re-run focused checks for affected paths, then full mandatory gates.

### Exit Criteria

- Dominant deny reason drops below 25% sustained for 15 minutes.
- No unresolved High/Critical findings remain from the incident.

## Scenario C: Tracking/Payment Failure Pattern (`INC-TRACKING-PAYMENT-PATTERN`)

### Detection Baseline

- Alert: `tracking` or `payment` flow failures exceed operational threshold.
- Threshold:
  - 5xx rate > 5% for 10 minutes on tracking/payment endpoints, or
  - conflict/validation failures > 15% for 10 minutes with user impact.

### Actions

1. Separate backend failure from frontend fallback-only behavior.
2. Validate whether UI is incorrectly claiming backend success.
3. Correlate with payment provider/log pipeline anomalies.
4. Recover service dependency and verify contract/UX parity behavior.
5. Capture before/after evidence and rerun critical tests.

### Exit Criteria

- Error rates return below defined threshold for 15 minutes.
- Frontend and E2E evidence confirm no false-success state.

## Communication and Status Update Minimum

| checkpoint | max_delay | required update |
|---|---|---|
| Incident declared | 10 minutes | Incident ID, trigger, impact scope, commander |
| Triage complete | 30 minutes | Root-cause hypothesis, affected services, immediate mitigation |
| Mitigation in progress | every 30 minutes | Current status, remaining risk, next ETA |
| Recovery validated | 15 minutes after recovery | Validation evidence refs, gate status, follow-up actions |
| Incident closed | 60 minutes | Final summary, timeline UTC, prevention actions |

Status template:

```text
[INCIDENT UPDATE] <INCIDENT_ID> <UTC_TIMESTAMP>
Status: investigating|mitigating|monitoring|resolved
Impact: <tenants/endpoints/flow>
Current hypothesis: <short statement>
Actions completed: <comma-separated>
Next update ETA (UTC): <timestamp>
Evidence refs: <paths or links>
```

## Observability Baseline and Alert-to-Runbook Mapping

### Required Gate Events and Metrics

| signal_key | minimum labels | purpose |
|---|---|---|
| `marketplace_gate_decision_total` | `decision`, `deny_reason`, `endpoint_key`, `tenant_id` | Core allow/deny visibility |
| `marketplace_flag_state_total` | `state`, `environment`, `tenant_id` | Detect `OFF`/`UNAVAILABLE` anomalies |
| `marketplace_flow_failure_total` | `flow_area`, `http_status`, `tenant_id` | Track tracking/payment failure patterns |
| `marketplace_fallback_local_context_total` | `flow_area`, `mode` | Distinguish local context fallback usage |

### Alert Rules

| alert_id | condition | linked runbook |
|---|---|---|
| `ALERT-GATE-FLAG-DENY-SPIKE` | Deny ratio > 80% for 5m and reason in (`marketplace_disabled`, `flag_unavailable`) | `INC-FLAG-OUTAGE` |
| `ALERT-GATE-DENY-REASON-SPIKE` | Single deny reason > 40% for 10m or deny volume 3x baseline | `INC-DENY-SPIKE` |
| `ALERT-TRACKING-PAYMENT-FAILURE` | 5xx > 5% for 10m or conflict/validation > 15% for 10m | `INC-TRACKING-PAYMENT-PATTERN` |

Release remains `rejected` while any of the alerts above is active and unresolved.
