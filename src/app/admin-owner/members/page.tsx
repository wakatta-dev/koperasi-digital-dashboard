/** @format */

import { fetchMembers, Member } from "@/actions/members";
import MembersContent from "./members-content";

export default async function Members() {
  const members: Member[] = await fetchMembers();
  return <MembersContent members={members} />;
}
