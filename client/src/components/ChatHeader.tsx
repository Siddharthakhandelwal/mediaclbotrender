import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Settings, Info, Minimize, Maximize } from 'lucide-react';
import { getAvatarUrl } from '@/lib/utils';

const ChatHeader: React.FC = () => {
  const [isMinimized, setIsMinimized] = useState<boolean>(false);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    const chatContainer = document.querySelector('.chat-container');
    const messageContainer = document.querySelector('.message-container');
    const inputArea = document.querySelector('.border-t');

    if (chatContainer && messageContainer && inputArea) {
      if (!isMinimized) {
        // Minimize
        chatContainer.classList.add('h-16');
        messageContainer.classList.add('hidden');
        inputArea.classList.add('hidden');
      } else {
        // Restore
        chatContainer.classList.remove('h-16');
        messageContainer.classList.remove('hidden');
        inputArea.classList.remove('hidden');
      }
    }
  };

  return (
    <div className="bg-primary p-4 text-white flex items-center justify-between border-b border-gray-200">
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10 border-2 border-white">
          <AvatarImage src={getAvatarUrl('assistant')} alt="Medical Assistant" />
          <AvatarFallback className="bg-white text-primary font-bold">MA</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="font-semibold text-lg">Medical Assistant</h1>
          <div className="flex items-center text-xs">
            <span className="flex h-2 w-2 relative mr-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            Online - Ready to assist
          </div>
        </div>
      </div>
      <div className="flex space-x-3">
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-primary-dark rounded-full h-9 w-9 p-0"
          title="Information"
        >
          <Info className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-primary-dark rounded-full h-9 w-9 p-0"
          title="Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-primary-dark rounded-full h-9 w-9 p-0"
          onClick={toggleMinimize}
          title={isMinimized ? "Expand" : "Minimize"}
        >
          {isMinimized ? (
            <Maximize className="h-5 w-5" />
          ) : (
            <Minimize className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;
