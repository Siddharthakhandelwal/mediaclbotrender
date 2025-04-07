import { useState, useEffect, useRef } from "react";
import { useChatContext } from "../context/ChatContext";

export const useChatbot = () => {
  const { messages, isLoading, sendMessage, quickActions } = useChatContext();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (inputValue.trim() && !isLoading) {
      sendMessage(inputValue);
      setInputValue("");
    }
  };

  const handleQuickAction = (actionText: string) => {
    if (!isLoading) {
      sendMessage(actionText);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return {
    messages,
    isLoading,
    inputValue,
    quickActions,
    messagesEndRef,
    handleSendMessage,
    handleQuickAction,
    handleInputChange,
    handleKeyPress,
    scrollToBottom,
  };
};
