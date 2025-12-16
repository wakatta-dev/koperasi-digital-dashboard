/** @format */

type TelemetryEvent =
  | "analytics_load_success"
  | "analytics_load_error"
  | "analytics_range_change"
  | "notification_mark_read"
  | "notification_mark_all"
  | "quick_action_launch";

type TelemetryPayload = Record<string, unknown>;

// Placeholder telemetry hook. Replace with real logger when available.
export function trackAnalyticsEvent(event: TelemetryEvent, payload?: TelemetryPayload) {
  if (process.env.NODE_ENV === "test") return;
  console.info("[analytics-event]", event, payload);
}
