import React from "react";
import ChatHeader from "./ChatHeader";
import MessageContainer from "./MessageContainer";
import InputArea from "./InputArea";
import { useChatbot } from "../hooks/useChatbot";

const ChatBot: React.FC = () => {
  const {
    messages,
    isLoading,
    inputValue,
    quickActions,
    messagesEndRef,
    handleSendMessage,
    handleQuickAction,
    handleInputChange,
    handleKeyPress,
  } = useChatbot();

  return (
    <div className="flex justify-center items-center min-h-screen p-4 bg-gray-100">
      <div className="chat-container bg-white rounded-xl shadow-lg overflow-hidden w-full max-w-4xl flex flex-col">
        <ChatHeader />
        
        <MessageContainer
          messages={messages}
          isLoading={isLoading}
          messagesEndRef={messagesEndRef}
        />
        
        <InputArea
          inputValue={inputValue}
          onInputChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onSendMessage={handleSendMessage}
          onQuickActionClick={handleQuickAction}
          quickActions={quickActions}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default ChatBot;
