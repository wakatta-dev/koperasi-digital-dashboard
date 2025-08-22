/** @format */

"use client";

import { useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ModuleStatusSelector({
  moduleId,
  defaultStatus,
}: {
  moduleId: number;
  defaultStatus: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action="/your/server/action/here" // optional: only needed if using server action here
      method="POST"
      className="flex items-center gap-2"
    >
      <input type="hidden" name="module_id" value={moduleId} />
      <input type="hidden" name="status" value={defaultStatus} />

      <Select
        defaultValue={defaultStatus}
        onValueChange={(val) => {
          const form = formRef.current;
          if (form) {
            form.status.value = val;
            form.submit();
          }
        }}
      >
        <SelectTrigger className="w-[120px]">
          <SelectValue placeholder="Select status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </form>
  );
}
