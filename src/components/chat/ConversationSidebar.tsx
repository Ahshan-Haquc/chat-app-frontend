"use client";

import { useState } from "react";
import { MessageSquarePlus, Users, LogOut, Wifi, WifiOff } from "lucide-react";
import { useListConversationsQuery } from "@/redux/api/conversationsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { activeConversationSet } from "@/redux/slice/uiSlice";
import { loggedOut } from "@/redux/slice/authSlice";
import { ConversationRow } from "@/components/chat/ConversationRow";
import { NewConversationDialog } from "@/components/chat/NewConversationDialog";
import { NewGroupDialog } from "@/components/chat/NewGroupDialog";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { Button } from "@/components/ui/button";
import { disconnectSocket } from "@/socket/socketClient";

interface ConversationSidebarProps {
  isConnected: boolean;
}

export function ConversationSidebar({ isConnected }: ConversationSidebarProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.user);
  const activeConversationId = useAppSelector((state) => state.ui.activeConversationId);
  const { data: conversations, isLoading, isError, refetch } = useListConversationsQuery();
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false);
  const [isNewGroupOpen, setIsNewGroupOpen] = useState(false);

  function handleLogout() {
    disconnectSocket();
    dispatch(loggedOut());
  }

  const sorted = conversations
    ? [...conversations].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    : [];

  return (
    <aside className="flex h-full w-full max-w-sm flex-col border-r border-ink/10 bg-white">
      <div className="flex items-center justify-between gap-3 border-b border-ink/10 px-4 py-4">
        <div className="flex items-center gap-3">
          <UserAvatar name={currentUser?.name ?? "?"} size="sm" />
          <div>
            <p className="text-sm font-semibold text-ink">{currentUser?.name}</p>
            <p className="flex items-center gap-1 text-xs text-ink/40">
              {isConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isConnected ? "Live" : "Reconnecting"}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} aria-label="Log out">
          <LogOut size={18} />
        </Button>
      </div>

      <div className="flex gap-2 px-4 py-3">
        <Button className="flex-1" size="sm" onClick={() => setIsNewConversationOpen(true)}>
          <MessageSquarePlus size={16} />
          New chat
        </Button>
        <Button className="flex-1" size="sm" variant="secondary" onClick={() => setIsNewGroupOpen(true)}>
          <Users size={16} />
          New group
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {isLoading ? <LoadingSpinner label="Loading conversations" /> : null}
        {isError ? <ErrorState description="Couldn't load your conversations." onRetry={refetch} /> : null}
        {!isLoading && !isError && sorted.length === 0 ? (
          <EmptyState
            icon={MessageSquarePlus}
            title="No conversations yet"
            description="Search for someone by name or phone to start chatting."
          />
        ) : null}
        {sorted.map((conversation) => (
          <ConversationRow
            key={conversation._id}
            conversation={conversation}
            currentUserId={currentUser?._id}
            isActive={conversation._id === activeConversationId}
            onSelect={() => dispatch(activeConversationSet(conversation._id))}
          />
        ))}
      </div>

      <NewConversationDialog open={isNewConversationOpen} onOpenChange={setIsNewConversationOpen} />
      <NewGroupDialog open={isNewGroupOpen} onOpenChange={setIsNewGroupOpen} />
    </aside>
  );
}
