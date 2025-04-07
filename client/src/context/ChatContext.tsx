import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { nanoid } from "nanoid";
import { ChatMessage, QuickActionButton } from "../types";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ChatContextType {
  messages: ChatMessage[];
  isLoading: boolean;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
  quickActions: QuickActionButton[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();
  
  const [quickActions, setQuickActions] = useState<QuickActionButton[]>([
    { id: nanoid(), text: "Schedule appointment" },
    { id: nanoid(), text: "Check insurance" },
    { id: nanoid(), text: "Find a doctor" },
    { id: nanoid(), text: "Medical advice" }
  ]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (!isInitialized) {
      const welcomeMessage: ChatMessage = {
        id: nanoid(),
        content: "Hello! I'm your Medical Assistant. I can help with appointments, answer medical questions, access services, and more—all without leaving this chat. How can I help you today?",
        role: "assistant",
        timestamp: new Date(),
      };
      
      setMessages([welcomeMessage]);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage: ChatMessage = {
        id: nanoid(),
        content,
        role: "user",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await apiRequest("POST", "/api/chat", {
          message: content,
          messageHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        });
        
        const data = await response.json();
        
        const assistantMessage: ChatMessage = {
          id: nanoid(),
          content: data.message,
          role: "assistant",
          timestamp: new Date(),
          service: data.service ? {
            id: nanoid(),
            type: data.service.type,
            query: data.service.query,
            data: data.service.data
          } : undefined
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error sending message:", error);
        toast({
          title: "Error",
          description: "Failed to send message. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [messages, toast]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setIsInitialized(false); // This will trigger the welcome message to appear again
  }, []);

  return (
    <ChatContext.Provider
      value={{
        messages,
        isLoading,
        sendMessage,
        clearMessages,
        quickActions
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
