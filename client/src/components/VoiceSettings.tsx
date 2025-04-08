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
import { Slider } from "@/components/ui/slider";
import elevenLabsService, { ElevenLabsVoice } from '../services/ElevenLabsService';
import { toast } from '@/hooks/use-toast';

interface VoiceSettingsProps {
  className?: string;
}

const VoiceSettings: React.FC<VoiceSettingsProps> = ({ className }) => {
  const [open, setOpen] = useState(false);
  const [elevenLabsVoices, setElevenLabsVoices] = useState<ElevenLabsVoice[]>([]);
  const [gender, setGender] = useState<'male' | 'female'>('female');
  const [accent, setAccent] = useState('Indian');
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | undefined>(undefined);
  const [variation, setVariation] = useState(true);
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [testVoice, setTestVoice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Load voices when the component opens
  useEffect(() => {
    if (open) {
      const loadVoices = async () => {
        setIsLoading(true);
        
        // Get current preferences
        const currentPreference = elevenLabsService.getVoicePreference();
        setGender(currentPreference.gender);
        setAccent(currentPreference.accent);
        setSelectedVoiceId(currentPreference.voice_id);
        setVariation(currentPreference.variation !== false);
        setStability(currentPreference.stability || 0.5);
        setSimilarityBoost(currentPreference.similarity_boost || 0.75);
        
        // Get available voices
        try {
          const availableVoices = await elevenLabsService.getVoices();
          setElevenLabsVoices(availableVoices);
        } catch (error) {
          console.error('Failed to load voices:', error);
          toast({
            title: "Couldn't load voices",
            description: "There was an issue loading the voice options.",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
        
        // Set up test voice text
        setTestVoice("Hello, I'm your medical assistant. How can I help you today?");
      };
      
      loadVoices();
    }
  }, [open]);
  
  // Apply voice settings
  const applyVoiceSettings = () => {
    elevenLabsService.setVoicePreference({
      gender,
      accent,
      voice_id: selectedVoiceId,
      variation,
      stability,
      similarity_boost: similarityBoost
    });
    
    // Play test voice
    elevenLabsService.speak(testVoice, selectedVoiceId);
    
    toast({
      title: "Voice settings applied",
      description: "Your voice preference has been updated.",
    });
  };
  
  // Test specific voice
  const testSpecificVoice = (voiceId: string) => {
    elevenLabsService.speak(testVoice, voiceId);
  };
  
  // Filter voices based on gender/accent
  const filteredVoices = elevenLabsVoices.filter(voice => {
    // If no filters are applied, show all voices
    if (!gender && !accent) return true;
    
    // Apply gender filter if set
    if (gender && voice.gender !== gender) return false;
    
    // Apply accent filter if set and not "Default"
    if (accent && accent !== "Default") {
      // Check if voice accent matches or description contains the accent
      const accentMatch = 
        voice.accent === accent || 
        (voice.description && voice.description.includes(accent));
      
      if (!accentMatch) return false;
    }
    
    return true;
  });
  
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Voice Settings (Eleven Labs)</DialogTitle>
          <DialogDescription>
            Customize the voice of your medical assistant using professional human-like voices.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-5">
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
                <SelectItem value="Australian">Australian</SelectItem>
                <SelectItem value="Irish">Irish</SelectItem>
                <SelectItem value="Default">Any Accent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Select Voice</h3>
            {isLoading ? (
              <div className="text-center py-4 text-sm text-gray-500">
                Loading voices...
              </div>
            ) : (
              <>
                <Select 
                  value={selectedVoiceId || "auto"} 
                  onValueChange={(value) => setSelectedVoiceId(value === "auto" ? undefined : value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Auto (based on gender/accent)" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px]">
                    <SelectItem value="auto">Auto (best match)</SelectItem>
                    {filteredVoices.map((voice) => (
                      <SelectItem key={voice.voice_id} value={voice.voice_id}>
                        {voice.name} {voice.gender && `(${voice.gender})`} {voice.accent && `- ${voice.accent}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex justify-end">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => selectedVoiceId && testSpecificVoice(selectedVoiceId)}
                    disabled={!selectedVoiceId}
                    className="text-xs"
                  >
                    Test Selected Voice
                  </Button>
                </div>
              </>
            )}
          </div>

          <div className="space-y-4">
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
                Enables subtle variations in voice parameters to make speech sound more natural and less repetitive.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="stability-slider" className="text-sm font-medium">
                  Stability: {Math.round(stability * 100)}%
                </Label>
              </div>
              <Slider
                id="stability-slider"
                min={0}
                max={1}
                step={0.05}
                value={[stability]}
                onValueChange={(value) => setStability(value[0])}
              />
              <p className="text-xs text-gray-500">
                Higher stability (right) makes the voice more consistent but less expressive.
                Lower stability (left) makes the voice more varied and expressive.
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="similarity-slider" className="text-sm font-medium">
                  Clarity & Similarity: {Math.round(similarityBoost * 100)}%
                </Label>
              </div>
              <Slider
                id="similarity-slider"
                min={0}
                max={1}
                step={0.05}
                value={[similarityBoost]}
                onValueChange={(value) => setSimilarityBoost(value[0])}
              />
              <p className="text-xs text-gray-500">
                Higher values (right) produce clearer, more consistent speech.
                Lower values (left) may sound more unique but less clear.
              </p>
            </div>
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
                onClick={() => elevenLabsService.speak(testVoice, selectedVoiceId)}
                title="Test Voice"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex justify-between pt-4">
            <div className="text-xs text-gray-500">
              {elevenLabsVoices.length} professional voices available
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