import React from 'react';
import { MessageRole } from '../types';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from 'lucide-react';
import { getAvatarUrl } from '@/lib/utils';

interface ChatAvatarProps {
  role: MessageRole;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ role }) => {
  const getFallbackText = () => {
    return role === 'user' ? 'U' : 'MA';
  };

  return (
    <Avatar className={`${role === 'assistant' ? 'bg-primary' : 'bg-gray-400'} h-8 w-8`}>
      <AvatarImage src={getAvatarUrl(role)} alt={role === 'user' ? 'User' : 'Medical Assistant'} />
      <AvatarFallback className={`${role === 'assistant' ? 'text-white' : 'text-gray-700'}`}>
        {role === 'user' ? <User className="h-4 w-4" /> : getFallbackText()}
      </AvatarFallback>
    </Avatar>
  );
};

export default ChatAvatar;