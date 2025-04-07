import React from 'react';
import { ChatMessage } from '../types';
import { Heart } from 'lucide-react';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUserMessage = message.role === 'user';
  
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isUserMessage) {
    return (
      <div className="flex items-start justify-end">
        <div className="bg-primary text-white rounded-lg p-3 max-w-[80%]">
          <div>{message.content}</div>
          <div className="text-xs opacity-70 text-right mt-1">
            {formatTime(message.timestamp)}
          </div>
        </div>
      </div>
    );
  }

  // For assistant messages
  return (
    <div className="flex items-start space-x-2">
      <div className="rounded-full bg-primary p-2 flex-shrink-0">
        <Heart className="text-white h-4 w-4" />
      </div>
      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%]">
        <div className="font-medium text-gray-800">
          {message.content}
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
