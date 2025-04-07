export type MessageRole = "user" | "assistant" | "system";

export interface MessageType {
  id: string;
  content: string;
  role: MessageRole;
  timestamp: Date;
}

export interface EmbeddedServiceData {
  id: string;
  type: "appointment" | "search" | "video" | "none";
  query?: string;
  data?: Record<string, any>;
}

export interface ChatMessage extends MessageType {
  service?: EmbeddedServiceData;
}

export interface AppointmentData {
  type: string;
  date: string;
  time: string;
  doctor?: string;
}

export interface VideoData {
  title: string;
  source: string;
  thumbnail?: string;
  duration?: string;
  channel?: string;
  views?: string;
  likes?: string;
  description?: string;
}

export interface SearchResultData {
  title: string;
  summary: string;
  results: SearchResult[];
  featuredInfo?: FeaturedInfo;
}

export interface SearchResult {
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
}

export interface FeaturedInfo {
  title: string;
  content: string[];
  source: string;
}

export interface QuickActionButton {
  id: string;
  text: string;
}
