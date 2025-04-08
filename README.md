# Medical Front Desk Assistant

An advanced AI-powered medical virtual assistant with professional voice capabilities, designed to streamline patient interactions through an engaging and intuitive chat interface.

![Medical Assistant Demo](https://examples.replit.app/assets/medical-assistant-screenshot.png)

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Project Structure](#project-structure)
- [Configuration Options](#configuration-options)
  - [API Keys](#api-keys)
  - [Voice Configuration](#voice-configuration)
  - [AI Model Configuration](#ai-model-configuration)
  - [UI Customization](#ui-customization)
- [Development Guide](#development-guide)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running Locally](#running-locally)
  - [Testing](#testing)
- [Deployment Guide](#deployment-guide)
  - [Deploying to Vercel](#deploying-to-vercel)
  - [Custom Domain Setup](#custom-domain-setup)
  - [Environment Variables](#environment-variables)
- [Integration Guide](#integration-guide)
  - [Embedding in Existing Websites](#embedding-in-existing-websites)
  - [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Overview

The Medical Front Desk Assistant is a sophisticated chatbot designed specifically for healthcare providers. It offers a natural, conversational interface that can handle patient inquiries, schedule appointments, provide medical information, and perform various administrative tasks - all without requiring multiple screen navigation.

This application combines the power of advanced large language models with professional voice synthesis technology, creating a human-like interaction experience that's accessible through both text and voice inputs.

## Key Features

### 🤖 Intelligent Conversation
- **Natural Language Understanding**: Comprehends medical terminology and patient requests with high accuracy
- **Context-Aware Responses**: Maintains conversation history for coherent multi-turn dialogues
- **Intent Recognition**: Automatically identifies when users want to schedule appointments, search for information, or watch medical videos

### 🎙️ Professional Voice Capabilities
- **Premium Voice Synthesis**: Integrated with Eleven Labs for natural, human-like speech
- **Voice Input/Output**: Full support for voice commands and spoken responses
- **Custom Voice Settings**: Configurable voice identity, accent, stability, and style parameters

### 💻 Advanced User Interface
- **3D Avatar Visualization**: Animated 3D avatar that responds during conversations
- **Single-Page Interface**: All functionality contained within one chat interface without screen switching
- **Responsive Design**: Optimized for mobile, tablet, and desktop devices
- **Accessibility Features**: Voice controls and screen reader compatibility

### 🩺 Medical Office Functionality
- **Intelligent Appointment Scheduling**: Extracts dates, times, and appointment types automatically
- **Medical Information Lookup**: Provides accurate responses to common medical questions
- **Administrative Support**: Handles insurance questions, directions, office hours, and more

### ⚙️ Technical Advantages
- **Cost-Efficient AI**: Uses Groq API for high-quality, cost-effective AI responses
- **Multiple Model Support**: Fallback system to ensure reliable operation
- **Modular Architecture**: Easily extendable for additional features
- **Comprehensive Logging**: Detailed activity tracking for administrators

## Technical Architecture

The application is built using a modern JavaScript/TypeScript stack:

- **Frontend**: React with TypeScript, Tailwind CSS, and Shadcn UI components
- **3D Components**: Three.js for avatar visualization
- **Voice Synthesis**: Eleven Labs API for professional voice output
- **Voice Recognition**: Web Speech API for voice input
- **Backend**: Express.js server for API handling
- **AI Provider**: Groq API (LLama 3 models) for response generation
- **State Management**: React Context for application state
- **Build System**: Vite for fast development and optimized production builds

## Project Structure

```
/
├── client/                  # Frontend code
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── Avatar3D.tsx # 3D avatar visualization
│   │   │   ├── ChatBot.tsx  # Main chatbot component
│   │   │   └── ...         # Other UI components
│   │   ├── context/        # State management
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # Service API integrations
│   │   │   ├── ElevenLabsService.ts # Voice synthesis
│   │   │   └── ...         # Other services
│   │   ├── types/          # TypeScript type definitions
│   │   └── App.tsx         # Main application entry
│   └── index.html          # HTML entry point
├── server/                  # Backend code
│   ├── services/           # Backend service integrations
│   │   └── openai.ts       # AI model integration (Groq)
│   ├── index.ts            # Server entry point
│   └── routes.ts           # API route definitions
├── shared/                  # Shared code
│   └── schema.ts           # Database schema definitions
└── package.json            # Project dependencies
```

## Configuration Options

The application offers extensive configuration options to customize its behavior, appearance, and functionality.

### API Keys

API keys are required for the external services used by the application. These should be stored as environment variables:

```
GROQ_API_KEY=your_groq_api_key
ELEVEN_LABS_API_KEY=your_eleven_labs_api_key
```

#### Obtaining API Keys:

1. **Groq API Key**:
   - Create an account at [console.groq.com](https://console.groq.com/)
   - Navigate to API Keys section
   - Generate a new API key
   - Free tier includes 20M tokens per month

2. **Eleven Labs API Key**:
   - Sign up at [elevenlabs.io](https://elevenlabs.io/)
   - Go to your profile settings
   - Generate an API key
   - Free tier includes 10,000 characters per month

### Voice Configuration

#### Voice Identity

The voice ID determines which Eleven Labs voice is used for speech synthesis. The application is currently configured to use a specific voice ID:

```typescript
// File: client/src/services/ElevenLabsService.ts

// Change the fixed voice ID
private async findBestMatchingVoice(): Promise<string> {
  // Replace with your preferred voice ID from Eleven Labs
  return "ftDdhfYtmfGP0tFlBYA1";
}
```

To find other voice IDs:
1. Go to [Eleven Labs Voice Library](https://elevenlabs.io/voice-library)
2. Browse and preview available voices
3. Select a voice you like
4. The voice ID can be found in the URL when viewing a voice: 
   `https://elevenlabs.io/voice-library/[VOICE_ID]`

#### Voice Quality Parameters

Fine-tune the voice quality by adjusting these parameters in `client/src/services/ElevenLabsService.ts`:

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

Parameter explanations:
- **stability (0-1)**: Controls how consistent the voice sounds
  - Higher values (0.7-1.0): More stable, consistent voice, good for longer content
  - Lower values (0-0.3): More expressive with varied intonation, good for emotional content
  
- **similarity_boost (0-1)**: Controls how closely the output matches the original voice
  - Higher values: More similar to the original voice sample
  - Lower values: More room for model interpretation

- **style (0-1)**: Controls the amount of style to apply
  - Higher values: More stylistic elements from the original voice
  - Lower values: More neutral style

#### Voice Behavior Control

The application's voice behavior can be customized in `client/src/hooks/useChatbot.tsx`:

**Auto-speaking** (currently disabled): To enable automatic speaking of assistant messages:

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

### AI Model Configuration

The application uses the Groq API to access large language models for generating responses. Configuration for this is located in `server/services/openai.ts`.

#### Model Selection

The service is configured to try multiple models in order of preference:

```typescript
// Models to try in order of preference (first is primary, others are fallbacks)
const models = ["llama3-8b-8192", "mixtral-8x7b-32768", "gemma-7b-it"];
```

Available Groq models:
- **llama3-8b-8192**: Balanced performance and speed
- **llama3-70b-8192**: Higher quality but slower
- **mixtral-8x7b-32768**: Strong performance with larger context window
- **gemma-7b-it**: Alternative model architecture

To change models:
1. Edit the `models` array in the `generateChatResponse` function
2. Arrange models in order of preference (the system tries each until one works)

#### Response Parameters

Customize the AI response generation by modifying these parameters:

```typescript
body: JSON.stringify({
  model: currentModel,
  messages: messages,
  max_tokens: 500,      // Maximum response length (1-4096)
  temperature: 0.7      // Creativity level (0.0-1.0)
})
```

Parameter explanations:
- **max_tokens**: Maximum number of tokens in the response
  - Higher values: Longer, more detailed responses
  - Lower values: Shorter, more concise responses
  
- **temperature**: Controls randomness in responses
  - Higher values (0.7-1.0): More creative, varied responses
  - Lower values (0.0-0.3): More deterministic, focused responses

#### System Prompt

The system prompt defines the AI assistant's personality and behavior. Modify it in the `generateChatResponse` function:

```typescript
const systemMessage = {
  role: "system",
  content: "You are a helpful medical front desk assistant. Be professional, concise, and friendly. " +
           "Your primary goal is to help patients with their medical queries and tasks."
};
```

Customization suggestions:
- Add specific medical specialties your practice focuses on
- Include common procedures or services you offer
- Mention specific protocols for appointments or insurance
- Add tone and style guidelines (formal, conversational, etc.)

### UI Customization

The appearance of the chat interface can be customized by modifying the relevant CSS and component files.

#### Theme Colors

Edit the `theme.json` file to change the primary color scheme:

```json
{
  "primary": "#0ea5e9",
  "variant": "vibrant",
  "appearance": "light",
  "radius": 0.5
}
```

#### Chat Interface Layout

The main chat interface is defined in `client/src/components/ChatBot.tsx`. Key customization points:

- Header appearance and logo
- Message bubble styling
- Input area design
- Quick action buttons

#### 3D Avatar Settings

The 3D avatar can be customized in `client/src/components/Avatar3D.tsx`:

- Avatar size
- Animation settings
- Model appearance

## Development Guide

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Basic knowledge of React and TypeScript
- Accounts with Groq and Eleven Labs

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/medical-assistant.git
cd medical-assistant
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file in the root directory with your API keys
```
GROQ_API_KEY=your_groq_api_key
ELEVEN_LABS_API_KEY=your_eleven_labs_api_key
```

### Running Locally

Start the development server:
```bash
npm run dev
```

This will start both the Express backend server and the Vite development server. The application will be available at `http://localhost:5000`.

### Testing

The application includes several test scripts:

```bash
# Run frontend tests
npm run test:client

# Run backend tests
npm run test:server

# Run all tests
npm test
```

## Deployment Guide

### Deploying to Vercel

Vercel is recommended for deploying this application due to its seamless integration with Node.js and React applications.

#### Step 1: Prepare Your Repository

1. Push your code to a GitHub repository:

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/medical-assistant.git
git push -u origin main
```

#### Step 2: Set Up Vercel Project

1. Create a Vercel account at [vercel.com](https://vercel.com) if you don't have one
2. Install Vercel CLI (optional but recommended)
   ```bash
   npm install -g vercel
   ```
3. Log in to Vercel
   ```bash
   vercel login
   ```
4. Deploy from the command line (simplest approach)
   ```bash
   vercel
   ```
   
   OR
   
5. Deploy through the Vercel Dashboard
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Configure the project:
     - **Framework Preset**: Custom (Build Command)
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`
     - **Root Directory**: `./` (default)
   - Add environment variables:
     - `GROQ_API_KEY` = your_groq_api_key
     - `ELEVEN_LABS_API_KEY` = your_eleven_labs_api_key
   - Click "Deploy"

#### Step 3: Verify Deployment

1. After deployment completes, Vercel will provide a URL to your deployed application
2. Open the URL and test the chat functionality, voice synthesis, and other features
3. Check Vercel logs if you encounter any issues:
   ```bash
   vercel logs your-project-name
   ```

### Custom Domain Setup

To use a custom domain with your deployed application:

1. Purchase a domain from a domain registrar (e.g., Namecheap, GoDaddy)
2. In your Vercel project, go to "Settings" > "Domains"
3. Add your custom domain
4. Follow the instructions to verify domain ownership:
   - For most domains, you'll need to add DNS records at your domain registrar
   - Vercel provides specific instructions for each domain
5. Wait for DNS propagation (can take up to 48 hours)
6. Your application will be available at your custom domain

### Environment Variables

Ensure these environment variables are set in your Vercel project:

| Variable | Description | Required? |
|----------|-------------|-----------|
| `GROQ_API_KEY` | API key for Groq LLM service | Yes |
| `ELEVEN_LABS_API_KEY` | API key for Eleven Labs voice synthesis | Yes |
| `VITE_APP_VERSION` | Application version number | Optional |

## Integration Guide

### Embedding in Existing Websites

The Medical Assistant can be embedded into existing websites using an iframe:

```html
<iframe
  src="https://your-deployed-app.vercel.app"
  width="400"
  height="600"
  style="border: none; position: fixed; bottom: 20px; right: 20px; z-index: 1000;"
></iframe>
```

For more control, you can also create a custom integration using the application's API endpoints.

### API Endpoints

The application exposes several API endpoints that can be used for integration:

#### Chat API
```
POST /api/chat
Content-Type: application/json

{
  "message": "User message here",
  "history": [
    {"role": "user", "content": "Previous user message"},
    {"role": "assistant", "content": "Previous assistant response"}
  ]
}
```

Response:
```json
{
  "message": "Assistant response",
  "service": {
    "type": "appointment|search|video|none",
    "query": "search query if applicable",
    "data": {
      // Service-specific data
    }
  }
}
```

## Troubleshooting

### Common Issues

#### Voice Not Working
- **Symptom**: The assistant doesn't speak when expected
- **Possible Causes**:
  - Invalid or expired Eleven Labs API key
  - Insufficient credits in Eleven Labs account
  - Browser doesn't support Audio API
- **Solutions**:
  - Verify API key in environment variables
  - Check credit balance in Eleven Labs dashboard
  - Test in Chrome or Edge browser

#### AI Responses Not Generated
- **Symptom**: The assistant doesn't respond to messages
- **Possible Causes**:
  - Invalid or expired Groq API key
  - All models failing to respond
  - Network connectivity issues
- **Solutions**:
  - Verify API key in environment variables
  - Check Groq console for API status
  - Examine server logs for error messages

#### Deployment Errors
- **Symptom**: Application fails to deploy or crashes after deployment
- **Possible Causes**:
  - Missing environment variables
  - Build configuration issues
  - Incompatible dependencies
- **Solutions**:
  - Check Vercel build logs
  - Verify all environment variables are set
  - Ensure package.json has correct scripts and dependencies

### Support Resources

For additional assistance:
- Check the project's GitHub repository issues
- Contact the development team
- Refer to the official documentation for Groq and Eleven Labs

## License

This project is licensed under the MIT License - see the LICENSE file for details.

```
MIT License

Copyright (c) 2023 Medical Assistant

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```