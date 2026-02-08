/** @format */

export type AssetRentalRentalsRow = Readonly<{
  id: string;
  assetName: string;
  assetTag: string;
  borrowerName: string;
  borrowerUnit: string;
  startDate: string;
  returnDate: string;
  status: "Berjalan" | "Terlambat" | "Selesai";
}>;

export type AssetRentalRequestsRow = Readonly<{
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

export type AssetRentalReturnsRow = Readonly<{
  id: string;
  assetName: string;
  borrowerName: string;
  dueDate: string;
  plannedReturnDate: string | null;
  status: "Menunggu Pengembalian" | "Diproses" | "Selesai";
}>;
