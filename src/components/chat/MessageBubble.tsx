import { Check, CheckCheck, Clock, TriangleAlert } from "lucide-react";
import { cn } from "@/utils/cn";
import { formatMessageTime } from "@/utils/formatTime";
import type { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showSenderName?: boolean;
}

export function MessageBubble({ message, isOwn, showSenderName }: MessageBubbleProps) {
  const senderName = typeof message.sender === "string" ? undefined : message.sender.name;

  return (
    <div className={cn("mb-2 flex", isOwn ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm",
          isOwn ? "rounded-br-sm bg-accent text-white" : "rounded-bl-sm bg-surface text-ink"
        )}
      >
        {showSenderName && senderName ? (
          <p className="mb-0.5 text-xs font-semibold text-brand">{senderName}</p>
        ) : null}
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <div className={cn("mt-1 flex items-center justify-end gap-1 text-[10px]", isOwn ? "text-white/70" : "text-ink/40")}>
          <span>{formatMessageTime(message.createdAt)}</span>
          {isOwn ? <MessageStatusIcon status={message.status} /> : null}
        </div>
      </div>
    </div>
  );
}

function MessageStatusIcon({ status }: { status?: Message["status"] }) {
  if (status === "sending") return <Clock size={11} />;
  if (status === "failed") return <TriangleAlert size={11} className="text-red-200" />;
  if (status === "sent") return <Check size={11} />;
  return <CheckCheck size={11} />;
}
