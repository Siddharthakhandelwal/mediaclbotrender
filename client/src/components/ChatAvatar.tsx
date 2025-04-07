import React, { useState, useEffect } from 'react';
import { MessageRole } from '../types';
import { getAvatarUrl } from '../lib/utils';
import Avatar3D from './Avatar3D';
import voiceService from '../services/VoiceService';

interface ChatAvatarProps {
  role: MessageRole;
  message?: string;
  size?: number;
  use3D?: boolean;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ 
  role, 
  message, 
  size = 40, 
  use3D = true 
}) => {
  const [speaking, setSpeaking] = useState(false);

  // Handle text-to-speech when message changes
  useEffect(() => {
    if (role === 'assistant' && message && message.trim() !== '') {
      speakMessage(message);
    }
    
    // Register for speaking state changes
    voiceService.onSpeakingChange(handleSpeakingChange);
    
    return () => {
      // Clean up
      voiceService.removeSpeakingCallback(handleSpeakingChange);
    };
  }, [message, role]);

  // Handle speaking state changes
  const handleSpeakingChange = (isSpeaking: boolean) => {
    setSpeaking(isSpeaking);
  };

  // Speak the message
  const speakMessage = async (text: string) => {
    try {
      await voiceService.speak(text);
    } catch (error) {
      console.error('Error speaking message:', error);
    }
  };

  // Render a 3D avatar or a 2D avatar based on the use3D prop
  if (use3D && role === 'assistant') {
    return <Avatar3D speaking={speaking} size={size} />;
  }

  // Fallback to 2D avatar using image URLs
  return (
    <div
      className="rounded-full overflow-hidden"
      style={{ width: size, height: size }}
    >
      <img 
        src={getAvatarUrl(role)} 
        alt={`${role} avatar`}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default ChatAvatar;