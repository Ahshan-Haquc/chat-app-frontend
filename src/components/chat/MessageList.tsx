"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, MessageCircle } from "lucide-react";
import { useGetMessageHistoryQuery } from "@/redux/api/conversationsApi";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { formatDayDivider } from "@/utils/formatTime";
import { useAppSelector } from "@/redux/hooks";
import { getSenderId, type ConversationListItem } from "@/types";

interface MessageListProps {
  conversationId: string;
  conversation?: ConversationListItem;
}

const NEAR_BOTTOM_THRESHOLD = 96;

export function MessageList({ conversationId, conversation }: MessageListProps) {
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const [before, setBefore] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetching, isError, refetch } = useGetMessageHistoryQuery({ conversationId, before });

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(0);
  const wasNearBottomRef = useRef(true);
  const [showJumpToLatest, setShowJumpToLatest] = useState(false);

  useEffect(() => {
    setBefore(undefined);
    previousCountRef.current = 0;
    wasNearBottomRef.current = true;
    setShowJumpToLatest(false);
  }, [conversationId]);

  const messages = useMemo(() => {
    if (!data) return [];
    return Object.values(data.byId).sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [data]);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const isNewMessage = messages.length > previousCountRef.current;
    const isInitialLoad = previousCountRef.current === 0 && messages.length > 0 && !before;

    if (isInitialLoad) {
      container.scrollTop = container.scrollHeight;
    } else if (isNewMessage && wasNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setShowJumpToLatest(false);
    } else if (isNewMessage) {
      setShowJumpToLatest(true);
    }

    previousCountRef.current = messages.length;
  }, [messages, before]);

  function handleScroll() {
    const container = scrollRef.current;
    if (!container) return;

    const distanceFromBottom = container.scrollHeight - container.scrollTop - container.clientHeight;
    wasNearBottomRef.current = distanceFromBottom < NEAR_BOTTOM_THRESHOLD;
    if (wasNearBottomRef.current) setShowJumpToLatest(false);

    if (container.scrollTop < 80 && data?.hasMore && !isFetching) {
      const oldest = messages[0];
      if (oldest) {
        const previousHeight = container.scrollHeight;
        setBefore(oldest._id);
        requestAnimationFrame(() => {
          if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight - previousHeight;
          }
        });
      }
    }
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowJumpToLatest(false);
  }

  if (isLoading) {
    return <LoadingSpinner label="Loading messages" className="flex-1" />;
  }

  if (isError) {
    return <ErrorState description="Couldn't load this conversation." onRetry={refetch} className="flex-1" />;
  }

  if (messages.length === 0) {
    return (
      <EmptyState
        icon={MessageCircle}
        title="Say hello"
        description="No messages here yet. Send the first one."
        className="flex-1"
      />
    );
  }

  let lastDay = "";

  return (
    <div className="relative flex-1 overflow-hidden">
      <div ref={scrollRef} onScroll={handleScroll} className="h-full overflow-y-auto px-4 py-4 sm:px-6">
        {isFetching && before ? <LoadingSpinner label="Loading older messages" /> : null}

        {messages.map((message) => {
          const day = formatDayDivider(message.createdAt);
          const showDivider = day !== lastDay;
          lastDay = day;
          const isOwn = getSenderId(message.sender) === currentUserId;

          return (
            <div key={message._id}>
              {showDivider ? (
                <div className="my-4 flex items-center justify-center">
                  <span className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink/50">{day}</span>
                </div>
              ) : null}
              <MessageBubble
                message={message}
                isOwn={isOwn}
                showSenderName={conversation?.type === "group" && !isOwn}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {showJumpToLatest ? (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-brand px-4 py-2 text-xs font-medium text-white shadow-lg animate-fade-in"
        >
          <ArrowDown size={14} />
          New messages
        </button>
      ) : null}
    </div>
  );
}
