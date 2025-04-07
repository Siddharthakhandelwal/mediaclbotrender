import React, { useEffect } from 'react';
import MessageBubble from './MessageBubble';
import EmbeddedService from './EmbeddedService';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ChatMessage } from '../types';
import { getAvatarUrl } from '@/lib/utils';

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
        <div key={message.id} className="message-group space-y-2">
          <MessageBubble message={message} />
          
          {message.service && message.service.type !== 'none' && (
            <EmbeddedService service={message.service} />
          )}
        </div>
      ))}
      
      {/* Typing indicator */}
      {isLoading && (
        <div className="flex items-start space-x-2">
          <div className="flex-shrink-0">
            <Avatar className="h-8 w-8 bg-primary">
              <AvatarImage 
                src={getAvatarUrl('assistant')} 
                alt="Medical Assistant" 
              />
              <AvatarFallback className="bg-primary text-white font-bold">
                MA
              </AvatarFallback>
            </Avatar>
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
