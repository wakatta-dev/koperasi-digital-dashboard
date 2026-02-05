/** @format */

"use client";

import { CustomerListHeader } from "./CustomerListHeader";
import type { CustomerListHeaderProps } from "./CustomerListHeader";

export type CustomerListToolbarProps = CustomerListHeaderProps;

export function CustomerListToolbar(props: CustomerListToolbarProps) {
  return <CustomerListHeader {...props} />;
}
