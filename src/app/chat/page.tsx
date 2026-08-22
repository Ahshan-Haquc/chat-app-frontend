"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSessionRestore } from "@/redux/useSessionRestore";
import { useAppSelector } from "@/redux/hooks";
import { useChatSocket } from "@/socket/useChatSocket";
import { ConversationSidebar } from "@/components/chat/ConversationSidebar";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";

export default function ChatPage() {
  const router = useRouter();
  const { hydrated } = useSessionRestore();
  const token = useAppSelector((state) => state.auth.token);
  const { isConnected } = useChatSocket();

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <main className="flex h-screen items-center justify-center bg-surface">
        <LoadingSpinner label="Loading Chatly" />
      </main>
    );
  }

  return (
    <main className="flex h-screen overflow-hidden bg-surface">
      <ConversationSidebar isConnected={isConnected} />
      <ChatPanel />
    </main>
  );
}
