/** @format */

"use client";

import { useState } from "react";
import type { Ticket, TicketReply } from "@/types/api";
import {
  useTicket,
  useTicketActions,
  useTicketActivities,
} from "@/hooks/queries/ticketing";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const [status, setStatus] = useState<Ticket["status"] | undefined>(
    ticket?.status
  );
  const [agentId, setAgentId] = useState<string>("");

  const { data: activities = [] } = useTicketActivities(id, { limit: 100 });

  if (!ticket) return null;

  const statusVariant = {
    open: "destructive",
    in_progress: "default",
    pending: "secondary",
    closed: "outline",
  }[ticket.status];

  return (
    <div className="space-y-6">
      {/* Ticket Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold">{ticket.title}</h2>
            <Badge
              variant={
                statusVariant as
                  | "destructive"
                  | "default"
                  | "secondary"
                  | "outline"
              }
            >
              {ticket.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {ticket.description}
          </p>
          {ticket.attachment_url && (
            <p className="text-xs mt-2">
              Lampiran:{" "}
              <a
                className="text-blue-600 underline"
                href={ticket.attachment_url}
                target="_blank"
              >
                {ticket.attachment_url}
              </a>
            </p>
          )}
        </CardContent>
      </Card>

      {/* Ticket Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-4">
          <div className="w-40">
            <Label>Status</Label>
            <Select
              value={status ?? ticket.status}
              onValueChange={(value) => setStatus(value as Ticket["status"])}
            >
              <SelectTrigger size="sm">
                <SelectValue placeholder="Pilih status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Label>Agent ID</Label>
            <Input
              placeholder="Opsional"
              value={agentId}
              onChange={(e) => setAgentId(e.target.value)}
            />
          </div>

          <Button
            type="button"
            variant="default"
            onClick={async () => {
              const ok = await confirm({
                variant: "edit",
                title: "Update tiket?",
                description: `Status akan diubah menjadi ${
                  status ?? ticket.status
                }${agentId ? ", agent: " + agentId : ""}.`,
                confirmText: "Simpan",
              });
              if (!ok) return;
              await update.mutateAsync({
                id,
                payload: {
                  status: status ?? ticket.status,
                  agent_id: agentId ? Number(agentId) : undefined,
                },
              });
            }}
          >
            Simpan
          </Button>
        </CardContent>
      </Card>

      {/* Replies */}
      <Card>
        <CardHeader>
          <CardTitle>Replies</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 pr-4">
            <div className="space-y-3">
              {(ticket.replies ?? []).map((r: TicketReply) => (
                <div
                  key={r.id}
                  className="rounded-lg border bg-muted/40 p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">User #{r.user_id}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap">{r.message}</p>
                  {r.attachment_url && (
                    <p className="text-xs mt-2">
                      Lampiran:{" "}
                      <a
                        className="text-blue-600 underline"
                        href={r.attachment_url}
                        target="_blank"
                      >
                        {r.attachment_url}
                      </a>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Reply Form */}
          <form
            className="mt-4 space-y-2"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!message.trim()) return;
              const ok = await confirm({
                variant: "create",
                title: "Kirim balasan tiket?",
                description: `Pesan akan dikirim pada tiket ${ticket.title}.`,
                confirmText: "Kirim",
              });
              if (!ok) return;
              await addReply.mutateAsync({
                id,
                payload: { message, attachment_url: attachment || undefined },
              });
              setMessage("");
              setAttachment("");
            }}
          >
            <Textarea
              rows={3}
              placeholder="Tulis balasan..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex items-center gap-2">
              <Input
                placeholder="Attachment URL (opsional)"
                value={attachment}
                onChange={(e) => setAttachment(e.target.value)}
              />
              <Button type="submit">Kirim</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Activities</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {activities.length ? (
            activities.map((a: any) => (
              <div
                key={a.id}
                className="flex items-center gap-3 rounded border p-2 text-sm"
              >
                <Badge variant="secondary">#{a.id}</Badge>
                <div className="flex-1">{a.action}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(a.created_at).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-muted-foreground italic">
              Tidak ada aktivitas
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
