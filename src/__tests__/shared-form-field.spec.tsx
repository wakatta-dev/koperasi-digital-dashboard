/** @format */

// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { InputField } from "@/components/shared/inputs/input-field";
import { TextareaField } from "@/components/shared/inputs/textarea-field";

describe("shared form field components", () => {
  it("wires a visible label to the input (id provided)", () => {
    render(<InputField id="full-name" label="Nama Lengkap" />);
    const input = screen.getByLabelText("Nama Lengkap");
    expect(input).toBeTruthy();
    expect(input.getAttribute("id")).toBe("full-name");
  });

  it("wires a visible label to the input (id auto-generated)", () => {
    render(<InputField label="Nama Lengkap" />);
    const input = screen.getByLabelText("Nama Lengkap");
    expect(input).toBeTruthy();
    expect(input.getAttribute("id")).toMatch(/^field-/);
  });

  it("supports ariaLabel when a visible label is not rendered", () => {
    render(<InputField ariaLabel="Cari pesanan" placeholder="Cari..." />);
    expect(screen.getByLabelText("Cari pesanan")).toBeTruthy();
    expect(screen.queryByText("Cari pesanan")).toBeNull();
  });

  it("renders helper + error in order and wires aria-describedby", () => {
    render(
      <InputField
        id="email"
        label="Email"
        helperText="Gunakan email aktif."
        errorText="Email tidak valid."
      />
    );

    const input = screen.getByLabelText("Email");
    expect(input.getAttribute("aria-invalid")).toBe("true");

    const helper = screen.getByText("Gunakan email aktif.");
    const error = screen.getByText("Email tidak valid.");
    expect(helper.compareDocumentPosition(error) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    const describedBy = input.getAttribute("aria-describedby") ?? "";
    expect(describedBy).toContain(helper.getAttribute("id") ?? "");
    expect(describedBy).toContain(error.getAttribute("id") ?? "");
  });

  it("applies icon-leading padding automatically", () => {
    render(
      <InputField
        ariaLabel="Cari aset"
        startIcon={<span data-testid="icon">search</span>}
      />
    );
    const input = screen.getByLabelText("Cari aset");
    expect(input.className).toContain("pl-10");
  });

  it("applies end-icon padding automatically", () => {
    render(
      <InputField
        ariaLabel="Jumlah transfer"
        endIcon={<span data-testid="end">IDR</span>}
      />
    );
    const input = screen.getByLabelText("Jumlah transfer");
    expect(input.className).toContain("pr-10");
  });

  it("sets aria-invalid for textarea when errorText is present", () => {
    render(
      <TextareaField
        id="purpose"
        label="Tujuan"
        errorText="Wajib diisi."
        placeholder="..."
      />
    );
    const textarea = screen.getByLabelText("Tujuan");
    expect(textarea.getAttribute("aria-invalid")).toBe("true");
  });
});
