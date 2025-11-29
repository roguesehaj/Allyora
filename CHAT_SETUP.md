# Chat Assistant Setup

The chat assistant now uses **OpenRouter API** for intelligent, conversational responses about menstrual health.

## Why OpenRouter?

- ✅ **CORS-friendly** - Works directly from browser without CORS issues
- ✅ **Multiple models** - Access to OpenAI, Anthropic, Google, and more
- ✅ **Free tier available** - Some models have free tiers
- ✅ **Easy setup** - Simple API key configuration
- ✅ **Reliable** - Better uptime and support

## Setup Instructions

1. **Get an OpenRouter API Key**

   - Go to https://openrouter.ai/keys
   - Sign up or log in
   - Click "Create Key"
   - Copy your API key

2. **Configure the API Key**

   - Update your `.env` file in the root directory
   - Add your OpenRouter API key:
     ```
     VITE_OPENROUTER_API_KEY=sk-or-v1-your-api-key-here
     ```

3. **Restart the Development Server**
   - Stop the current server (Ctrl+C)
   - Run `npm run dev` again

## Available Models

The default model is `google/gemini-flash-1.5` (free tier available). You can change it in `src/lib/openrouter.ts` to:

- `openai/gpt-4o-mini` - Fast and affordable
- `anthropic/claude-3-haiku` - Good quality
- `google/gemini-flash-1.5` - Free tier (default)
- Many more options on OpenRouter

## Features

- **AI-Powered Responses**: Uses OpenRouter with multiple model options
- **Conversation Memory**: Maintains context from previous messages
- **Fallback Mode**: Automatically falls back to keyword-based responses if API is unavailable
- **Error Handling**: Graceful error handling with user-friendly messages
- **Expert Routing**: Detects when users need professional medical advice
- **CORS Support**: Works directly from browser without backend proxy

## Cost Considerations

- **Free Models**: Some models like `google/gemini-flash-1.5` have free tiers
- **Paid Models**: Others require credits (very affordable)
- **Default**: Current setup uses free tier model

## Security Note

⚠️ **Important**: The current implementation exposes the API key in the frontend. For production:

1. Create a backend API route (e.g., `/api/chat`)
2. Store the API key server-side only
3. Make requests from frontend to your backend API
4. Never expose API keys in client-side code

## Fallback Behavior

If the API key is not configured or the API fails:

- The chat will automatically use keyword-based responses
- Users will see a "Fallback Mode" badge
- All existing functionality remains available
- No API key needed for basic functionality

## Testing

1. Without API key: Chat works with keyword-based fallback
2. With API key: Chat uses AI for intelligent responses
3. Try keywords: "pain", "cramps", "irregular", "pcos", "help"
