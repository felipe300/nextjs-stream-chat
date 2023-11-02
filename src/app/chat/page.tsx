"use client";
import { useUser } from "@clerk/nextjs";
import { Chat, LoadingIndicator } from "stream-chat-react";
import useInitializeChatClient from "./useInitializeChatClient";
import ChatSidebar from "./ChatSidebar";
import ChatChannel from "./ChatChannel";

export default function ChatPage() {
  const chatClient = useInitializeChatClient();
  const { user } = useUser();

  if (!chatClient || !user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingIndicator size={40} />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <Chat client={chatClient}>
        <div className="flex h-full flex-row">
          <ChatSidebar user={user} />
          <ChatChannel />
        </div>
      </Chat>
    </div>
  );
}
