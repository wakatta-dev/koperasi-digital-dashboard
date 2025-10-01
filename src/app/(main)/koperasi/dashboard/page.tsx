/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Calendar, ArrowRight, AlertCircle } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { getKoperasiDashboard } from "@/services/api";
import { SummaryCards } from "@/components/feature/koperasi/dashboard/summary-cards";
import { TrendPanel } from "@/components/feature/koperasi/dashboard/trend-panel";
import type {
  KoperasiDashboardSummary,
  DashboardNotification,
  ShortcutItem,
} from "@/types/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const dynamic = "force-dynamic";

export default async function KoperasiDashboard() {
  const dashboardRes = await getKoperasiDashboard().catch(() => null);

  const summary =
    dashboardRes && dashboardRes.success
      ? (dashboardRes.data as KoperasiDashboardSummary | null)
      : null;

  const graphPoints = summary?.graph_data ?? [];
  const installmentNotifications = summary?.installment_notifications ?? [];
  const applicationNotifications = summary?.application_notifications ?? [];

  const fallbackShortcuts: QuickActionItem[] = [
    {
      id: "membership",
      label: "Tambah Anggota",
      path: "/koperasi/keanggotaan",
      description: "Daftarkan anggota baru",
      icon: "UserPlus",
    },
    {
      id: "savings",
      label: "Setoran Simpanan",
      path: "/koperasi/simpanan",
      description: "Catat setoran anggota",
      icon: "PiggyBank",
    },
    {
      id: "loans",
      label: "Proses Pinjaman",
      path: "/koperasi/pinjaman",
      description: "Kelola pengajuan pinjaman",
      icon: "CreditCard",
    },
    {
      id: "reports",
      label: "Laporan",
      path: "/koperasi/laporan",
      description: "Lihat laporan keuangan",
      icon: "FileText",
    },
  ];

  const shortcuts: QuickActionItem[] = summary?.shortcuts?.length
    ? summary.shortcuts.map((shortcut) => ({ ...shortcut }))
    : fallbackShortcuts;

  return (
    <div className="space-y-6">
      {!summary && (
        <Alert className="border-yellow-200 bg-yellow-50 text-yellow-900">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Ringkasan tidak tersedia</AlertTitle>
          <AlertDescription>
            Data dashboard koperasi belum tersedia atau backend mengirimkan
            nilai `null`.
          </AlertDescription>
        </Alert>
      )}

      {/* Ringkasan */}
      <SummaryCards initial={summary ?? null} />

      <div className="grid gap-6 lg:grid-cols-2">
        <TrendPanel data={graphPoints} />

        <NotificationsCard
          title="Notifikasi Angsuran"
          description="Pengingat angsuran pinjaman anggota"
          items={installmentNotifications}
          emptyMessage="Belum ada pengingat angsuran"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <QuickActions shortcuts={shortcuts} />

        <NotificationsCard
          title="Notifikasi Pengajuan"
          description="Status pengajuan keanggotaan dan pinjaman"
          items={applicationNotifications}
          emptyMessage="Belum ada notifikasi pengajuan"
        />
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Agenda</CardTitle>
          <CardDescription>Kegiatan dan rapat yang akan datang</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div>
                <p className="font-medium">Rapat Anggota Tahunan (RAT)</p>
                <p className="text-sm text-muted-foreground">
                  15 Februari • 09:00 WIB
                </p>
              </div>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

type QuickActionItem = ShortcutItem & {
  description?: string;
};

function formatDateTime(value: string | Date | number | undefined) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function QuickActions({ shortcuts }: { shortcuts: QuickActionItem[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>Fitur yang sering digunakan</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          {shortcuts.map(({ id, label, path, description, icon }) => {
            const Icon = resolveShortcutIcon(icon);
            const href = path || "#";
            return (
              <Link
                key={id ?? path}
                href={href}
                aria-label={label}
                className="group flex items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-accent"
              >
                <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-md bg-primary/10 text-primary">
                  {Icon ? (
                    <Icon className="h-5 w-5" />
                  ) : (
                    <ArrowRight className="h-5 w-5" />
                  )}
                </span>
                <span>
                  <p className="font-medium leading-6">{label}</p>
                  {description ? (
                    <p className="text-sm text-muted-foreground">
                      {description}
                    </p>
                  ) : null}
                </span>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

const iconLibrary = LucideIcons as unknown as Record<string, LucideIcon>;

function resolveShortcutIcon(name?: string): LucideIcon | null {
  if (!name) return null;
  const candidates = [name, pascalCase(name), pascalCase(name.toLowerCase())];
  for (const candidate of candidates) {
    if (iconLibrary[candidate]) {
      return iconLibrary[candidate];
    }
    const capitalized = candidate.charAt(0).toUpperCase() + candidate.slice(1);
    if (iconLibrary[capitalized]) {
      return iconLibrary[capitalized];
    }
  }
  return null;
}

function pascalCase(value: string) {
  return value
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function NotificationsCard({
  title,
  description,
  items,
  emptyMessage,
}: {
  title: string;
  description: string;
  items: DashboardNotification[];
  emptyMessage: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/koperasi/notifikasi">Lihat semua</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.slice(0, 6).map((item) => (
            <div
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-lg border p-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium">
                  {item.title ?? "Notifikasi"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(item.created_at)}
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0 text-xs uppercase">
                {item.type ?? "INFO"}
              </Badge>
            </div>
          ))}
          {!items.length && (
            <div className="rounded-lg border p-6 text-center text-sm text-muted-foreground">
              {emptyMessage}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
