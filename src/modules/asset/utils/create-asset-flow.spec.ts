/** @format */

import { describe, expect, it } from "vitest";

import {
  DRAFT_INTERNAL_STATUS,
  PUBLIC_AVAILABLE_STATUS,
  isPublicAvailabilityStatus,
  resolveCreateAvailabilityStatus,
} from "./create-asset-flow";

describe("create-asset-flow", () => {
  it("marks Tersedia as public status", () => {
    expect(isPublicAvailabilityStatus(PUBLIC_AVAILABLE_STATUS)).toBe(true);
  });

  it("downgrades public create requests to Draft Internal", () => {
    expect(resolveCreateAvailabilityStatus(PUBLIC_AVAILABLE_STATUS)).toBe(
      DRAFT_INTERNAL_STATUS
    );
  });

  it("keeps non-public statuses unchanged", () => {
    expect(resolveCreateAvailabilityStatus("Maintenance")).toBe("Maintenance");
  });
});

