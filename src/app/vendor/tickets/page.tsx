/** @format */

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Ticket, Plus, Search, MessageCircle, Clock } from "lucide-react";

const tickets = [
  {
    id: "TKT-001",
    title: "Payment Gateway Integration Issue",
    description: "Having trouble with payment processing for large orders",
    priority: "high",
    status: "open",
    created: "2024-01-15",
    lastUpdate: "2024-01-16",
  },
  {
    id: "TKT-002",
    title: "Product Image Upload Problem",
    description: "Cannot upload high-resolution product images",
    priority: "medium",
    status: "in_progress",
    created: "2024-01-14",
    lastUpdate: "2024-01-15",
  },
  {
    id: "TKT-003",
    title: "Invoice Template Customization",
    description:
      "Need help customizing invoice templates with company branding",
    priority: "low",
    status: "resolved",
    created: "2024-01-10",
    lastUpdate: "2024-01-12",
  },
];

export default function TicketsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Support Tickets</h2>
          <p className="text-muted-foreground">
            Get help with your account and technical issues
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Ticket
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search tickets..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets.map((ticket) => (
          <Card key={ticket.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                    <Ticket className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-medium">{ticket.title}</h3>
                      <Badge
                        variant={
                          ticket.priority === "high"
                            ? "destructive"
                            : ticket.priority === "medium"
                              ? "default"
                              : "secondary"
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {ticket.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Created: {ticket.created}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="h-3 w-3" />
                        Updated: {ticket.lastUpdate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      ticket.status === "open"
                        ? "destructive"
                        : ticket.status === "in_progress"
                          ? "default"
                          : "secondary"
                    }
                  >
                    {ticket.status.replace("_", " ")}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
