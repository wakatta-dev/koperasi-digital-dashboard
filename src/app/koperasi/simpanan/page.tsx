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
import { Input } from "@/components/ui/input";
import { Search, ArrowUpCircle, ArrowDownCircle } from "lucide-react";

const simpananTransactions = [
  {
    id: "SP001",
    memberName: "Budi Santoso",
    memberId: "A001",
    type: "setoran",
    category: "Simpanan Wajib",
    amount: "Rp 100,000",
    date: "2024-01-15",
    balance: "Rp 1,200,000",
  },
  {
    id: "SP002",
    memberName: "Siti Aminah",
    memberId: "A002",
    type: "setoran",
    category: "Simpanan Sukarela",
    amount: "Rp 500,000",
    date: "2024-01-14",
    balance: "Rp 1,300,000",
  },
  {
    id: "SP003",
    memberName: "Ahmad Wijaya",
    memberId: "A003",
    type: "penarikan",
    category: "Simpanan Sukarela",
    amount: "Rp 200,000",
    date: "2024-01-13",
    balance: "Rp 800,000",
  },
];

export default function SimpananPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Simpanan</h2>
          <p className="text-muted-foreground">
            Kelola simpanan anggota koperasi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <ArrowDownCircle className="h-4 w-4 mr-2" />
            Penarikan
          </Button>
          <Button>
            <ArrowUpCircle className="h-4 w-4 mr-2" />
            Setoran
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Total Simpanan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 2.4M</div>
            <p className="text-xs text-muted-foreground">
              +15.2% dari bulan lalu
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Simpanan Pokok
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 623K</div>
            <p className="text-xs text-muted-foreground">1,247 anggota</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Simpanan Wajib
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 1.2M</div>
            <p className="text-xs text-muted-foreground">Bulanan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Simpanan Sukarela
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 577K</div>
            <p className="text-xs text-muted-foreground">
              Dapat ditarik sewaktu-waktu
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari transaksi simpanan..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaksi Simpanan</CardTitle>
          <CardDescription>
            Riwayat setoran dan penarikan simpanan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {simpananTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    {transaction.type === "setoran" ? (
                      <ArrowUpCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <ArrowDownCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium">{transaction.memberName}</h3>
                    <p className="text-sm text-muted-foreground">
                      {transaction.memberId} • {transaction.category}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {transaction.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p
                      className={`font-medium ${
                        transaction.type === "setoran"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "setoran" ? "+" : "-"}
                      {transaction.amount}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Saldo: {transaction.balance}
                    </p>
                  </div>

                  <Badge
                    variant={
                      transaction.type === "setoran" ? "default" : "secondary"
                    }
                  >
                    {transaction.type}
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
