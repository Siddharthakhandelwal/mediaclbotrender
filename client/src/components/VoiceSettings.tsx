import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Volume2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import voiceService from '../services/VoiceService';

interface VoiceSettingsProps {
  className?: string;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [accent, setAccent] = useState('Indian');
  const [testVoice, setTestVoice] = useState('');
  
  // Load voices when the component mounts
  useEffect(() => {
    // Get current preferences
    const currentPreference = voiceService.getVoicePreference();
    setGender(currentPreference.gender);
    setAccent(currentPreference.accent);
    
    // Get available voices
    const availableVoices = voiceService.getVoices();
    setVoices(availableVoices);
    
    // Set up test voice text
    setTestVoice("Hello, I'm your medical assistant. How can I help you today?");
  }, [open]);
  
  // Apply voice settings
  const applyVoiceSettings = () => {
    voiceService.setVoicePreference({
      gender,
      accent
    });
    
    // Play test voice
    voiceService.speak(testVoice);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`text-gray-600 hover:text-primary hover:bg-gray-100 ${className}`}
          title="Voice Settings"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Voice Settings</DialogTitle>
          <DialogDescription>
            Customize the voice of your medical assistant.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Voice Gender</h3>
            <RadioGroup 
              value={gender} 
              onValueChange={(value) => setGender(value as 'male' | 'female')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Voice Accent</h3>
            <Select value={accent} onValueChange={setAccent}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select accent" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Indian">Indian</SelectItem>
                <SelectItem value="American">American</SelectItem>
                <SelectItem value="British">British</SelectItem>
                <SelectItem value="">Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Test Voice</h3>
            <div className="flex space-x-2">
              <input
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                value={testVoice}
                onChange={(e) => setTestVoice(e.target.value)}
                placeholder="Enter text to test voice"
              />
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => voiceService.speak(testVoice)}
                title="Test Voice"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <div className="text-xs text-gray-500">
              {voices.length} voices available
            </div>
            <Button onClick={applyVoiceSettings}>
              Apply Settings
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceSettings;