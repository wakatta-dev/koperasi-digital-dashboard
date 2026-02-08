/** @format */

import { useState } from "react";

import type { AssetAttribute } from "../types/stitch";

function createRowId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `attr-${Math.random().toString(36).slice(2, 10)}`;
}

export function useAssetAttributeRows(initialRows: AssetAttribute[] = []) {
  const [rows, setRows] = useState<AssetAttribute[]>(
    initialRows.length > 0
      ? initialRows
      : [{ id: createRowId(), label: "", value: "" }]
  );

  const addRow = () => {
    setRows((prev) => [
      ...prev,
      { id: createRowId(), label: "", value: "" },
    ]);
  };

  const removeRow = (id: string) => {
    setRows((prev) => {
      const next = prev.filter((row) => row.id !== id);
      return next.length > 0
        ? next
        : [{ id: createRowId(), label: "", value: "" }];
    });
  };

  const updateRow = (id: string, field: "label" | "value", value: string) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  return {
    rows,
    setRows,
    addRow,
    removeRow,
    updateRow,
  };
}
