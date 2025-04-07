// Voice service to handle speech-to-text and text-to-speech operations

class VoiceService {
  private speechSynthesis: SpeechSynthesis;
  private voices: SpeechSynthesisVoice[] = [];
  private speaking: boolean = false;
  private speakingCallbacks: ((speaking: boolean) => void)[] = [];

  constructor() {
    this.speechSynthesis = window.speechSynthesis;
    
    // Load available voices
    this.loadVoices();
    
    // Update voices when they change
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
    }
  }

  private loadVoices(): void {
    // Get the available voices
    this.voices = this.speechSynthesis.getVoices();
  }

  /**
   * Convert text to speech
   * @param text The text to convert to speech
   * @param voiceIndex Optional index of the voice to use
   * @returns Promise that resolves when speech is done
   */
  public speak(text: string, voiceIndex?: number): Promise<void> {
    return new Promise((resolve) => {
      if (!this.speechSynthesis) {
        console.error('Speech synthesis not supported');
        resolve();
        return;
      }

      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set voice if provided, otherwise default to first available voice
      if (voiceIndex !== undefined && this.voices.length > voiceIndex) {
        utterance.voice = this.voices[voiceIndex];
      } else {
        // Select a voice that sounds natural - prefer en-US voices
        const preferredVoice = this.voices.find(
          voice => voice.lang === 'en-US' && voice.name.includes('Google') || voice.name.includes('Natural')
        );
        utterance.voice = preferredVoice || this.voices[0];
      }
      
      // Configure speech parameters
      utterance.pitch = 1.0;
      utterance.rate = 1.0;
      utterance.volume = 1.0;
      
      // Set up event handlers
      utterance.onstart = () => {
        this.speaking = true;
        this.notifySpeakingChange();
      };
      
      utterance.onend = () => {
        this.speaking = false;
        this.notifySpeakingChange();
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        this.speaking = false;
        this.notifySpeakingChange();
        resolve();
      };
      
      // Speak the text
      this.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Stop current speaking
   */
  public stop(): void {
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
      this.speaking = false;
      this.notifySpeakingChange();
    }
  }

  /**
   * Check if speech synthesis is currently speaking
   */
  public isSpeaking(): boolean {
    return this.speaking;
  }

  /**
   * Register a callback function to be notified when speaking state changes
   * @param callback Function to call when speaking state changes
   */
  public onSpeakingChange(callback: (speaking: boolean) => void): void {
    this.speakingCallbacks.push(callback);
    // Immediately call with current state
    callback(this.speaking);
  }

  /**
   * Remove a previously registered speaking callback
   * @param callback Function to remove
   */
  public removeSpeakingCallback(callback: (speaking: boolean) => void): void {
    this.speakingCallbacks = this.speakingCallbacks.filter(cb => cb !== callback);
  }
  
  /**
   * Toggle speech - start speaking if silent, stop if speaking
   * @param text Text to speak
   * @returns Promise that resolves when the action is complete
   */
  public toggleSpeech(text: string): Promise<void> {
    if (this.speaking) {
      this.stop();
      return Promise.resolve();
    } else {
      return this.speak(text);
    }
  }

  private notifySpeakingChange(): void {
    for (const callback of this.speakingCallbacks) {
      callback(this.speaking);
    }
  }

  /**
   * Get available voices
   * @returns Array of available voices
   */
  public getVoices(): SpeechSynthesisVoice[] {
    return this.voices;
  }
}

// Create a singleton instance
const voiceService = new VoiceService();
export default voiceService;