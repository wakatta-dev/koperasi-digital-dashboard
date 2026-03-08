/** @format */

// @vitest-environment jsdom
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

const push = vi.fn();
const useSessionMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("next-auth/react", () => ({
  useSession: () => useSessionMock(),
}));

vi.mock("@/components/shared/enterprise-loading", () => ({
  default: () => <div>loading</div>,
}));

import { ProtectedRoute } from "@/components/shared/protected-route";

describe("ProtectedRoute", () => {
  beforeEach(() => {
    push.mockReset();
    useSessionMock.mockReset();
  });

  it("renders children when tenant type and internal role are allowed", () => {
    useSessionMock.mockReturnValue({
      status: "authenticated",
      data: { user: { jenis_tenant: "bumdes", role: "finance" } },
    });

    render(
      <ProtectedRoute requiredRole="bumdes" allowedRoles={["finance", "admin"]}>
        <div>allowed-content</div>
      </ProtectedRoute>
    );

    expect(screen.getByText("allowed-content")).toBeTruthy();
  });

  it("redirects authenticated users with disallowed internal role to their dashboard", async () => {
    useSessionMock.mockReturnValue({
      status: "authenticated",
      data: { user: { jenis_tenant: "bumdes", role: "operator" } },
    });

    render(
      <ProtectedRoute requiredRole="bumdes" allowedRoles={["finance", "admin"]}>
        <div>blocked-content</div>
      </ProtectedRoute>
    );

    await waitFor(() => {
      expect(push).toHaveBeenCalledWith("/bumdes/dashboard");
    });
  });
});
