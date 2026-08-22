"use client";

import { useEffect, useRef, useState } from "react";
import { getSocket, disconnectSocket } from "@/socket/socketClient";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { conversationsApi } from "@/redux/api/conversationsApi";
import { baseApi } from "@/redux/api/baseApi";
import { getSenderId, type Message } from "@/types";

export function useChatSocket() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const currentUserId = useAppSelector((state) => state.auth.user?._id);
  const [isConnected, setIsConnected] = useState(false);
  const currentUserIdRef = useRef(currentUserId);
  currentUserIdRef.current = currentUserId;

  useEffect(() => {
    if (!token) return;

    const socket = getSocket(token);

    function handleConnect() {
      setIsConnected(true);
    }

    function handleDisconnect() {
      setIsConnected(false);
    }

    function handleNewMessage(payload: Message) {
      const incoming: Message = { ...payload, status: "sent" };
      const isOwnMessage = getSenderId(incoming.sender) === currentUserIdRef.current;

      dispatch(
        conversationsApi.util.updateQueryData(
          "getMessageHistory",
          { conversationId: incoming.conversationId },
          (draft) => {
            if (isOwnMessage) {
              for (const [id, message] of Object.entries(draft.byId)) {
                if (
                  id.startsWith("temp-") &&
                  message.text === incoming.text &&
                  getSenderId(message.sender) === currentUserIdRef.current
                ) {
                  delete draft.byId[id];
                }
              }
            }
            draft.byId[incoming._id] = incoming;
          }
        )
      );

      dispatch(
        conversationsApi.util.updateQueryData("listConversations", undefined, (draft) => {
          const target = draft.find((c) => c._id === incoming.conversationId);
          if (target) {
            target.lastMessage = incoming;
            target.updatedAt = incoming.createdAt;
          }
        })
      );
    }

    function handleConversationUpdated() {
      dispatch(baseApi.util.invalidateTags([{ type: "Conversations", id: "LIST" }]));
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("message:new", handleNewMessage);
    socket.on("conversation:updated", handleConversationUpdated);

    setIsConnected(socket.connected);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("message:new", handleNewMessage);
      socket.off("conversation:updated", handleConversationUpdated);
    };
  }, [token, dispatch]);

  useEffect(() => {
    if (!token) {
      disconnectSocket();
      setIsConnected(false);
    }
  }, [token]);

  return { isConnected };
}
