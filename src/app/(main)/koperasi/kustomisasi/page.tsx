/** @format */

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function KustomisasiPage() {
  // TODO integrate API: save theme + layout settings
  const [primary, setPrimary] = useState<string>("#2563eb");
  const [accent, setAccent] = useState<string>("#16a34a");
  const [layout, setLayout] = useState<string>("default");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Kustomisasi</h2>
        <p className="text-muted-foreground">Tema warna dan layout landing page</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Tema Warna</CardTitle>
            <CardDescription>Atur warna utama dan aksen</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-muted-foreground mb-1">Primary</div>
                <Input type="color" value={primary} onChange={(e) => setPrimary(e.target.value)} />
              </div>
              <div>
                <div className="text-xs text-muted-foreground mb-1">Accent</div>
                <Input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} />
              </div>
              <div className="md:col-span-2 flex gap-2">
                <Button>Simpan</Button>
                <Button variant="outline">Reset</Button>
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
              <Select value={layout} onValueChange={setLayout}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                </SelectContent>
              </Select>
              <div className="text-sm text-muted-foreground">Pratinjau otomatis tidak tersedia pada mode ini.</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

