
export type MessageRole = 'user' | 'assistant' | 'system';

export interface MessagePart {
  text?: string;
  image?: string; // base64 URL
  video?: string; // URL
  isLoading?: boolean;
}

export interface ChatMessage {
  id: string;
  role: MessageRole;
  parts: MessagePart[];
  timestamp: number;
}

export type GenerationType = 'text' | 'image' | 'video';

export interface ChatHistory {
  id: string;
  title: string;
  lastUpdated: number;
}
