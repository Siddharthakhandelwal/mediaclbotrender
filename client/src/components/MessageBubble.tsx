import React, { useState } from 'react';
import { ChatMessage } from '../types';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User, Volume2 } from 'lucide-react';
import { getAvatarUrl } from '@/lib/utils';
import ChatAvatar from './ChatAvatar';
import { Button } from '@/components/ui/button';
import voiceService from '../services/VoiceService';

interface MessageBubbleProps {
  message: ChatMessage;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isUserMessage = message.role === 'user';
  const [use3D, setUse3D] = useState(true);
  
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Toggle 3D avatar display for testing purposes
  const toggleAvatarMode = () => {
    setUse3D(!use3D);
  };
  
  // Play text aloud using the voice service
  const [isPlaying, setIsPlaying] = useState(false);
  
  const playMessage = () => {
    voiceService.toggleSpeech(message.content)
      .catch(err => console.error('Error playing message:', err));
  };
  
  // Update isPlaying state when voice service speaking state changes
  React.useEffect(() => {
    const onSpeakingChange = (speaking: boolean) => {
      setIsPlaying(speaking);
    };
    
    voiceService.onSpeakingChange(onSpeakingChange);
    
    return () => {
      voiceService.removeSpeakingCallback(onSpeakingChange);
    };
  }, []);

  if (isUserMessage) {
    return (
      <div className="flex items-start justify-end space-x-2">
        <div className="bg-primary text-white rounded-lg p-3 max-w-[80%]">
          <div>{message.content}</div>
          <div className="text-xs opacity-70 text-right mt-1">
            {formatTime(message.timestamp)}
          </div>
        </div>
        <div className="flex-shrink-0">
          <Avatar className="h-8 w-8 bg-gray-300">
            <AvatarImage src={getAvatarUrl('user')} alt="User" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    );
  }

  // For assistant messages
  return (
    <div className="flex items-start space-x-2">
      <div className="flex-shrink-0" onClick={toggleAvatarMode}>
        {use3D ? (
          <ChatAvatar 
            role="assistant" 
            message={message.content} 
            size={40} 
            use3D={true}
          />
        ) : (
          <Avatar className="h-10 w-10 bg-primary">
            <AvatarImage src={getAvatarUrl('assistant')} alt="Medical Assistant" />
            <AvatarFallback className="bg-primary text-white font-bold">
              MA
            </AvatarFallback>
          </Avatar>
        )}
      </div>
      <div className="bg-gray-100 rounded-lg p-3 max-w-[80%] relative">
        <div className="font-medium text-gray-800">
          {message.content}
        </div>
        <div className="flex justify-between items-center mt-1">
          <div className="text-xs text-gray-500">
            {formatTime(message.timestamp)}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`${isPlaying ? 'text-primary' : 'text-gray-400'} hover:text-primary h-6 w-6 p-0 ml-2`}
            onClick={playMessage}
            title={isPlaying ? "Stop speaking" : "Play message"}
          >
            <Volume2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
