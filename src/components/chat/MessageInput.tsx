"use client";

import { useState, type KeyboardEvent } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSendMessageMutation, makeTempMessageId } from "@/redux/api/messagesApi";

interface MessageInputProps {
  conversationId: string;
}

export function MessageInput({ conversationId }: MessageInputProps) {
  const [text, setText] = useState("");
  const [sendMessage, { isLoading }] = useSendMessageMutation();

  function handleSend() {
    const trimmed = text.trim();
    if (!trimmed) return;
    setText("");
    sendMessage({ conversationId, text: trimmed, tempId: makeTempMessageId() });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex items-end gap-2 border-t border-ink/10 bg-white px-4 py-3 sm:px-6">
      <textarea
        value={text}
        onChange={(event) => setText(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        rows={1}
        className="max-h-32 flex-1 resize-none rounded-xl border border-ink/10 bg-surface-soft px-4 py-2.5 text-sm text-ink placeholder:text-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      />
      <Button size="icon" onClick={handleSend} disabled={!text.trim() || isLoading} aria-label="Send message">
        <Send size={16} />
      </Button>
    </div>
  );
}
