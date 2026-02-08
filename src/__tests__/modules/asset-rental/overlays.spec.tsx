/** @format */

import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AssetScheduleView } from "@/modules/asset/components/asset-schedule-view";

describe("asset-rental overlays", () => {
  it("handles reject flow on pengajuan sewa", () => {
    render(<AssetScheduleView activeSection="pengajuan" />);

    fireEvent.click(screen.getAllByRole("button", { name: /^tolak$/i })[0]);
    expect(screen.getByText("Tolak Pengajuan Sewa")).toBeTruthy();

    fireEvent.change(screen.getByLabelText("Alasan Penolakan"), {
      target: { value: "Dokumen belum lengkap" },
    });

    fireEvent.click(screen.getByRole("button", { name: /konfirmasi tolak/i }));
    expect(screen.queryByText("Tolak Pengajuan Sewa")).toBeNull();
  });

  it("handles pengembalian flow (proses -> konfirmasi -> selesai)", () => {
    render(<AssetScheduleView activeSection="pengembalian" />);

    fireEvent.click(screen.getAllByRole("button", { name: /proses kembali/i })[0]);
    expect(screen.getByText("Konfirmasi Pengembalian Aset")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /konfirmasi & selesaikan/i }));
    expect(screen.getByRole("dialog", { name: /tandai selesai pengembalian/i })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: /tandai selesai/i }));
    expect(screen.queryByRole("dialog", { name: /tandai selesai pengembalian/i })).toBeNull();
  });
});
