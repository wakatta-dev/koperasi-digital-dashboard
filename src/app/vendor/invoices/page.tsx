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
import { FileText, Plus, Search, Download, Eye } from "lucide-react";

const invoices = [
  {
    id: "INV-001",
    client: "PT Maju Jaya",
    amount: "Rp 2,450,000",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    status: "paid",
  },
  {
    id: "INV-002",
    client: "CV Berkah Sejahtera",
    amount: "Rp 1,750,000",
    date: "2024-01-20",
    dueDate: "2024-02-20",
    status: "pending",
  },
  {
    id: "INV-003",
    client: "UD Mandiri",
    amount: "Rp 890,000",
    date: "2024-01-25",
    dueDate: "2024-02-25",
    status: "overdue",
  },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoices</h2>
          <p className="text-muted-foreground">
            Track and manage your invoices
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search invoices..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
          <CardDescription>All your invoices and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{invoice.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {invoice.client}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-medium">{invoice.amount}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {invoice.dueDate}
                    </p>
                  </div>

                  <Badge
                    variant={
                      invoice.status === "paid"
                        ? "default"
                        : invoice.status === "pending"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {invoice.status}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
