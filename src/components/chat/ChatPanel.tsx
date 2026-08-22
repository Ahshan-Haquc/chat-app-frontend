"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, Info, MessagesSquare } from "lucide-react";
import { useListConversationsQuery } from "@/redux/api/conversationsApi";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { activeConversationSet } from "@/redux/slice/uiSlice";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { GroupInfoDialog } from "@/components/chat/GroupInfoDialog";
import { Button } from "@/components/ui/button";
import { getConversationTitle, type ConversationListItem } from "@/types";
import { cn } from "@/lib/utils";

export function ChatPanel() {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector((state) => state.ui.activeConversationId);
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const { data: conversations } = useListConversationsQuery();
  const groupsById = useAppSelector((state) => state.groups.byId);
  const [isGroupInfoOpen, setIsGroupInfoOpen] = useState(false);

  const conversation: ConversationListItem | undefined = useMemo(
    () => conversations?.find((c) => c._id === activeConversationId),
    [conversations, activeConversationId]
  );

  const mergedConversation: ConversationListItem | undefined = useMemo(() => {
    if (!conversation) return undefined;
    if (conversation.type !== "group") return conversation;
    const fullGroup = groupsById[conversation._id];
    if (!fullGroup) return conversation;
    return {
      ...conversation,
      name: fullGroup.name,
      participants: fullGroup.participants,
      admins: fullGroup.admins,
      createdBy: fullGroup.createdBy
    };
  }, [conversation, groupsById]);

  if (!activeConversationId || !mergedConversation) {
    return (
      <div className="hidden md:flex h-full flex-1 flex-col items-center justify-center bg-surface-soft">
        <EmptyState
          icon={MessagesSquare}
          title="Select a conversation"
          description="Choose an existing conversation or start a new one to begin chatting."
          className="flex-1"
        />
      </div>
    );
  }

  const title = getConversationTitle(mergedConversation, currentUserId);
  const isGroup = mergedConversation.type === "group";
  const subtitle = isGroup
    ? `${mergedConversation.participants?.length ?? "..."} members`
    : mergedConversation.participant?.phone;

  return (
    <section
      className={cn(
        "h-full flex-1 flex-col bg-surface-soft",
        activeConversationId ? "flex w-full" : "hidden md:flex"
      )}
    >
      <header className="flex items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0 -ml-1.5"
            onClick={() => dispatch(activeConversationSet(null))}
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5 text-ink" />
          </Button>
          <UserAvatar name={title} isGroup={isGroup} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-ink">{title}</p>
            <p className="truncate text-xs text-ink/50">{subtitle}</p>
          </div>
        </div>
        {isGroup ? (
          <Button variant="ghost" size="icon" onClick={() => setIsGroupInfoOpen(true)} aria-label="Group info">
            <Info size={18} />
          </Button>
        ) : null}
      </header>

      <MessageList conversationId={activeConversationId} conversation={mergedConversation} />
      <MessageInput conversationId={activeConversationId} />

      {isGroup ? (
        <GroupInfoDialog open={isGroupInfoOpen} onOpenChange={setIsGroupInfoOpen} conversation={mergedConversation} />
      ) : null}
    </section>
  );
}
