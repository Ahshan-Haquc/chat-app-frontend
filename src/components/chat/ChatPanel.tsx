"use client";

import { useMemo, useState } from "react";
import { Info, MessagesSquare } from "lucide-react";
import { useListConversationsQuery } from "@/redux/api/conversationsApi";
import { useAppSelector } from "@/redux/hooks";
import { UserAvatar } from "@/components/shared/UserAvatar";
import { EmptyState } from "@/components/shared/EmptyState";
import { MessageList } from "@/components/chat/MessageList";
import { MessageInput } from "@/components/chat/MessageInput";
import { GroupInfoDialog } from "@/components/chat/GroupInfoDialog";
import { Button } from "@/components/ui/button";
import { getConversationTitle, type ConversationListItem } from "@/types";

export function ChatPanel() {
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
      <EmptyState
        icon={MessagesSquare}
        title="Select a conversation"
        description="Choose an existing conversation or start a new one to begin chatting."
        className="flex-1"
      />
    );
  }

  const title = getConversationTitle(mergedConversation, currentUserId);
  const isGroup = mergedConversation.type === "group";
  const subtitle = isGroup
    ? `${mergedConversation.participants?.length ?? "..."} members`
    : mergedConversation.participant?.phone;

  return (
    <section className="flex h-full flex-1 flex-col bg-surface-soft">
      <header className="flex items-center justify-between gap-3 border-b border-ink/10 bg-white px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <UserAvatar name={title} isGroup={isGroup} />
          <div>
            <p className="text-sm font-semibold text-ink">{title}</p>
            <p className="text-xs text-ink/50">{subtitle}</p>
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
