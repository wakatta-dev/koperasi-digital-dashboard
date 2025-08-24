/** @format */

"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusIcon } from "lucide-react";

export function TenantCreateDialog() {
  const [open, setOpen] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Tenant
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Tenant</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new tenant.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={async () => {
            // await createTenantAction(formData);
            setOpen(false);
            router.refresh(); // Reload data after create
          }}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Acme Corp"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Input
              id="type"
              name="type"
              placeholder="e.g. vendor, client"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              name="domain"
              placeholder="e.g. acme.localhost"
              required
            />
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
