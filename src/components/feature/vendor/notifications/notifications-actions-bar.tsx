/** @format */

"use client";

import { useSession } from "next-auth/react";
import { NotificationBroadcastDialog } from "./notification-broadcast-dialog";
import { NotificationBulkDialog } from "./notification-bulk-dialog";
import { NotificationRemindersSheet } from "./reminders-sheet";

export function NotificationsActionsBar() {
  const { data: session } = useSession();
  const isSuperAdmin = ((session?.user as any)?.role?.name ?? "") === "Super Admin";
  if (!isSuperAdmin) return null;
  return (
    <div className="flex items-center gap-2 justify-end">
      <NotificationBroadcastDialog />
      <NotificationBulkDialog />
      <NotificationRemindersSheet />
    </div>
  );
}
