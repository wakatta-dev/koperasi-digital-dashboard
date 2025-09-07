/** @format */

// View-level types for RAT feature (not API contracts)

export type RatStatus = "selesai" | "pending_notulen" | "dijadwalkan";

export type AgendaItem = {
  id: string | number;
  title: string;
  summary: string;
  speaker?: string;
  materialUrl?: string;
  published: boolean;
};

export type VotingItemLite = {
  id: number;
  question: string;
  open_at: string;
  close_at: string;
  totalVotes: number;
};

