/** @format */

'use client';

import { useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addTicketReply, createTicket, listTicketReplies } from "@/services/api";
import type { TicketReply } from "@/types/api";
import { toast } from "sonner";

type ChatBubble = {
  id: string;
  sender: "you" | "agent";
  text: string;
  createdAt?: string;
};

export default function DukunganClient() {
  // TODO: optional websocket for realtime chat updates
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [replies, setReplies] = useState<TicketReply[]>([]);
  const [loading, setLoading] = useState(false);
  const [sendingReply, setSendingReply] = useState(false);

  async function submitTicket() {
    const payload = {
      title: subject.trim() || "Tanpa subjek",
      category: "other" as const,
      priority: "low" as const,
      description: message.trim(),
    };
    if (!payload.description) {
      toast.error("Deskripsi masalah wajib diisi");
      return;
    }
    try {
      const res = await createTicket(payload);
      if (res.success && res.data) {
        setSubject("");
        setMessage("");
        setReplies([]);
        const id = String(res.data.id);
        setTicketId(id);
        await loadChat({ ticket: id, silent: true });
        toast.success("Tiket berhasil dibuat");
      } else {
        throw new Error(res.message || "Gagal membuat tiket");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal membuat tiket");
    }
  }

  async function sendChat() {
    const id = ticketId.trim();
    const messageBody = chatInput.trim();
    if (!id) {
      toast.error("Masukkan ID tiket terlebih dahulu");
      return;
    }
    if (!messageBody) {
      toast.error("Pesan tidak boleh kosong");
      return;
    }
    try {
      setSendingReply(true);
      const res = await addTicketReply(id, { message: messageBody });
      if (res.success && res.data) {
        setChatInput("");
        setReplies((prev) => sanitizeReplies([...prev, res.data]));
        await loadChat({ silent: true, ticket: id });
        toast.success("Pesan terkirim");
      } else {
        throw new Error(res.message || "Gagal mengirim balasan");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Gagal mengirim balasan");
    } finally {
      setSendingReply(false);
    }
  }

  async function loadChat(options?: { silent?: boolean; ticket?: string }) {
    const id = (options?.ticket ?? ticketId).trim();
    if (!id) return;
    if (!options?.silent) setLoading(true);
    try {
      const res = await listTicketReplies(id, { limit: 50 });
      if (res.success && Array.isArray(res.data)) {
        setReplies(sanitizeReplies(res.data));
      } else if (!options?.silent) {
        throw new Error(res.message || "Gagal memuat percakapan");
      }
    } catch (error) {
      if (!options?.silent) {
        toast.error(error instanceof Error ? error.message : "Gagal memuat percakapan");
      }
    } finally {
      if (!options?.silent) setLoading(false);
    }
  }

  const chatBubbles = useMemo<ChatBubble[]>(() => {
    return replies.map((reply) => ({
      id: reply.id,
      sender: deriveSender(reply),
      text: reply.message ?? "",
      createdAt: reply.created_at,
    }));
  }, [replies]);

  const hasTicket = Boolean(ticketId.trim());

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Dukungan</h2>
          <p className="text-muted-foreground">Buat tiket dan live chat</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Form Tiket</CardTitle>
            <CardDescription>Laporkan kendala atau pertanyaan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Input placeholder="Subjek" value={subject} onChange={(e) => setSubject(e.target.value)} />
              <Textarea placeholder="Deskripsi masalah" value={message} onChange={(e) => setMessage(e.target.value)} />
              <Button onClick={submitTicket}>Kirim Tiket</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Live Chat</CardTitle>
            <CardDescription>Terhubung dengan agen dukungan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 mb-2">
              <Input
                placeholder="ID Tiket"
                value={ticketId}
                onChange={(e) => setTicketId(e.target.value)}
              />
              <Button
                variant="outline"
                onClick={() => loadChat()}
                disabled={!ticketId.trim() || loading}
              >
                {loading ? "Memuat..." : "Muat Chat"}
              </Button>
            </div>
            <div className="h-64 border rounded p-3 overflow-auto mb-3 space-y-2 bg-muted/30">
              {chatBubbles.map((bubble) => (
                <div key={bubble.id} className={`text-sm ${bubble.sender === 'you' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block px-2 py-1 rounded ${bubble.sender === 'you' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>{bubble.text}</span>
                  {bubble.createdAt && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {formatDateTime(bubble.createdAt)}
                    </div>
                  )}
                </div>
              ))}
              {!chatBubbles.length && <div className="text-sm text-muted-foreground italic">Mulai chat dengan agen...</div>}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Ketik pesan..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
              <Button onClick={sendChat} disabled={!ticketId.trim() || sendingReply}>
                {sendingReply ? "Mengirim..." : "Kirim"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Chat</CardTitle>
          <CardDescription>Daftar percakapan sebelumnya</CardDescription>
        </CardHeader>
        <CardContent>
          {!hasTicket && (
            <div className="text-sm text-muted-foreground italic">Masukkan ID tiket untuk melihat riwayat.</div>
          )}
          {hasTicket && !chatBubbles.length && (
            <div className="text-sm text-muted-foreground italic">Belum ada riwayat chat</div>
          )}
          {hasTicket && !!chatBubbles.length && (
            <div className="space-y-1 text-sm">
              {chatBubbles.map((bubble) => (
                <div key={bubble.id}>
                  {bubble.sender === 'agent' ? 'Agen' : 'Anda'}: {bubble.text}
                  {bubble.createdAt ? ` • ${formatDateTime(bubble.createdAt)}` : ""}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function deriveSender(reply: TicketReply): "you" | "agent" {
  if (typeof reply.business_unit_id === "number" && !Number.isNaN(reply.business_unit_id)) {
    return "agent";
  }
  return "you";
}

function sanitizeReplies(
  entries: Array<TicketReply | null | undefined>
): TicketReply[] {
  const map = new Map<string, TicketReply>();
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    if (!entry.id || typeof entry.id !== "string") continue;
    const safeMessage = typeof entry.message === "string" ? entry.message : "";
    map.set(entry.id, {
      ...entry,
      message: safeMessage,
    });
  }
  return Array.from(map.values());
}

function formatDateTime(value?: string) {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsed);
}
