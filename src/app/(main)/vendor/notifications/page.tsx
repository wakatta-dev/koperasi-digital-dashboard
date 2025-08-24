/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Info } from "lucide-react";
import {
  listNotificationsAction,
  updateNotificationStatusAction,
} from "@/actions/notifications";
import { revalidatePath } from "next/cache";
import { getTenantId } from "@/services/api";
import { cn } from "@/lib/utils";

type NotificationItem = NonNullable<
  Awaited<ReturnType<typeof listNotificationsAction>>
>[number] & {
  read: boolean;
  time: string;
  type?: string;
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

export default async function NotificationsPage() {
  const tenant = await getTenantId();
  const res = await listNotificationsAction({
    limit: 10,
    tenant_id: tenant ?? "1",
  });

  const notifications: NotificationItem[] = (res ?? []).map((n: any) => ({
    ...n,
    read: n.status === "read",
    time: new Date(n.created_at).toLocaleString(),
    type: n.type ?? "info",
  }));

  async function markAllAsRead() {
    "use server";
    const unread = notifications.filter((n) => !n.read);
    await Promise.all(
      unread.map((n) =>
        updateNotificationStatusAction(n.id, { status: "read" })
      )
    );
    revalidatePath("/vendor/notifications");
  }

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
        <form action={markAllAsRead}>
          <Button type="submit" variant="outline">
            Mark All as Read
          </Button>
        </form>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.map((notification) => {
          const { bg, icon } =
            iconMap[notification.type as "success"] || iconMap.info;
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
