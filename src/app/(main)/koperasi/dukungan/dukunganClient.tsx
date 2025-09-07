/** @format */

'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addTicketReply, createTicket, listTicketReplies } from "@/services/api";

export default function DukunganClient() {
  // TODO: optional websocket for realtime chat updates
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ticketId, setTicketId] = useState<string>("");
  const [chatInput, setChatInput] = useState("");
  const [chats, setChats] = useState<{sender: 'you'|'agent'; text: string}[]>([]);

  async function submitTicket() {
    const res = await createTicket({ title: subject || "Tanpa subjek", category: "other", priority: "low", description: message });
    if (res.success) {
      setSubject("");
      setMessage("");
      const id = (res.data as any)?.id;
      if (id) setTicketId(String(id));
    }
  }

  async function sendChat() {
    if (!chatInput || !ticketId) return;
    await addTicketReply(ticketId, { message: chatInput });
    setChats((s) => [...s, { sender: 'you', text: chatInput }]);
    setChatInput("");
    await loadChat();
  }

  async function loadChat() {
    if (!ticketId) return;
    const res = await listTicketReplies(ticketId, { limit: 50 });
    if (res.success) {
      const items = (res.data ?? []).map((r: any) => ({ sender: (r.sender === 'agent' ? 'agent' : 'you') as 'agent' | 'you', text: String(r.message ?? '') }));
      setChats(items);
    }
  }

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
              <Input placeholder="ID Tiket" value={ticketId} onChange={(e) => setTicketId(e.target.value)} />
              <Button variant="outline" onClick={loadChat} disabled={!ticketId}>Muat Chat</Button>
            </div>
            <div className="h-64 border rounded p-3 overflow-auto mb-3 space-y-2 bg-muted/30">
              {chats.map((c, i) => (
                <div key={i} className={`text-sm ${c.sender === 'you' ? 'text-right' : 'text-left'}`}>
                  <span className={`inline-block px-2 py-1 rounded ${c.sender === 'you' ? 'bg-primary text-primary-foreground' : 'bg-background border'}`}>{c.text}</span>
                </div>
              ))}
              {!chats.length && <div className="text-sm text-muted-foreground italic">Mulai chat dengan agen...</div>}
            </div>
            <div className="flex gap-2">
              <Input placeholder="Ketik pesan..." value={chatInput} onChange={(e) => setChatInput(e.target.value)} />
              <Button onClick={sendChat} disabled={!ticketId}>Kirim</Button>
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
          {!ticketId && (
            <div className="text-sm text-muted-foreground italic">Masukkan ID tiket untuk melihat riwayat.</div>
          )}
          {!!ticketId && !chats.length && (
            <div className="text-sm text-muted-foreground italic">Belum ada riwayat chat</div>
          )}
          {!!ticketId && !!chats.length && (
            <div className="space-y-1 text-sm">
              {chats.map((c, i) => (
                <div key={i}>{c.sender === 'agent' ? 'Agen' : 'Anda'}: {c.text}</div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
