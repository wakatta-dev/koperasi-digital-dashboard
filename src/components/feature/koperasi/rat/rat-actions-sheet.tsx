/** @format */

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
} from "@/components/ui/sheet";
import { RATActions } from "@/components/feature/koperasi/rat/rat-actions";
import { RATVotingResult } from "@/components/feature/koperasi/rat/rat-voting-result";
import {
  Plus,
  Calendar,
  Bell,
  FileUp,
  ListChecks,
  UserCheck,
  BarChart2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SectionKey =
  | "jadwalkan-rat"
  | "kirim-notifikasi"
  | "upload-dokumen-rat"
  | "buat-voting"
  | "ikut-voting"
  | "hasil-voting";

function parseHash(): { open: boolean; section?: SectionKey } {
  if (typeof window === "undefined") return { open: false };
  const hash = window.location.hash || "";
  if (!hash.startsWith("#rat-actions")) return { open: false };
  const parts = hash.replace(/^#/, "").split("/");
  // parts: ["rat-actions", "section?"]
  const key = (parts[1] || "") as SectionKey;
  return { open: true, section: key || undefined };
}

export function RATActionsSheet() {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState<SectionKey>("jadwalkan-rat");

  React.useEffect(() => {
    const { open: shouldOpen, section } = parseHash();
    if (shouldOpen) {
      setOpen(true);
      if (section) setTab(section);
    }
    function onHashChange() {
      const { open: nextOpen, section: nextSection } = parseHash();
      if (nextOpen) {
        setOpen(true);
        if (nextSection) setTab(nextSection);
      }
    }
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const openAndGo = (section: SectionKey) => () => {
    setOpen(true);
    setTab(section);
    // update hash for deep link consistency (optional)
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.hash = `#rat-actions/${section}`;
      window.history.replaceState(null, "", url.toString());
    }
  };

  return (
    <Sheet open={open} onOpenChange={(v) => setOpen(v)}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Jadwalkan RAT
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>Kelola RAT</SheetTitle>
          <SheetDescription>
            Pusat aksi RAT: jadwal, notifikasi, dokumen, dan voting
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4">
          <Tabs
            value={tab}
            onValueChange={(v) => {
              const next = v as SectionKey;
              setTab(next);
              // keep hash in sync
              if (typeof window !== "undefined") {
                const url = new URL(window.location.href);
                url.hash = `#rat-actions/${next}`;
                window.history.replaceState(null, "", url.toString());
              }
            }}
          >
            <TabsList className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2 bg-transparent p-0 mb-4">
              <TabsTrigger
                className="border rounded-md py-2 data-[state=active]:bg-background"
                value="jadwalkan-rat"
                onClick={openAndGo("jadwalkan-rat")}
              >
                <Calendar className="h-4 w-4 mr-2" /> Jadwalkan RAT
              </TabsTrigger>
              <TabsTrigger
                className="border rounded-md py-2 data-[state=active]:bg-background"
                value="kirim-notifikasi"
                onClick={openAndGo("kirim-notifikasi")}
              >
                <Bell className="h-4 w-4 mr-2" /> Kirim Notifikasi
              </TabsTrigger>
              <TabsTrigger
                className="border rounded-md py-2 data-[state=active]:bg-background"
                value="upload-dokumen-rat"
                onClick={openAndGo("upload-dokumen-rat")}
              >
                <FileUp className="h-4 w-4 mr-2" /> Upload Dokumen
              </TabsTrigger>
              <TabsTrigger
                className="border rounded-md py-2 data-[state=active]:bg-background"
                value="buat-voting"
                onClick={openAndGo("buat-voting")}
              >
                <ListChecks className="h-4 w-4 mr-2" /> Buat Voting
              </TabsTrigger>
              <TabsTrigger
                className="border rounded-md py-2 data-[state=active]:bg-background"
                value="ikut-voting"
                onClick={openAndGo("ikut-voting")}
              >
                <UserCheck className="h-4 w-4 mr-2" /> Ikut Voting
              </TabsTrigger>
              <TabsTrigger
                className="border rounded-md py-2 data-[state=active]:bg-background"
                value="hasil-voting"
                onClick={openAndGo("hasil-voting")}
              >
                <BarChart2 className="h-4 w-4 mr-2" /> Hasil Voting
              </TabsTrigger>
            </TabsList>

            <div className="pt-3 translate-y-4">
              <TabsContent value="jadwalkan-rat">
                <RATActions only="jadwalkan-rat" />
              </TabsContent>
              <TabsContent value="kirim-notifikasi">
                <RATActions only="kirim-notifikasi" />
              </TabsContent>
              <TabsContent value="upload-dokumen-rat">
                <RATActions only="upload-dokumen-rat" />
              </TabsContent>
              <TabsContent value="buat-voting">
                <RATActions only="buat-voting" />
              </TabsContent>
              <TabsContent value="ikut-voting">
                <RATActions only="ikut-voting" />
              </TabsContent>
              <TabsContent value="hasil-voting">
                <RATVotingResult />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default RATActionsSheet;
