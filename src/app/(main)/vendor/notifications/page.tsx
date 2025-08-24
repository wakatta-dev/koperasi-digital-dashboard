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

type NotificationItem = NonNullable<
  Awaited<ReturnType<typeof listNotificationsAction>>
>[number] & {
  read: boolean;
  time: string;
  type?: string;
};

export default async function NotificationsPage() {
  const tenant = await getTenantId();
  const res = await listNotificationsAction({
    limit: 10,
    tenant_id: tenant ?? "",
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
        {notifications.map((notification) => (
          <Card
            key={notification.id}
            className={`${!notification.read ? "border-primary/50" : ""}`}
          >
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  {notification.type === "success" && (
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    </div>
                  )}
                  {notification.type === "warning" && (
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    </div>
                  )}
                  {notification.type === "info" && (
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Info className="h-5 w-5 text-blue-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium">{notification.title}</h3>
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
                  <p className="text-sm text-muted-foreground mt-1">
                    {notification.message}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
