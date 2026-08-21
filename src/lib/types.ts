export interface User {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  type: "direct" | "group";
  name: string;
  avatar?: string;
  participants: User[];
  messages: Message[];
  unreadCount?: number;
}