/** @format */

"use client";

import { Member } from "@/actions/members";
import { useLanguage } from "@/contexts/language-context";

export default function MembersContent({ members }: { members: Member[] }) {
  const { t } = useLanguage();
  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">{t("membersList")}</h1>
      <ul>
        {members?.map((m) => (
          <li key={m.id}>{m.membership_number}</li>
        ))}
      </ul>
    </main>
  );
}

