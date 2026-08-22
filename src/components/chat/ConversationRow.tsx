import { UserAvatar } from "@/components/shared/UserAvatar";
import { cn } from "@/utils/cn";
import { formatConversationTime } from "@/utils/formatTime";
import { getConversationTitle, type ConversationListItem } from "@/types";

interface ConversationRowProps {
  conversation: ConversationListItem;
  currentUserId?: string;
  isActive: boolean;
  onSelect: () => void;
}

export function ConversationRow({ conversation, currentUserId, isActive, onSelect }: ConversationRowProps) {
  const title = getConversationTitle(conversation, currentUserId);
  const preview = conversation.lastMessage && "text" in conversation.lastMessage ? conversation.lastMessage.text : "No messages yet";
  const isGroup = conversation.type === "group";

  return (
    <button
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors",
        isActive ? "bg-brand text-white!" : "text-ink hover:bg-surface"
      )}
    >
      <UserAvatar name={title} isGroup={isGroup} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate text-sm font-medium">{title}</p>
          <span className={cn("shrink-0 text-xs", isActive ? "text-white/70" : "text-ink/40")}>
            {formatConversationTime(conversation.updatedAt)}
          </span>
        </div>
        <p className={cn("truncate text-xs", isActive ? "text-white/70" : "text-ink/50")}>{preview}</p>
      </div>
    </button>
  );
}
