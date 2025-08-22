/** @format */

import { redirect } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getTenant,
  updateTenant,
  updateTenantStatus,
  listTenantUsers,
  addTenantUser,
  listTenantModules,
  updateTenantModule,
} from "@/actions/tenants";
import { revalidatePath } from "next/cache";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ message?: string; error?: string }>;
}

export default async function TenantDetailPage({
  params,
  searchParams,
}: PageProps) {
  const id = (await params).id;
  const searchParam = await searchParams;
  const { data: tenant, success } = await getTenant(id);
  if (!success || !tenant) redirect("/tenant-not-found");

  const usersRes = await listTenantUsers(id);
  const modulesRes = await listTenantModules(id);

  async function updateTenantAction(formData: FormData) {
    "use server";
    const res = await updateTenant(id, {
      name: String(formData.get("name")),
      type: String(formData.get("type")),
      domain: String(formData.get("domain")),
    });
    revalidatePath(`/vendor/clients/${id}`);
    if (!res.success) {
      redirect(
        `/vendor/clients/${id}?error=${encodeURIComponent(res.message)}`
      );
    }
    redirect(
      `/vendor/clients/${id}?message=${encodeURIComponent(res.message)}`
    );
  }

  async function updateStatusAction(formData: FormData) {
    "use server";
    const status = formData.get("status") === "on" ? "active" : "inactive";
    const res = await updateTenantStatus(id, { status });
    revalidatePath(`/vendor/clients/${id}`);
    const target = res.success
      ? `/vendor/clients/${id}?message=${encodeURIComponent(res.message)}`
      : `/vendor/clients/${id}?error=${encodeURIComponent(res.message)}`;
    redirect(target);
  }

  async function addUserAction(formData: FormData) {
    "use server";
    const res = await addTenantUser(id, {
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      full_name: String(formData.get("full_name")),
      role_id: Number(formData.get("role_id")),
    });
    revalidatePath(`/vendor/clients/${id}`);
    const target = res.success
      ? `/vendor/clients/${id}?message=${encodeURIComponent(res.message)}`
      : `/vendor/clients/${id}?error=${encodeURIComponent(res.message)}`;
    redirect(target);
  }

  async function toggleModuleAction(formData: FormData) {
    "use server";
    const res = await updateTenantModule(id, {
      module_id: Number(formData.get("module_id")),
      status: String(formData.get("status")),
    });
    revalidatePath(`/vendor/clients/${id}`);
    const target = res.success
      ? `/vendor/clients/${id}?message=${encodeURIComponent(res.message)}`
      : `/vendor/clients/${id}?error=${encodeURIComponent(res.message)}`;
    redirect(target);
  }

  return (
    <div className="space-y-8">
      <Link href="/vendor/clients">← Back</Link>
      {searchParam?.message && (
        <p className="text-green-600">{searchParam.message}</p>
      )}
      {searchParam?.error && (
        <p className="text-red-600">{searchParam.error}</p>
      )}
      <form action={updateTenantAction} className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" defaultValue={tenant.name} />
        </div>
        <div>
          <Label htmlFor="type">Type</Label>
          <Input id="type" name="type" defaultValue={tenant.type} />
        </div>
        <div>
          <Label htmlFor="domain">Domain</Label>
          <Input id="domain" name="domain" defaultValue={tenant.domain} />
        </div>
        <Button type="submit">Save</Button>
      </form>

      <form action={updateStatusAction} className="flex items-center gap-2">
        <Switch name="status" defaultChecked={tenant.status === "active"} />
        <Button type="submit">Update Status</Button>
      </form>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Users</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersRes.data?.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <form action={addUserAction} className="space-y-2">
          <Input name="email" placeholder="email" />
          <Input name="password" placeholder="password" type="password" />
          <Input name="full_name" placeholder="full name" />
          <Input name="role_id" placeholder="role id" />
          <Button type="submit">Add User</Button>
        </form>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Modules</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {modulesRes.data?.map((m) => (
              <TableRow key={m.id}>
                <TableCell>{m.name}</TableCell>
                <TableCell>
                  <form action={toggleModuleAction}>
                    <input type="hidden" name="module_id" value={m.id} />
                    <select name="status" defaultValue={m.status}>
                      <option value="active">active</option>
                      <option value="inactive">inactive</option>
                    </select>
                    <Button type="submit" size="sm" className="ml-2">
                      Save
                    </Button>
                  </form>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}
