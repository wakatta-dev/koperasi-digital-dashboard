/** @format */

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Plus, MapPin, Clock, UserCheck } from "lucide-react";

const ratHistory = [
  {
    id: "RAT2024",
    title: "Rapat Anggota Tahunan 2024",
    date: "2024-02-15",
    time: "09:00 - 12:00 WIB",
    location: "Aula Koperasi",
    attendees: 1189,
    totalMembers: 1247,
    status: "terjadwal",
    agenda: [
      "Laporan Keuangan 2023",
      "Pembagian SHU",
      "Pemilihan Pengurus",
      "Program Kerja 2024",
    ],
  },
  {
    id: "RAT2023",
    title: "Rapat Anggota Tahunan 2023",
    date: "2023-02-20",
    time: "09:00 - 12:00 WIB",
    location: "Aula Koperasi",
    attendees: 1156,
    totalMembers: 1224,
    status: "selesai",
    agenda: ["Laporan Keuangan 2022", "Pembagian SHU", "Evaluasi Program"],
  },
];

export default function RATPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rapat Anggota Tahunan (RAT)</h2>
          <p className="text-muted-foreground">
            Kelola dan pantau pelaksanaan RAT
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Jadwalkan RAT
        </Button>
      </div>

      {/* Upcoming RAT */}
      <Card className="border-primary/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg">RAT Mendatang</CardTitle>
              <CardDescription>Rapat Anggota Tahunan 2024</CardDescription>
            </div>
            <Badge variant="default">Terjadwal</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">15 Februari 2024</p>
                <p className="text-sm text-muted-foreground">
                  09:00 - 12:00 WIB
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Aula Koperasi</p>
                <p className="text-sm text-muted-foreground">
                  Jl. Koperasi No. 123
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">1,189 / 1,247 Anggota</p>
                <p className="text-sm text-muted-foreground">
                  95.3% konfirmasi kehadiran
                </p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Agenda RAT 2024:</h4>
            <ul className="space-y-1">
              {ratHistory[0].agenda.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-muted-foreground flex items-center gap-2"
                >
                  <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex gap-2 pt-4">
            <Button>Kelola Agenda</Button>
            <Button variant="outline">Undang Anggota</Button>
            <Button variant="outline">Cetak Undangan</Button>
          </div>
        </CardContent>
      </Card>

      {/* RAT Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Anggota</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">Anggota aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Konfirmasi Kehadiran
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,189</div>
            <p className="text-xs text-muted-foreground">
              95.3% dari total anggota
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Kuorum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Tercapai</div>
            <p className="text-xs text-muted-foreground">Minimal 50% + 1</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Hari Tersisa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Hari menuju RAT</p>
          </CardContent>
        </Card>
      </div>

      {/* RAT History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat RAT</CardTitle>
          <CardDescription>Data pelaksanaan RAT sebelumnya</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ratHistory.map((rat) => (
              <div
                key={rat.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{rat.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {rat.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {rat.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {rat.location}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">
                      {rat.attendees} / {rat.totalMembers} Anggota
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {((rat.attendees / rat.totalMembers) * 100).toFixed(1)}%
                      kehadiran
                    </p>
                  </div>

                  <Badge
                    variant={rat.status === "selesai" ? "default" : "secondary"}
                  >
                    {rat.status}
                  </Badge>

                  <Button variant="ghost" size="sm">
                    Detail
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
