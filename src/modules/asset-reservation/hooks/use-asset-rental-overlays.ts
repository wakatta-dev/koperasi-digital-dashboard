/** @format */

import { useState } from "react";

export function useAssetRentalOverlays() {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [markReturnOpen, setMarkReturnOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const clearSelection = () => setSelectedId(null);

  return {
    selectedId,
    rejectOpen,
    confirmOpen,
    markReturnOpen,
    openReject: (id: string) => {
      setSelectedId(id);
      setRejectOpen(true);
    },
    openConfirm: (id: string) => {
      setSelectedId(id);
      setConfirmOpen(true);
    },
    openMarkReturn: (id: string) => {
      setSelectedId(id);
      setMarkReturnOpen(true);
    },
    closeReject: () => {
      setRejectOpen(false);
      clearSelection();
    },
    closeConfirm: () => {
      setConfirmOpen(false);
      clearSelection();
    },
    closeMarkReturn: () => {
      setMarkReturnOpen(false);
      clearSelection();
    },
  };
}
