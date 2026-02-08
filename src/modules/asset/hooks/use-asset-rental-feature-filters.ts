/** @format */

import { useMemo, useState } from "react";

export function useAssetRentalFeatureFilters() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("Semua");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const resetFilters = () => {
    setSearch("");
    setStatus("Semua");
    setPage(1);
  };

  const query = useMemo(
    () => ({ search: search.trim(), status, page, pageSize }),
    [page, search, status]
  );

  return {
    search,
    status,
    page,
    pageSize,
    query,
    setSearch,
    setStatus,
    setPage,
    resetFilters,
  };
}
