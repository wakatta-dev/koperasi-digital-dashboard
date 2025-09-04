/** @format */

import React from "react";
import Icon, { IconName } from "@/components/shared/atoms/Icon";
import { toast } from "sonner";

export function showToastError(
  title: string,
  descriptionOrPayload: string | any,
  iconName?: IconName
) {
  const renderErrors = (payload: any): React.ReactNode => {
    try {
      const errorsObj = payload?.data?.errors ?? payload?.errors;

      if (
        errorsObj &&
        typeof errorsObj === "object" &&
        Object.keys(errorsObj).length > 0
      ) {
        const items = Object.entries(errorsObj).map(([field, message]) => {
          const text = Array.isArray(message) ? message.join(", ") : String(message);
          return <li key={field}>{text}</li>;
        });

        return (
          <div className="ml-4">
            <ul className="list-disc pl-5 space-y-1">{items}</ul>
          </div>
        );
      }
      // Fallback to message if errors are empty or not present
      const msg = payload?.message ?? payload?.data?.message ?? "Terjadi kesalahan";
      return <span>{String(msg)}</span>;
    } catch {
      // Last resort stringify unknown payload
      return <span>{String(descriptionOrPayload)}</span>;
    }
  };

  const description: React.ReactNode =
    typeof descriptionOrPayload === "string"
      ? descriptionOrPayload
      : renderErrors(descriptionOrPayload);

  toast.error(title, {
    icon: <Icon icon={iconName ?? "symbol-circle-warning"} className="text-white" />,
    description,
    position: "top-right",
    duration: 3000,
  });
}

export function showToastSuccess(
  title: string,
  description: string,
  iconName?: IconName
) {
  toast.success(title, {
    icon: <Icon icon={iconName ?? "symbol-circle-checklist"} className="text-white" />,
    description: description,
    position: "top-right",
    duration: 3000,
  });
}

export function showToastWarning(
  title: string,
  description: string,
  iconName?: IconName
) {
  toast.warning(title, {
    icon: <Icon icon={iconName ?? "symbol-circle-checklist"} className="text-white" />,
    description: description,
    position: "top-right",
    duration: 3000,
  });
}

export function showToastInfo(title: string, description: string, iconName?: IconName) {
  toast.info(title, {
    icon: <Icon icon={iconName ?? "symbol-circle-warning"} className="text-white" />,
    description: description,
    position: "top-right",
    duration: 3000,
  });
}

