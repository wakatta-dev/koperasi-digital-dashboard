/** @format */

"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import type { UserRole } from "@/lib/types";
import { Alert, AlertDescription } from "../ui/alert";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    setLoading(true);
    setError("");

    try {
      const session = await signIn(email, password, role);

      if (!session) {
        setError("Email, password, atau role tidak valid");
        return;
      }

      // Redirect based on role
      router.push(`/${role}/dashboard`);
    } catch {
      setError("Terjadi kesalahan saat login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nama@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Role</Label>
        <Select
          value={role}
          onValueChange={(value) => setRole(value as UserRole)}
          required
          disabled={loading}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Role</SelectLabel>
              <SelectItem value="vendor">Vendor</SelectItem>
              <SelectItem value="koperasi">Koperasi</SelectItem>
              <SelectItem value="umkm">UMKM</SelectItem>
              <SelectItem value="bumdes">BUMDes</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Memproses..." : "Masuk"}
      </Button>

      <div className="text-sm text-muted-foreground space-y-1">
        <p>Demo credentials:</p>
        <p>• vendor@test.com / password (Vendor)</p>
        <p>• koperasi@test.com / password (Koperasi)</p>
        <p>• umkm@test.com / password (UMKM)</p>
        <p>• bumdes@test.com / password (BUMDes)</p>
      </div>
    </form>
  );
}
