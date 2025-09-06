/** @format */

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createRAT, notifyRAT, uploadRATDocument, createRATVotingItem, voteRAT } from "@/services/api";
import { toast } from "sonner";

export function RATActions() {
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));
  const [date, setDate] = useState<string>("");
  const [agenda, setAgenda] = useState<string>("");
  const [ratId, setRatId] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [docType, setDocType] = useState<string>("agenda");
  const [docData, setDocData] = useState<string>("");
  const [voteQuestion, setVoteQuestion] = useState<string>("");
  const [voteType, setVoteType] = useState<string>("single");
  const [voteOptions, setVoteOptions] = useState<string>("Setuju\nTidak");
  const [openAt, setOpenAt] = useState<string>("");
  const [closeAt, setCloseAt] = useState<string>("");
  const [voteItemId, setVoteItemId] = useState<string>("");
  const [memberId, setMemberId] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<string>("Setuju");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Jadwalkan RAT</CardTitle>
          <CardDescription>Buat jadwal RAT baru</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
            <Input type="number" placeholder="Tahun" value={year} onChange={(e) => setYear(e.target.value)} />
            <Input type="datetime-local" placeholder="Tanggal" value={date} onChange={(e) => setDate(e.target.value)} />
            <Button onClick={async () => {
              try {
                const res = await createRAT({ year: Number(year), date, agenda });
                if (res.success) {
                  toast.success("RAT dibuat");
                  const id = (res.data as any)?.id;
                  if (id) setRatId(String(id));
                }
              } catch (e: any) {
                toast.error(e?.message || "Gagal membuat RAT");
              }
            }}>Simpan</Button>
          </div>
          <Textarea className="mt-2" placeholder="Agenda (opsional)" value={agenda} onChange={(e) => setAgenda(e.target.value)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kirim Notifikasi RAT</CardTitle>
          <CardDescription>Kirim pemberitahuan kepada anggota</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
            <Input placeholder="RAT ID" value={ratId} onChange={(e) => setRatId(e.target.value)} />
            <Input placeholder="Pesan" value={message} onChange={(e) => setMessage(e.target.value)} />
            <Button onClick={async () => {
              if (!ratId) return;
              await notifyRAT(ratId, { message });
              toast.success("Notifikasi dikirim");
            }}>Kirim</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upload Dokumen RAT</CardTitle>
          <CardDescription>Unggah dokumen terkait RAT</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <Input placeholder="RAT ID" value={ratId} onChange={(e) => setRatId(e.target.value)} />
            <Input placeholder="Tipe Dokumen (cth: agenda)" value={docType} onChange={(e) => setDocType(e.target.value)} />
            <Input placeholder="Base64 data" value={docData} onChange={(e) => setDocData(e.target.value)} />
            <Button onClick={async () => {
              if (!ratId || !docData) return;
              await uploadRATDocument(ratId, { type: docType, data: docData });
              toast.success("Dokumen diunggah");
              setDocData("");
            }}>Upload</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Buat Voting</CardTitle>
          <CardDescription>Tambahkan item voting untuk RAT</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
            <Input placeholder="RAT ID" value={ratId} onChange={(e) => setRatId(e.target.value)} />
            <Input placeholder="Pertanyaan" value={voteQuestion} onChange={(e) => setVoteQuestion(e.target.value)} />
            <Input placeholder="Tipe (single/multiple)" value={voteType} onChange={(e) => setVoteType(e.target.value)} />
            <Input type="datetime-local" placeholder="Mulai" value={openAt} onChange={(e) => setOpenAt(e.target.value)} />
            <Input type="datetime-local" placeholder="Selesai" value={closeAt} onChange={(e) => setCloseAt(e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end mt-2">
            <Textarea placeholder="Opsi (satu per baris)" value={voteOptions} onChange={(e) => setVoteOptions(e.target.value)} />
            <div className="md:col-span-1 flex justify-end">
              <Button onClick={async () => {
                if (!ratId || !voteQuestion || !openAt || !closeAt) return;
                const res = await createRATVotingItem(ratId, {
                  question: voteQuestion,
                  type: voteType,
                  options: voteOptions.split("\n").filter(Boolean),
                  open_at: openAt,
                  close_at: closeAt,
                });
                if (res.success) {
                  const id = (res.data as any)?.id;
                  if (id) setVoteItemId(String(id));
                  toast.success("Voting dibuat");
                }
              }}>Simpan Voting</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Ikut Voting</CardTitle>
          <CardDescription>Kirim suara untuk item voting</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
            <Input placeholder="Item ID" value={voteItemId} onChange={(e) => setVoteItemId(e.target.value)} />
            <Input placeholder="Member ID" value={memberId} onChange={(e) => setMemberId(e.target.value)} />
            <Input placeholder="Opsi" value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)} />
            <Button onClick={async () => {
              if (!voteItemId || !memberId || !selectedOption) return;
              await voteRAT(voteItemId, { member_id: Number(memberId), selected_option: selectedOption });
              toast.success("Suara terkirim");
            }}>Kirim Suara</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

