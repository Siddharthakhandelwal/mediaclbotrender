# Medical Assistant Chat Bot

A sophisticated AI-powered medical front desk assistant that provides patients with a seamless chat interface for appointment scheduling, medical information, and administrative support.

## Features

- 💬 **Intelligent Chat Interface**: Natural language understanding for medical terminology and patient requests
- 🗣️ **Voice Interaction**: Professional voice synthesis using Eleven Labs API
- 🧠 **Smart Response Generation**: Powered by Groq's LLama 3 models
- 📅 **Appointment Scheduling**: Intelligent extraction of dates, times, and appointment types
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🔄 **Contextual Memory**: Maintains conversation history for coherent interactions

## Configuration Guide

The application uses several configuration options that can be customized by modifying the appropriate files.

### API Keys

API keys are stored as environment variables. For local development, create a `.env` file in the root directory with the following variables:

```env
GROQ_API_KEY=your_groq_api_key
ELEVEN_LABS_API_KEY=your_eleven_labs_api_key
```

For production deployments, these variables should be set in your hosting platform's environment configuration.

### Voice Configuration

The application currently uses Eleven Labs for voice synthesis. The voice ID and other parameters can be customized in `client/src/services/ElevenLabsService.ts`.

#### Voice ID

The voice ID is fixed to use a specific Eleven Labs voice. To change it, modify the `findBestMatchingVoice` method:

```typescript
// Change the fixed voice ID
private async findBestMatchingVoice(): Promise<string> {
  // Replace with your preferred voice ID from Eleven Labs
  return "ftDdhfYtmfGP0tFlBYA1";
}
```

To find other voice IDs:
1. Go to [Eleven Labs Voice Library](https://elevenlabs.io/voice-library)
2. Select a voice you like
3. Click "Clone Voice" or check the URL which contains the voice ID

#### Voice Parameters

Voice quality parameters can be customized in the same file:

```typescript
private voicePreference: VoicePreference = {
  gender: 'female',        // 'male' or 'female'
  accent: 'Indian',        // 'American', 'British', 'Indian', etc.
  variation: true,         // Enable subtle variations for natural speech
  stability: 0.5,          // 0-1, higher is more stable, lower is more expressive
  similarity_boost: 0.75,  // 0-1, clarity and similarity to original voice
  style: 0.5,              // 0-1, style amount
  use_speaker_boost: true  // Improves quality for non-standard English
};
```

#### Voice Behavior Control

The application's voice behavior can be modified in `client/src/hooks/useChatbot.tsx`:

1. **Auto-speaking** (currently disabled): To re-enable automatic speaking when receiving messages, modify the `useEffect` hook that responds to message changes:

```typescript
// Scroll to bottom of messages when messages change
useEffect(() => {
  scrollToBottom();
  
  // Only speak the most recent assistant message when it's newly added
  const lastMessage = messages[messages.length - 1];
  if (lastMessage && lastMessage.role === 'assistant' && !isLoading) {
    // Use more natural speech with Eleven Labs
    // Adding a small delay to allow UI to finish rendering
    setTimeout(() => {
      elevenLabsService.speak(lastMessage.content);
    }, 300);
  }
}, [messages, isLoading]);
```

### LLM Configuration

The application uses Groq API for generating AI responses. The configuration can be customized in `server/services/openai.ts`.

#### Model Selection

The service tries multiple Groq models in order of preference:

```typescript
// Models to try in order of preference (first is primary, others are fallbacks)
const models = ["llama3-8b-8192", "mixtral-8x7b-32768", "gemma-7b-it"];
```

To change these models or their priority:
1. Edit the `models` array in the `generateChatResponse` function
2. Add new models from Groq's offerings or remove ones you don't want to use
3. The system will automatically try each model in sequence until one works

#### Response Parameters

You can adjust the AI response parameters:

```typescript
body: JSON.stringify({
  model: currentModel,
  messages: messages,
  max_tokens: 500,      // Maximum length of response
  temperature: 0.7      // Creativity level (higher = more creative, lower = more deterministic)
})
```

#### System Prompt

To change the AI's personality or behavior, modify the system message:

```typescript
const systemMessage = {
  role: "system",
  content: "You are a helpful medical front desk assistant. Be professional, concise, and friendly. " +
           "Your primary goal is to help patients with their medical queries and tasks."
};
```

## Deployment Guide for Vercel

### Prerequisites

1. [GitHub](https://github.com/) account
2. [Vercel](https://vercel.com/) account (free tier available)
3. [Groq API key](https://console.groq.com/) for AI responses
4. [Eleven Labs API key](https://elevenlabs.io/) for voice synthesis

### Step 1: Prepare Your Repository

1. Push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/medical-assistant.git
git push -u origin main
```

### Step 2: Set Up Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" > "Project"
3. Import your GitHub repository
4. Set the following configuration:

   - **Framework Preset**: Custom (Build Command)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
   - **Root Directory**: `./` (default)

5. Under "Environment Variables", add the following:
   - `GROQ_API_KEY` = your_groq_api_key
   - `ELEVEN_LABS_API_KEY` = your_eleven_labs_api_key
   - `VITE_APP_VERSION` = 1.0.0 (or your current version)

6. Click "Deploy"

### Step 3: Verify Deployment

1. After deployment is complete, click on the generated domain URL
2. Test the chat functionality and voice responses
3. If there are any issues, check the Vercel logs for troubleshooting

### Step 4: Custom Domain (Optional)

1. In your Vercel project, go to "Settings" > "Domains"
2. Add your custom domain and follow the verification steps

## Development Guide

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Project Structure

- `/client` - Frontend React application
  - `/src/components` - React components
  - `/src/context` - Context providers for state management
  - `/src/hooks` - Custom React hooks
  - `/src/services` - Service layers for API interaction
  - `/src/types` - TypeScript type definitions
- `/server` - Backend Express server
  - `/services` - Backend services
- `/shared` - Shared code between client and server

## Troubleshooting

### Common Issues:

1. **Voice Not Working**: Ensure your Eleven Labs API key is valid and has enough credits
2. **AI Responses Not Working**: Verify your Groq API key and check the server logs
3. **Deployment Errors**: Check Vercel build logs for specific errors

### Support

For additional support, please open an issue on the GitHub repository or contact the project maintainers.

## License

This project is licensed under the MIT License - see the LICENSE file for details.