/** @format */

"use client";

import { Bell, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AnalyticsNotification } from "@/types/api";
import { useNotificationActions } from "@/hooks/queries/notifications";
import { EmptyState, ErrorState, LoadingState } from "./states";
import { trackAnalyticsEvent } from "../lib/telemetry";
import { ShoppingBag, CreditCard, Package, Truck } from "lucide-react";

type Props = {
  notifications?: AnalyticsNotification[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
};

function SeverityDot({ severity }: { severity: AnalyticsNotification["severity"] }) {
  const color =
    severity === "error"
      ? "bg-red-500"
      : severity === "warn"
        ? "bg-amber-500"
        : "bg-blue-500";
  return <span className={`mt-1 inline-block h-2 w-2 rounded-full ${color}`} />;
}

export function NotificationsPanel({ notifications, isLoading, isError, onRetry }: Props) {
  const { markRead, markAll } = useNotificationActions();

  if (isLoading) return <LoadingState lines={4} />;
  if (isError) return <ErrorState onRetry={onRetry} />;
  if (!notifications?.length) return <EmptyState onRetry={onRetry} />;

  return (
    <div className="space-y-3 rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4" />
          <div>
            <h3 className="text-sm font-semibold">Notifikasi</h3>
            <p className="text-xs text-muted-foreground">Tindak lanjuti item penting.</p>
          </div>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            trackAnalyticsEvent("notification_mark_all");
            markAll.mutate();
          }}
        >
          Tandai semua
        </Button>
      </div>
      <div className="space-y-3">
        {notifications.map((notif) => {
          const icon =
            notif.type === "order" ? (
              <ShoppingBag className="h-4 w-4" />
            ) : notif.type === "payment" ? (
              <CreditCard className="h-4 w-4" />
            ) : notif.type === "shipment" ? (
              <Truck className="h-4 w-4" />
            ) : (
              <Package className="h-4 w-4" />
            );
          return (
            <div
              key={notif.id}
              className="flex items-start justify-between rounded-md border border-border/60 bg-muted/40 p-3"
            >
              <div className="flex items-start gap-3">
                <SeverityDot severity={notif.severity} />
                <div>
                  <p className="flex items-center gap-2 text-sm font-medium">
                    {icon}
                    {notif.message}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(notif.timestamp).toLocaleString("id-ID")}
                  </p>
                  {notif.action_path ? (
                    <Badge variant="secondary" className="mt-1">
                      {notif.action_path}
                    </Badge>
                  ) : null}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Tandai selesai"
                onClick={() => {
                  trackAnalyticsEvent("notification_mark_read", { id: notif.id, type: notif.type });
                  markRead.mutate(notif.id);
                }}
              >
                <CheckCircle2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
