/** @format */

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { createTenantAction } from "./_actions";

export default function PageCreate() {
  return (
    <div className="p-6 max-w-2xl space-y-8">
      <Link href="/vendor/clients" className="text-sm text-muted-foreground">
        ← Back to Clients
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create New Tenant</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTenantAction} className="space-y-4">
            <div>
              <Label htmlFor="name">Tenant Name</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g. Acme Corp"
                required
              />
            </div>

            <div>
              <Label htmlFor="type">Tenant Type</Label>
              <Input
                id="type"
                name="type"
                placeholder="e.g. vendor, client"
                required
              />
            </div>

            <div>
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                name="domain"
                placeholder="e.g. acme.localhost"
                required
              />
            </div>

            <Separator />

            <Button type="submit">Create Tenant</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
