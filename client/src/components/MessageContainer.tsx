import React, { useEffect } from 'react';
import MessageBubble from './MessageBubble';
import EmbeddedService from './EmbeddedService';
import { ChatMessage } from '../types';

interface MessageContainerProps {
  messages: ChatMessage[];
  isLoading: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ 
  messages, 
  isLoading,
  messagesEndRef
}) => {
  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, messagesEndRef]);

  return (
    <div className="message-container flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => (
        <React.Fragment key={message.id}>
          <MessageBubble message={message} />
          
          {message.service && message.service.type !== 'none' && (
            <EmbeddedService service={message.service} />
          )}
        </React.Fragment>
      ))}
      
      {/* Typing indicator */}
      {isLoading && (
        <div className="flex items-start space-x-2">
          <div className="rounded-full bg-primary p-2 flex-shrink-0">
            <i className="ri-heart-pulse-line text-white text-sm"></i>
          </div>
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      
      {/* This element is used to scroll to the bottom of the chat */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageContainer;
