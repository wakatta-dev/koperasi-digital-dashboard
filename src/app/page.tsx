/** @format */

import { redirect } from "next/navigation";

export default function HomePage() {
  // Redirect to login page by default
  redirect("/login");
}
