export interface User {
  _id: string;
  name: string;
  phone: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export type MessageStatus = "sending" | "sent" | "failed";

export interface Message {
  _id: string;
  conversationId: string;
  sender: User | string;
  text: string;
  createdAt: string;
  status?: MessageStatus;
}

export interface MessageHistoryResponse {
  messages: Message[];
  hasMore: boolean;
}

export interface MessagesCache {
  byId: Record<string, Message>;
  hasMore: boolean;
}

export type ConversationType = "direct" | "group";

export interface ConversationListItem {
  _id: string;
  type: ConversationType;
  name?: string;
  lastMessage?: Partial<Message> | Record<string, never>;
  updatedAt: string;
  participant?: User;
  participants?: User[];
  admins?: string[];
  createdBy?: string;
}

export interface GroupConversation {
  _id: string;
  type: "group";
  name: string;
  createdBy: string;
  admins: string[];
  participants: User[];
  createdAt: string;
  updatedAt: string;
}

export function getSenderId(sender: User | string): string {
  return typeof sender === "string" ? sender : sender._id;
}

export function getConversationTitle(
  conversation: ConversationListItem | GroupConversation,
  currentUserId: string | undefined
): string {
  if (conversation.type === "group") {
    return conversation.name || "Unnamed group";
  }
  if ("participant" in conversation && conversation.participant) {
    return conversation.participant.name;
  }
  if ("participants" in conversation && conversation.participants) {
    const other = conversation.participants.find((p) => p._id !== currentUserId);
    return other?.name ?? "Direct message";
  }
  return "Conversation";
}
