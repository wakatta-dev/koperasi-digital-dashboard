/** @format */

"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DateTimeRangePicker } from "@/components/ui/date-time-range-picker";
import { Textarea } from "@/components/ui/textarea";
import {
  createRAT,
  notifyRAT,
  uploadRATDocument,
  createRATVotingItem,
  voteRAT,
} from "@/services/api";
import { toast } from "sonner";
import AsyncCombobox from "@/components/ui/async-combobox";
import { listMembers, listRATHistory } from "@/services/api";
import type { MemberListItem, RAT } from "@/types/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export type RATSectionKey =
  | "jadwalkan-rat"
  | "kirim-notifikasi"
  | "upload-dokumen-rat"
  | "buat-voting"
  | "ikut-voting";

export function RATActions({ only }: { only?: RATSectionKey }) {
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [date, setDate] = useState<string>("");
  const [agenda, setAgenda] = useState<string>("");
  const [ratId, setRatId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [docType, setDocType] = useState<string>("agenda");
  const [docData, setDocData] = useState<string>("");
  const [docFileName, setDocFileName] = useState<string>("");
  const [voteQuestion, setVoteQuestion] = useState<string>("");
  const [voteType, setVoteType] = useState<string>("single");
  const [voteOptions, setVoteOptions] = useState<string>("Setuju\nTidak");
  const [openAt, setOpenAt] = useState<string>("");
  const [closeAt, setCloseAt] = useState<string>("");
  const [voteItemId, setVoteItemId] = useState<string>("");
  const [memberId, setMemberId] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("Setuju");

  const canCreateRat = !!year && !!date && !Number.isNaN(Number(year));
  const canNotify = !!ratId && !!message;
  const canUpload = !!ratId && !!docType && !!docData;
  const canCreateVote = !!ratId && !!voteQuestion && !!openAt && !!closeAt;
  const canVote = !!voteItemId && !!memberId && !!selectedOption;

  function parseLocal(dt?: string) {
    if (!dt) return null as Date | null;
    const d = new Date(dt);
    return isNaN(d.getTime()) ? null : d;
  }

  function ensureTimeOrder(start?: string, end?: string) {
    const s = parseLocal(start);
    const e = parseLocal(end);
    if (!s || !e) return false;
    return s.getTime() < e.getTime();
  }

  function formatDateTime(value?: string) {
    try {
      const d = value ? new Date(value) : null;
      if (!d || isNaN(d.getTime())) return "-";
      return d.toLocaleString("id-ID", {
        dateStyle: "medium",
        timeStyle: "short",
      });
    } catch {
      return "-";
    }
  }

  return (
    <div
      className={
        only
          ? "grid grid-cols-1 gap-6 w-full"
          : "grid grid-cols-1 lg:grid-cols-2 gap-6 w-full"
      }
    >
      {(!only || only === "jadwalkan-rat") && (
        <>
          <Card id={only === "jadwalkan-rat" ? "jadwalkan-rat" : undefined}>
            <CardHeader>
              <CardTitle>Jadwalkan RAT</CardTitle>
              <CardDescription>
                Buat jadwal RAT baru untuk tahun berjalan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="rat-year">Tahun</Label>
                    <Input
                      id="rat-year"
                      type="number"
                      placeholder="Mis. 2025"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="rat-date">Tanggal & Waktu</Label>
                    <Input
                      id="rat-date"
                      type="datetime-local"
                      placeholder="Pilih tanggal"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="rat-agenda">Agenda (opsional)</Label>
                  <Textarea
                    id="rat-agenda"
                    placeholder="Contoh: Laporan pengurus, Pengesahan SHU, Pemilihan pengurus, dll."
                    value={agenda}
                    onChange={(e) => setAgenda(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Pisahkan agenda dengan baris baru.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={!canCreateRat}
                    onClick={async () => {
                      try {
                        if (!canCreateRat) return;
                        const iso = date ? new Date(date).toISOString() : "";
                        const res = await createRAT({
                          year: Number(year),
                          date: iso || date,
                          agenda,
                        });
                        if (res.success) {
                          toast.success("RAT dibuat");
                          const id = (res.data as any)?.id;
                          if (id) setRatId(String(id));
                        } else {
                          toast.error(res.message || "Gagal membuat RAT");
                        }
                      } catch (e: any) {
                        toast.error(e?.message || "Gagal membuat RAT");
                      }
                    }}
                  >
                    Simpan
                  </Button>
                </div>
              </>
            </CardContent>
          </Card>
        </>
      )}

      {(!only || only === "kirim-notifikasi") && (
        <>
          <Card
            id={only === "kirim-notifikasi" ? "kirim-notifikasi" : undefined}
          >
            <CardHeader>
              <CardTitle>Kirim Notifikasi RAT</CardTitle>
              <CardDescription>
                Kirim pemberitahuan kepada anggota terkait jadwal atau agenda
                RAT
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="space-y-1 md:col-span-1">
                    <Label>RAT</Label>
                    <AsyncCombobox<RAT, number>
                      value={ratId ? Number(ratId) : null}
                      onChange={(val) => setRatId(val ? String(val) : "")}
                      getOptionValue={(r) => r.id}
                      getOptionLabel={(r) =>
                        `RAT ${r.year} — ${formatDateTime(r.date)}`
                      }
                      queryKey={["rat", "history-select"]}
                      fetchPage={async ({ pageParam }) => {
                        const params: Record<string, string | number> = {
                          limit: 10,
                        };
                        if (pageParam) params.cursor = pageParam;
                        const res = await listRATHistory(params as any).catch(
                          () => null
                        );
                        const items = (res?.data ?? []) as unknown as RAT[];
                        const nextPage = (res?.meta as any)?.pagination
                          ?.next_cursor as string | undefined;
                        return { items, nextPage };
                      }}
                      placeholder="Pilih RAT"
                      emptyText="Belum ada RAT"
                      notReadyText="Memuat daftar RAT..."
                      minChars={0}
                      renderOption={(r) => (
                        <div className="flex flex-col">
                          <span className="font-medium">RAT {r.year}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(r.date)}
                          </span>
                        </div>
                      )}
                      renderValue={(val) => (
                        <span>{val ? `RAT #${val}` : ""}</span>
                      )}
                    />
                  </div>
                  <div className="space-y-1 md:col-span-2">
                    <Label htmlFor="rat-message">Pesan</Label>
                    <Input
                      id="rat-message"
                      placeholder="Contoh: RAT akan dilaksanakan pada 12 Maret 10:00 WIB."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={!canNotify}
                    onClick={async () => {
                      try {
                        if (!canNotify) return;
                        const res = await notifyRAT(ratId, { message });
                        if (res.success) toast.success("Notifikasi dikirim");
                        else
                          toast.error(
                            res.message || "Gagal mengirim notifikasi"
                          );
                      } catch (e: any) {
                        toast.error(e?.message || "Gagal mengirim notifikasi");
                      }
                    }}
                  >
                    Kirim
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {(!only || only === "upload-dokumen-rat") && (
        <>
          <Card
            id={
              only === "upload-dokumen-rat" ? "upload-dokumen-rat" : undefined
            }
          >
            <CardHeader>
              <CardTitle>Upload Dokumen RAT</CardTitle>
              <CardDescription>
                Unggah dokumen pendukung, seperti agenda, materi, atau notulen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>RAT</Label>
                    <AsyncCombobox<RAT, number>
                      value={ratId ? Number(ratId) : null}
                      onChange={(val) => setRatId(val ? String(val) : "")}
                      getOptionValue={(r) => r.id}
                      getOptionLabel={(r) =>
                        `RAT ${r.year} — ${formatDateTime(r.date)}`
                      }
                      queryKey={["rat", "history-select-doc"]}
                      fetchPage={async ({ pageParam }) => {
                        const params: Record<string, string | number> = {
                          limit: 10,
                        };
                        if (pageParam) params.cursor = pageParam;
                        const res = await listRATHistory(params as any).catch(
                          () => null
                        );
                        const items = (res?.data ?? []) as unknown as RAT[];
                        const nextPage = (res?.meta as any)?.pagination
                          ?.next_cursor as string | undefined;
                        return { items, nextPage };
                      }}
                      placeholder="Pilih RAT"
                      emptyText="Belum ada RAT"
                      notReadyText="Memuat daftar RAT..."
                      minChars={0}
                      renderOption={(r) => (
                        <div className="flex flex-col">
                          <span className="font-medium">RAT {r.year}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(r.date)}
                          </span>
                        </div>
                      )}
                      renderValue={(val) => (
                        <span>{val ? `RAT #${val}` : ""}</span>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="doc-type">Tipe Dokumen</Label>
                    <Input
                      id="doc-type"
                      placeholder="cth: agenda, materi, notulen"
                      value={docType}
                      onChange={(e) => setDocType(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="doc-file">Pilih Berkas</Label>
                    <Input
                      id="doc-file"
                      type="file"
                      accept="application/pdf,image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = () => {
                          const result = reader.result as string;
                          // result is data URL; keep as-is for API if supported, else strip prefix
                          setDocData(result.split(",")[1] || result);
                          setDocFileName(file.name);
                        };
                        reader.readAsDataURL(file);
                      }}
                    />
                    {docFileName && (
                      <p className="text-xs text-muted-foreground">
                        Dipilih: {docFileName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="doc-base64">Atau tempel Base64 manual</Label>
                  <Textarea
                    id="doc-base64"
                    placeholder="Tempel data base64 di sini jika tidak menggunakan unggah berkas"
                    value={docData}
                    onChange={(e) => setDocData(e.target.value)}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={!canUpload}
                    onClick={async () => {
                      try {
                        if (!canUpload) return;
                        const res = await uploadRATDocument(ratId, {
                          type: docType,
                          data: docData,
                        });
                        if (res.success) {
                          toast.success("Dokumen diunggah");
                          setDocData("");
                          setDocFileName("");
                        } else {
                          toast.error(
                            res.message || "Gagal mengunggah dokumen"
                          );
                        }
                      } catch (e: any) {
                        toast.error(e?.message || "Gagal mengunggah dokumen");
                      }
                    }}
                  >
                    Upload
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {(!only || only === "buat-voting") && (
        <>
          <Card id={only === "buat-voting" ? "buat-voting" : undefined}>
            <CardHeader>
              <CardTitle>Buat Voting</CardTitle>
              <CardDescription>
                Tambahkan item voting untuk RAT, tentukan periode dan opsi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>RAT</Label>
                    <AsyncCombobox<RAT, number>
                      value={ratId ? Number(ratId) : null}
                      onChange={(val) => setRatId(val ? String(val) : "")}
                      getOptionValue={(r) => r.id}
                      getOptionLabel={(r) =>
                        `RAT ${r.year} — ${formatDateTime(r.date)}`
                      }
                      queryKey={["rat", "history-select-vote"]}
                      fetchPage={async ({ pageParam }) => {
                        const params: Record<string, string | number> = {
                          limit: 10,
                        };
                        if (pageParam) params.cursor = pageParam;
                        const res = await listRATHistory(params as any).catch(
                          () => null
                        );
                        const items = (res?.data ?? []) as unknown as RAT[];
                        const nextPage = (res?.meta as any)?.pagination
                          ?.next_cursor as string | undefined;
                        return { items, nextPage };
                      }}
                      placeholder="Pilih RAT"
                      emptyText="Belum ada RAT"
                      notReadyText="Memuat daftar RAT..."
                      minChars={0}
                      renderOption={(r) => (
                        <div className="flex flex-col">
                          <span className="font-medium">RAT {r.year}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDateTime(r.date)}
                          </span>
                        </div>
                      )}
                      renderValue={(val) => (
                        <span>{val ? `RAT #${val}` : ""}</span>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="vote-question">Pertanyaan</Label>
                    <Input
                      id="vote-question"
                      placeholder="Contoh: Setuju terhadap laporan pertanggungjawaban?"
                      value={voteQuestion}
                      onChange={(e) => setVoteQuestion(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Tipe Voting</Label>
                    <Select
                      value={voteType}
                      onValueChange={(v) => setVoteType(v)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Pilih tipe (single/multiple)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">single</SelectItem>
                        <SelectItem value="multiple">multiple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Periode Voting</Label>
                    <DateTimeRangePicker
                      value={{ start: openAt, end: closeAt }}
                      onChange={(s, e) => {
                        setOpenAt(s || "");
                        setCloseAt(e || "");
                      }}
                      triggerClassName="w-full"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="vote-options">Opsi Voting</Label>
                  <Textarea
                    id="vote-options"
                    placeholder="Satu opsi per baris. Contoh:\nSetuju\nTidak Setuju\nAbstain"
                    value={voteOptions}
                    onChange={(e) => setVoteOptions(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Minimal 2 opsi untuk tipe single.
                  </p>
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={!canCreateVote}
                    onClick={async () => {
                      try {
                        if (!canCreateVote) return;
                        if (!ensureTimeOrder(openAt, closeAt)) {
                          toast.error(
                            "Rentang waktu voting tidak valid (mulai < selesai)"
                          );
                          return;
                        }
                        const opts = voteOptions
                          .split("\n")
                          .map((s) => s.trim())
                          .filter(Boolean);
                        if (opts.length < 2 && voteType !== "multiple") {
                          toast.error("Minimal 2 opsi untuk voting");
                          return;
                        }
                        const oIso = openAt
                          ? new Date(openAt).toISOString()
                          : "";
                        const cIso = closeAt
                          ? new Date(closeAt).toISOString()
                          : "";
                        const res = await createRATVotingItem(ratId, {
                          question: voteQuestion,
                          type: voteType,
                          options: opts,
                          open_at: oIso || openAt,
                          close_at: cIso || closeAt,
                        });
                        if (res.success) {
                          const id = (res.data as any)?.id;
                          if (id) setVoteItemId(String(id));
                          toast.success("Voting dibuat");
                        } else {
                          toast.error(res.message || "Gagal membuat voting");
                        }
                      } catch (e: any) {
                        toast.error(e?.message || "Gagal membuat voting");
                      }
                    }}
                  >
                    Simpan Voting
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {(!only || only === "ikut-voting") && (
        <>
          <Card id={only === "ikut-voting" ? "ikut-voting" : undefined}>
            <CardHeader>
              <CardTitle>Ikut Voting</CardTitle>
              <CardDescription>
                Pilih anggota dan kirim suara untuk item voting
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div className="space-y-1">
                    <Label htmlFor="vote-item-id">Item Voting ID</Label>
                    <Input
                      id="vote-item-id"
                      placeholder="ID item voting"
                      value={voteItemId}
                      onChange={(e) => setVoteItemId(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1 md:col-span-1">
                    <Label>Anggota</Label>
                    <AsyncCombobox<MemberListItem, number>
                      value={memberId ? Number(memberId) : null}
                      onChange={(val) => setMemberId(val ? String(val) : "")}
                      getOptionValue={(m) => m.id}
                      getOptionLabel={(m) =>
                        m.user?.full_name || m.no_anggota || String(m.id)
                      }
                      queryKey={["members", "search-rat-vote"]}
                      fetchPage={async ({ search, pageParam }) => {
                        const params: Record<string, string | number> = {
                          limit: 10,
                        };
                        if (pageParam) params.cursor = pageParam;
                        if (search) params.term = search;
                        const res = await listMembers(params);
                        const items = (res?.data ??
                          []) as unknown as MemberListItem[];
                        const nextPage = (res?.meta as any)?.pagination
                          ?.next_cursor as string | undefined;
                        return { items, nextPage };
                      }}
                      placeholder="Cari anggota (nama/email/no. anggota)"
                      emptyText="Tidak ada anggota"
                      notReadyText="Ketik untuk mencari"
                      minChars={1}
                      renderOption={(m) => (
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {m.user?.full_name || `Anggota #${m.id}`}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {m.no_anggota} • {m.user?.email || "-"}
                          </span>
                        </div>
                      )}
                      renderValue={(val) => (
                        <span>{val ? `Anggota #${val}` : ""}</span>
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="vote-option">Opsi</Label>
                    <Input
                      id="vote-option"
                      placeholder="Contoh: Setuju"
                      value={selectedOption}
                      onChange={(e) => setSelectedOption(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    disabled={!canVote}
                    onClick={async () => {
                      try {
                        if (!canVote) return;
                        const res = await voteRAT(voteItemId, {
                          member_id: Number(memberId),
                          selected_option: selectedOption,
                        });
                        if (res.success) toast.success("Suara terkirim");
                        else toast.error(res.message || "Gagal mengirim suara");
                      } catch (e: any) {
                        toast.error(e?.message || "Gagal mengirim suara");
                      }
                    }}
                  >
                    Kirim Suara
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
