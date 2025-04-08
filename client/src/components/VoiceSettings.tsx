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
import { Settings as SettingsIcon, Volume2 } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import voiceService from '../services/VoiceService';

interface VoiceSettingsProps {
  className?: string;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [accent, setAccent] = useState('Indian');
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number | undefined>(undefined);
  const [variation, setVariation] = useState(true);
  const [testVoice, setTestVoice] = useState('');
  
  // Load voices when the component mounts
  useEffect(() => {
    // Get current preferences
    const currentPreference = voiceService.getVoicePreference();
    setGender(currentPreference.gender);
    setAccent(currentPreference.accent);
    setSelectedVoiceIndex(currentPreference.voiceIndex);
    setVariation(currentPreference.variation !== false); // Default to true if not set
    
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
      accent,
      voiceIndex: selectedVoiceIndex,
      variation
    });
    
    // Play test voice with selected voice
    voiceService.speak(testVoice, selectedVoiceIndex);
  };
  
  // Test specific voice
  const testSpecificVoice = (index: number) => {
    voiceService.speak(testVoice, index);
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
          <SettingsIcon className="h-5 w-5" />
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
                <SelectItem value="Default">Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Specific Voice</h3>
            <Select 
              value={selectedVoiceIndex !== undefined ? selectedVoiceIndex.toString() : ''} 
              onValueChange={(value) => setSelectedVoiceIndex(value ? parseInt(value) : undefined)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Auto (based on gender/accent)" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                <SelectItem value="">Auto (based on gender/accent)</SelectItem>
                {voices.map((voice, index) => (
                  <SelectItem key={index} value={index.toString()}>
                    {voice.name} ({voice.lang})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => selectedVoiceIndex !== undefined && testSpecificVoice(selectedVoiceIndex)}
                disabled={selectedVoiceIndex === undefined}
                className="text-xs"
              >
                Test Selected Voice
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Natural Voice Variation</h3>
              <div className="flex items-center space-x-2">
                <Label htmlFor="variation-toggle" className="text-xs text-gray-500">
                  {variation ? 'On' : 'Off'}
                </Label>
                <Switch 
                  id="variation-toggle" 
                  checked={variation} 
                  onCheckedChange={setVariation}
                />
              </div>
            </div>
            <p className="text-xs text-gray-500">
              Enables small variations in pitch and speed to make speech sound more natural and less repetitive.
            </p>
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
                onClick={() => voiceService.speak(testVoice, selectedVoiceIndex)}
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