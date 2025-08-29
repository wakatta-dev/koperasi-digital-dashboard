/** @format */

"use client";

import { Users as UsersIcon, Search, Shield, Edit, Trash2 } from "lucide-react";
import { useMemo } from "react";
import { useUsers, useUserActions } from "@/hooks/queries/users";
import type { User } from "@/types/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { UserUpsertDialog } from "@/components/feature/vendor/users/user-upsert-dialog";

type Props = {
  initialData?: User[];
  limit?: number;
};

export function VendorUsersList({ initialData, limit = 20 }: Props) {
  const params = useMemo(() => ({ limit }), [limit]);
  const { data: users = [] } = useUsers(params, initialData);
  const { remove } = useUserActions();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Users</h2>
          <p className="text-muted-foreground">Manage team members and permissions</p>
        </div>
        <UserUpsertDialog />
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search users..." className="pl-10" />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>All users with access to your vendor account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <UsersIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{user.full_name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{user.role?.name}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Last login: {user.last_login ?? "-"}
                    </p>
                  </div>

                  <Badge variant={user.status ? "default" : "secondary"}>
                    {user.status ? "active" : "inactive"}
                  </Badge>

                  <div className="flex items-center gap-2">
                    <UserUpsertDialog
                      user={user}
                      trigger={
                        <Button variant="ghost" size="icon" type="button">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => remove.mutate(user.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
