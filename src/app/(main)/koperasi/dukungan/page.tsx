/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function DukunganPage() {
  // TODO integrate API: ticket submit, chat websocket, chat history
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [chatInput, setChatInput] = useState("");
  const [chats, setChats] = useState<{sender: 'you'|'agent'; text: string}[]>([]);

  function submitTicket() {
    // TODO submit ticket
    setSubject("");
    setMessage("");
  }

  function sendChat() {
    if (!chatInput) return;
    setChats((s) => [...s, { sender: 'you', text: chatInput }]);
    setChatInput("");
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
              <Button onClick={sendChat}>Kirim</Button>
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
          {/* TODO integrate API: list chats */}
          <div className="text-sm text-muted-foreground italic">Belum ada riwayat chat</div>
        </CardContent>
      </Card>
    </div>
  );
}

