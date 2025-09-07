/** @format */

"use client";

import { useQuery } from "@tanstack/react-query";
import { listRATHistory, listRATDocuments } from "@/services/api";
import type { RAT, RATDocument } from "@/types/api";
import type { RatStatus, AgendaItem, VotingItemLite } from "@/types/rat-view";

export function useRATDashboardSummary() {
  return useQuery({
    queryKey: ["rat", "dashboard", "summary"],
    // TODO: replace with real endpoint e.g., getRATDashboardSummary()
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 150));
      const status: RatStatus = "selesai";
      return {
        nextSchedule: {
          date: new Date(Date.now() + 7 * 86400_000).toISOString(),
          isOnline: true,
          venue: "Zoom / Online",
        },
        stats: {
          agendasPublished: 6,
          attendeesConfirmed: 128,
          votingParticipation: 72, // percent
          lastRatStatus: status, // selesai | pending_notulen | dijadwalkan
        },
      };
    },
  });
}

export function useRATAgenda() {
  return useQuery({
    queryKey: ["rat", "agenda", "list"],
    // TODO: replace with real endpoint e.g., listRATAgenda(ratId)
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 120));
      const items: AgendaItem[] = [
        {
          id: 1,
          title: "Pembukaan",
          summary: "Pembukaan oleh MC dan sambutan ketua",
          speaker: "Ketua Koperasi",
          published: true,
        },
        {
          id: 2,
          title: "Laporan Pengurus",
          summary: "Pemaparan kinerja dan keuangan setahun terakhir",
          speaker: "Bendahara",
          materialUrl: "/files/materi-laporan.pdf",
          published: true,
        },
        {
          id: 3,
          title: "Pengesahan SHU",
          summary: "Pembahasan dan pengesahan pembagian SHU",
          speaker: "Pengawas",
          materialUrl: "/files/shu-2024.pdf",
          published: false,
        },
      ];
      return items;
    },
  });
}

export function useRATVoting() {
  return useQuery({
    queryKey: ["rat", "voting", "active"],
    // TODO: replace with real endpoint e.g., listActiveVoting(ratId)
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 100));
      const now = Date.now();
      const items: VotingItemLite[] = [
        {
          id: 21,
          question: "Persetujuan Laporan Pertanggungjawaban",
          open_at: new Date(now - 1 * 3600_000).toISOString(),
          close_at: new Date(now + 3 * 3600_000).toISOString(),
          totalVotes: 245,
        },
        {
          id: 22,
          question: "Pemilihan Pengurus",
          open_at: new Date(now + 4 * 3600_000).toISOString(),
          close_at: new Date(now + 10 * 3600_000).toISOString(),
          totalVotes: 0,
        },
      ];
      const participation = 72; // percent (placeholder)
      return { items, participation };
    },
  });
}

export function useLatestRAT() {
  return useQuery({
    queryKey: ["rat", "history", "latest"],
    // Uses real history endpoint if available; falls back to null
    queryFn: async () => {
      const res = await listRATHistory({ limit: 5 }).catch(() => null);
      const items = (res && res.success ? ((res.data as RAT[]) ?? []) : []) as RAT[];
      if (!items.length) return null as RAT | null;
      // Prefer upcoming nearest; else latest past
      const now = Date.now();
      const withTs = items
        .map((r) => ({ r, ts: new Date(r.date).getTime() }))
        .filter((x) => !Number.isNaN(x.ts));
      const future = withTs.filter((x) => x.ts >= now).sort((a, b) => a.ts - b.ts);
      const past = withTs.filter((x) => x.ts < now).sort((a, b) => b.ts - a.ts);
      return (future[0]?.r ?? past[0]?.r) || null;
    },
  });
}

export function useRATDocumentsFor(id?: number | null) {
  return useQuery({
    queryKey: ["rat", "documents", id ?? "none"],
    enabled: !!id,
    // Uses real documents endpoint if available
    queryFn: async () => {
      if (!id) return [] as RATDocument[];
      const res = await listRATDocuments(id).catch(() => null);
      return (res && res.success ? ((res.data as RATDocument[]) ?? []) : []) as RATDocument[];
    },
  });
}

export function useRATNotifications() {
  return useQuery({
    queryKey: ["rat", "notifications"],
    // TODO: replace with real endpoint, or filter global notifications for RAT category
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 80));
      return [
        { id: 1, type: "reminder", text: "Pengingat: RAT 7 hari lagi", at: new Date().toISOString() },
        { id: 2, type: "voting", text: "Hasil voting 'Laporan' selesai dihitung", at: new Date().toISOString() },
        { id: 3, type: "notulen", text: "Notulen RAT belum diunggah", at: new Date().toISOString() },
      ];
    },
  });
}

export function useRATReports() {
  return useQuery({
    queryKey: ["rat", "reports", "summary"],
    // TODO: replace with real endpoints for attendance & SHU post-RAT
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 120));
      return {
        attendance: { totalMembers: 450, attended: 310, rate: 69 },
        shu: { year: new Date().getFullYear() - 1, approved: true, value: 525_000_000 },
      };
    },
  });
}

