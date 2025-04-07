import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QuickActionButton } from '../types';
import { Send, Paperclip, Mic, SmilePlus } from 'lucide-react';

interface InputAreaProps {
  inputValue: string;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSendMessage: () => void;
  onQuickActionClick: (actionText: string) => void;
  quickActions: QuickActionButton[];
  isLoading: boolean;
}

const InputArea: React.FC<InputAreaProps> = ({
  inputValue,
  onInputChange,
  onKeyPress,
  onSendMessage,
  onQuickActionClick,
  quickActions,
  isLoading
}) => {
  return (
    <div className="border-t border-gray-200 p-3 bg-gray-50">
      <div className="flex space-x-2">
        <div className="flex space-x-2 items-center px-3 py-2 bg-gray-200 rounded-full">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-gray-800 h-6 w-6 p-0"
            title="Upload file"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-600 hover:text-gray-800 h-6 w-6 p-0"
            title="Voice input"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex-1 relative">
          <Input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Type your message here..."
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={onKeyPress}
            disabled={isLoading}
          />
          <div className="absolute right-0 top-0 h-full flex items-center pr-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-gray-400 hover:text-gray-600 h-6 w-6 p-0"
              title="Emoji"
            >
              <SmilePlus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Button
          className="bg-primary hover:bg-primary-dark text-white rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0 transition p-0"
          onClick={onSendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Quick action buttons */}
      <div className="flex flex-wrap gap-2 mt-3">
        {quickActions.map((action) => (
          <button
            key={action.id}
            className="bg-white text-primary border border-gray-300 rounded-full px-3 py-1 text-xs hover:bg-gray-100 transition"
            onClick={() => onQuickActionClick(action.text)}
            disabled={isLoading}
          >
            {action.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InputArea;
