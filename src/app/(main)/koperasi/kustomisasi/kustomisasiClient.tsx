/** @format */

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUISettings, updateUISettings } from "@/services/api";
import type { ApiResponse } from "@/types/api";
import { toast } from "sonner";

const DEFAULT_PRIMARY = "#2563eb";
const DEFAULT_ACCENT = "#16a34a";
const DEFAULT_LAYOUT = "default";

type BrandingForm = {
  primary_color: string;
  accent_color: string;
  layout: string;
};

const LAYOUT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "modern", label: "Modern" },
  { value: "minimal", label: "Minimal" },
];

export default function KustomisasiClient() {
  const [{ primary_color, accent_color, layout }, setForm] = useState<BrandingForm>({
    primary_color: DEFAULT_PRIMARY,
    accent_color: DEFAULT_ACCENT,
    layout: DEFAULT_LAYOUT,
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const resetToDefault = useCallback(() => {
    setForm({
      primary_color: DEFAULT_PRIMARY,
      accent_color: DEFAULT_ACCENT,
      layout: DEFAULT_LAYOUT,
    });
  }, []);

  useEffect(() => {
    let ignore = false;
    (async () => {
      setLoading(true);
      try {
        const res: ApiResponse<any> | null = await getUISettings().catch(
          () => null
        );
        if (!res || !res.success || !res.data || ignore) {
          if (!res?.success && res?.message) {
            toast.error(res.message);
          }
          return;
        }
        const branding = res.data;
        setForm((prev) => ({
          primary_color:
            sanitizeColor(branding.primary_color) || prev.primary_color,
          accent_color:
            sanitizeColor(branding.accent_color) || prev.accent_color,
          layout: sanitizeLayout(branding.layout) || prev.layout,
        }));
      } catch (error) {
        if (!ignore) {
          toast.error(
            error instanceof Error ? error.message : "Gagal memuat pengaturan UI"
          );
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const dirty = useMemo(() => {
    return (
      primary_color !== DEFAULT_PRIMARY ||
      accent_color !== DEFAULT_ACCENT ||
      layout !== DEFAULT_LAYOUT
    );
  }, [primary_color, accent_color, layout]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const payload = {
        primary_color: sanitizeColor(primary_color) || DEFAULT_PRIMARY,
        accent_color: sanitizeColor(accent_color) || DEFAULT_ACCENT,
        layout: sanitizeLayout(layout) || DEFAULT_LAYOUT,
      };
      const res: ApiResponse<any> = await updateUISettings(payload);
      if (!res.success) {
        throw new Error(res.message || "Gagal menyimpan pengaturan UI");
      }
      toast.success("Pengaturan UI tersimpan");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Gagal menyimpan pengaturan UI"
      );
    } finally {
      setSaving(false);
    }
  }, [accent_color, layout, primary_color]);

  const setPrimary = useCallback(
    (value: string) => {
      setForm((prev) => ({ ...prev, primary_color: value }));
    },
    []
  );

  const setAccent = useCallback(
    (value: string) => {
      setForm((prev) => ({ ...prev, accent_color: value }));
    },
    []
  );

  const setLayoutValue = useCallback(
    (value: string) => {
      setForm((prev) => ({ ...prev, layout: value }));
    },
    []
  );

  const disableActions = loading || saving;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Kustomisasi</h2>
        <p className="text-muted-foreground">
          Tema warna dan layout landing page
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tema Warna</CardTitle>
            <CardDescription>Atur warna utama dan aksen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Primary</div>
                <Input
                  type="color"
                  value={primary_color}
                  onChange={(event) => setPrimary(event.target.value)}
                  disabled={disableActions}
                />
              </div>
              <div>
                <div className="mb-1 text-xs text-muted-foreground">Accent</div>
                <Input
                  type="color"
                  value={accent_color}
                  onChange={(event) => setAccent(event.target.value)}
                  disabled={disableActions}
                />
              </div>
              <div className="flex gap-2 md:col-span-2">
                <Button onClick={handleSave} disabled={disableActions}>
                  {saving ? "Menyimpan..." : "Simpan"}
                </Button>
                <Button
                  variant="outline"
                  onClick={resetToDefault}
                  disabled={disableActions || !dirty}
                >
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Layout Landing Page</CardTitle>
            <CardDescription>Pilih varian layout</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Select value={layout} onValueChange={setLayoutValue}>
                <SelectTrigger disabled={disableActions}>
                  <SelectValue placeholder="Pilih layout" />
                </SelectTrigger>
                <SelectContent>
                  {LAYOUT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">
                Pratinjau otomatis tidak tersedia pada mode ini.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function sanitizeColor(value?: string | null): string {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim();
  return /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(trimmed) ? trimmed : "";
}

function sanitizeLayout(value?: string | null): string {
  if (!value || typeof value !== "string") return "";
  const trimmed = value.trim().toLowerCase();
  return LAYOUT_OPTIONS.some((option) => option.value === trimmed)
    ? trimmed
    : "";
}
