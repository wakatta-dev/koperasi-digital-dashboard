/** @format */

"use client";

import { useState } from "react";
import type { Ticket, TicketReply } from "@/types/api";
import { useTicket, useTicketActions, useTicketActivities } from "@/hooks/queries/ticketing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConfirm } from "@/hooks/use-confirm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = { id: string; initialTicket?: Ticket };

export function VendorTicketDetail({ id, initialTicket }: Props) {
  const { data: ticket } = useTicket(id, initialTicket);
  const { addReply, update } = useTicketActions();
  const confirm = useConfirm();

  const [message, setMessage] = useState("");
  const [attachment, setAttachment] = useState("");
  const [status, setStatus] = useState<Ticket["status"] | undefined>(ticket?.status);
  const [agentId, setAgentId] = useState<string>("");

  // Hooks must be called unconditionally; fetch activities regardless of ticket presence
  const { data: activities = [] } = useTicketActivities(id, { limit: 100 });

  if (!ticket) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-2xl font-bold">{ticket.title}</h2>
          <Badge variant={ticket.status === "open" ? "destructive" : ticket.status === "in_progress" ? "default" : "secondary"}>
            {ticket.status}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={status ?? ticket.status}
            onValueChange={(value) => setStatus(value as Ticket["status"])}
          >
            <SelectTrigger size="sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="open">open</SelectItem>
              <SelectItem value="in_progress">in_progress</SelectItem>
              <SelectItem value="pending">pending</SelectItem>
              <SelectItem value="closed">closed</SelectItem>
            </SelectContent>
          </Select>
          <Input
            placeholder="Agent ID (opsional)"
            value={agentId}
            onChange={(e) => setAgentId(e.target.value)}
            className="w-40"
          />
          <Button
            type="button"
            variant="outline"
            onClick={async () => {
              const ok = await confirm({
                variant: "edit",
                title: "Update tiket?",
                description: `Status akan diubah menjadi ${status ?? ticket.status}${agentId ? ", agent: " + agentId : ""}.`,
                confirmText: "Simpan",
              });
              if (!ok) return;
              await update.mutateAsync({ id, payload: { status: status ?? ticket.status, agent_id: agentId ? Number(agentId) : undefined } });
            }}
          >
            Simpan
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Deskripsi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{ticket.description}</p>
          {ticket.attachment_url && (
            <p className="text-xs mt-2">Lampiran: <a className="text-blue-600 underline" href={ticket.attachment_url} target="_blank">{ticket.attachment_url}</a></p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Replies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(ticket.replies ?? []).map((r: TicketReply) => (
            <div key={r.id} className="border rounded p-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="font-medium">User #{r.user_id}</span>
                <span className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap">{r.message}</p>
              {r.attachment_url && (
                <p className="text-xs mt-2">Lampiran: <a className="text-blue-600 underline" href={r.attachment_url} target="_blank">{r.attachment_url}</a></p>
              )}
            </div>
          ))}

          <form
            className="space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!message.trim()) return;
              await addReply.mutateAsync({ id, payload: { message, attachment_url: attachment || undefined } });
              setMessage("");
              setAttachment("");
            }}
          >
            <Textarea rows={3} placeholder="Tulis balasan..." value={message} onChange={(e) => setMessage(e.target.value)} />
            <div className="flex items-center gap-2">
              <Input placeholder="Attachment URL (opsional)" value={attachment} onChange={(e) => setAttachment(e.target.value)} />
              <Button type="submit">Kirim</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {activities.map((a: any) => (
            <div key={a.id} className="flex items-center justify-between border rounded p-2 text-sm">
              <div>#{a.id}</div>
              <div>{a.action}</div>
              <div className="text-muted-foreground">{a.created_at}</div>
            </div>
          ))}
          {!activities.length && (
            <div className="text-xs text-muted-foreground italic">Tidak ada aktivitas</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
