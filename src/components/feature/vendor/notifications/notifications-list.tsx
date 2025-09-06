/** @format */

"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import {
  useNotifications,
  useNotificationActions,
} from "@/hooks/queries/notifications";
import type { Notification } from "@/types/api";
import { cn } from "@/lib/utils";
import { NotificationCreateDialog } from "@/components/feature/vendor/notifications/notification-create-dialog";
import { useConfirm } from "@/hooks/use-confirm";

type NotificationView = Notification & {
  read: boolean;
  time: string;
  type?: string;
};

type Props = {
  initialData?: Notification[];
  limit?: number;
};

const iconMap = {
  success: {
    bg: "bg-green-100",
    icon: <CheckCircle className="h-5 w-5 text-green-600" />,
  },
  warning: {
    bg: "bg-yellow-100",
    icon: <AlertCircle className="h-5 w-5 text-yellow-600" />,
  },
  info: {
    bg: "bg-blue-100",
    icon: <Info className="h-5 w-5 text-blue-600" />,
  },
};

export function VendorNotificationsList({ initialData, limit = 10 }: Props) {
  const params = useMemo(() => ({ limit }), [limit]);
  const { data: notifs = [] } = useNotifications(params, initialData, { refetchInterval: 300000 });
  const { updateStatus } = useNotificationActions();
  const confirm = useConfirm();

  const notifications: NotificationView[] = (notifs ?? []).map((n: any) => ({
    ...n,
    // support both uppercase (docs) and lowercase statuses
    read: n.status === "READ" || n.status === "read",
    time: new Date(n.created_at).toLocaleString(),
    type: n.type ?? "info",
    // normalize message for UI display
    message: n.message ?? n.body ?? "",
  }));

  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (!unread.length) return;
    const ok = await confirm({
      variant: "edit",
      title: "Tandai semua terbaca?",
      description: `${unread.length} notifikasi akan ditandai sebagai terbaca.`,
      confirmText: "Tandai",
    });
    if (!ok) return;
    await Promise.all(
      unread.map((n) => updateStatus.mutateAsync({ id: n.id, status: "READ" }))
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Notifications</h2>
          <p className="text-muted-foreground">
            Stay updated with your business activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" onClick={markAllAsRead}>
            Mark All as Read
          </Button>
          <NotificationCreateDialog />
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => {
          const { bg, icon } =
            (iconMap as any)[notification.type as "success"] || iconMap.info;
          return (
            <Card
              key={notification.id}
              className={cn(
                "transition-shadow hover:shadow-md",
                !notification.read && "border-primary/50"
              )}
            >
              <CardContent className="py-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        bg
                      )}
                    >
                      {icon}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-semibold">
                        {notification.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {!notification.read && (
                          <Badge variant="default" className="text-xs">
                            New
                          </Badge>
                        )}
                        <span className="text-sm text-muted-foreground">
                          {notification.time}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground leading-snug">
                      {notification.message}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
