/** @format */

export type RentalListItem = Readonly<{
  id: string;
  assetName: string;
  assetTag: string;
  borrowerName: string;
  borrowerUnit: string;
  startDate: string;
  returnDate: string;
  status: "Berjalan" | "Terlambat" | "Selesai";
}>;

export type RentalRequestItem = Readonly<{
  id: string;
  requesterName: string;
  requesterUnit: string;
  assetName: string;
  assetTypeLabel: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
}>;

export type ReturnListItem = Readonly<{
  id: string;
  assetName: string;
  borrowerName: string;
  dueDate: string;
  plannedReturnDate: string | null;
  status: "Menunggu Pengembalian" | "Diproses" | "Selesai";
}>;

export type RejectRequestModalState = Readonly<{
  open: boolean;
  bookingId: string | null;
  reason: string;
}>;

export type ReturnConfirmationModalState = Readonly<{
  open: boolean;
  bookingId: string | null;
  returnDateTime: string;
  condition: "baik" | "rusak" | "perbaikan";
  notes: string;
}>;
