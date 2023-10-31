import { UserButton } from "@clerk/nextjs";

export default function ChatPage() {
  return (
    <div>
      <h2>Chat page</h2>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
