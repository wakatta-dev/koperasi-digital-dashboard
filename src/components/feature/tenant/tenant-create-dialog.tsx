/** @format */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  createTenantSchema,
  type CreateTenantSchema,
} from "@/validators/tenant";
import { useTenantActions } from "@/hooks/queries/tenants";
import { useConfirm } from "@/hooks/use-confirm";

export function TenantCreateDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const { create } = useTenantActions();
  const confirm = useConfirm();
  const form = useForm<CreateTenantSchema>({
    resolver: zodResolver(createTenantSchema),
    defaultValues: {
      name: "",
      type: "",
      domain: "",
    },
  });

  const onSubmit = async (values: CreateTenantSchema) => {
    try {
      const ok = await confirm({
        variant: "create",
        title: "Buat tenant baru?",
        description: `Tenant ${values.name} akan dibuat.`,
        confirmText: "Buat",
      });
      if (!ok) return;
      await create.mutateAsync(values);
      setOpen(false);
      router.refresh();
    } catch (_e) {
      // Errors surfaced via toast or form; keep dialog open
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          Create Tenant
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-full sm:max-w-xl p-0">
        <SheetHeader>
          <SheetTitle>Create New Tenant</SheetTitle>
          <SheetDescription>
            Fill in the details to create a new tenant.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Acme Corp" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. vendor, client" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Domain</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. acme.localhost" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <SheetFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
