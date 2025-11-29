// OpenRouter API - Access to multiple AI models with better CORS support
// Get API key from: https://openrouter.ai/keys

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || '';

// System prompt for the menstrual health assistant
const SYSTEM_PROMPT = `You are a helpful and empathetic menstrual health assistant for Allyora, a menstrual health tracking app. Your role is to:

1. Provide accurate, evidence-based information about menstrual health, cycles, symptoms, and related topics
2. Be supportive, non-judgmental, and understanding
3. Encourage users to consult healthcare professionals for serious concerns
4. Reference the app's features (tracking, predictions, articles, teleconsult booking) when relevant
5. Keep responses concise but informative (2-3 sentences when possible, up to 5 for complex topics)
6. Use a warm, friendly, and professional tone

Topics you can help with:
- Period tracking and cycle predictions
- Menstrual symptoms (cramps, pain, mood swings, etc.)
- Cycle irregularities
- PCOS and other reproductive health conditions
- Fertility and ovulation
- PMS and PMDD
- General menstrual health questions

If a user asks about serious symptoms or needs medical advice, always recommend consulting a healthcare professional and suggest booking a teleconsult through the app.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function getChatResponse(
  messages: ChatMessage[],
  userMessage: string
): Promise<string> {
  try {
    // Check if API key is configured
    if (!OPENROUTER_API_KEY || OPENROUTER_API_KEY.trim() === '') {
      throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your environment variables.');
    }

    // Build messages array with system prompt
    const apiMessages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: userMessage }
    ];

    const response = await fetch(OPENROUTER_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': window.location.origin, // Optional: for analytics
        'X-Title': 'Allyora - Menstrual Health Assistant', // Optional: for analytics
      },
      body: JSON.stringify({
        model: 'openai/gpt-4o-mini', // Fast and affordable model, widely available
        messages: apiMessages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        throw new Error('Invalid OpenRouter API key. Please check your VITE_OPENROUTER_API_KEY.');
      }
      if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (response.status === 402) {
        throw new Error('Insufficient credits. Please add credits to your OpenRouter account.');
      }
      throw new Error(`API error: ${response.status} ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content || 
      "I'm sorry, I couldn't generate a response. Please try again.";

    return text;
  } catch (error: any) {
    console.error('OpenRouter API error details:', error);
    
    // Handle specific errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();
      
      if (errorMessage.includes('api key') || errorMessage.includes('invalid') || errorMessage.includes('401')) {
        throw new Error('Invalid or missing OpenRouter API key. Please check your VITE_OPENROUTER_API_KEY in .env file.');
      }
      if (errorMessage.includes('rate limit') || errorMessage.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a moment.');
      }
      if (errorMessage.includes('credits') || errorMessage.includes('402')) {
        throw new Error('Insufficient credits. Please add credits to your OpenRouter account.');
      }
      if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        throw new Error('Network error. Please check your internet connection.');
      }
      
      throw new Error(`OpenRouter API error: ${error.message}`);
    }
    
    throw new Error('Failed to get response from OpenRouter. Please try again or use fallback mode.');
  }
}

// Enhanced fallback keyword-based responses
export const fallbackResponses: Record<string, string> = {
  pain: "For period pain, try heat therapy (heating pad on lower abdomen for 15-20 minutes), gentle exercise like yoga or walking, and anti-inflammatory foods like salmon and leafy greens. Magnesium supplements (200-400mg) can also help. If pain is severe or disrupts daily life, consult a doctor.",
  cramps: "Cramps are common during menstruation. Try: heat pads, magnesium-rich foods (dark chocolate, almonds, spinach), gentle stretching, staying hydrated, and herbal teas like ginger or chamomile. Consult a doctor if cramps are debilitating or getting worse.",
  irregular: "Irregular cycles can be caused by stress, diet changes, PCOS, thyroid issues, or other factors. Track your cycles and symptoms in the app. Consider booking a teleconsult for personalized advice. Lifestyle changes like regular exercise and balanced nutrition can help.",
  pcos: "PCOS (Polycystic Ovary Syndrome) often causes irregular periods, weight gain, excess hair growth, and acne. Lifestyle changes (diet, exercise), medications like birth control pills or metformin, and weight management can help. Would you like to book a doctor consultation for personalized treatment?",
  fertility: "Fertility is affected by cycle regularity, age, health conditions, and lifestyle factors. Track ovulation using the calendar feature. Maintain a healthy weight, eat balanced meals, and manage stress. Speak to a specialist for personalized guidance if you're trying to conceive.",
  spotting: "Spotting between periods can be normal (ovulation spotting) but may indicate hormonal changes, stress, or health conditions. If persistent, heavy, or accompanied by pain, consult a doctor. Track patterns in the app to share with your healthcare provider.",
  mood: "Mood swings are common during PMS due to hormonal changes. Regular exercise, adequate sleep (7-9 hours), stress management techniques, and a balanced diet can help. If mood changes are severe or affect daily life, consider professional support or booking a consultation.",
  pms: "PMS symptoms include mood swings, bloating, fatigue, and food cravings. Try: regular exercise, magnesium supplements, reducing caffeine and alcohol, getting enough sleep, and stress management. Track your symptoms in the app to identify patterns.",
  period: "Your period is a normal part of the menstrual cycle. Track your cycle in the app to understand your patterns. If you have concerns about flow, duration, or symptoms, use the tracking features and consider booking a consultation.",
  cycle: "A normal menstrual cycle is typically 21-35 days. Track your periods in the app to see your personal pattern. Irregular cycles can be caused by various factors - use the prediction feature and consult a doctor if concerned.",
  help: "I can help with: period pain, cramps, irregular cycles, PCOS, fertility, spotting, mood swings, PMS, and general cycle questions. Try asking about specific symptoms or topics. You can also book a doctor consultation for personalized medical advice!",
};

export function getFallbackResponse(input: string): string {
  const lowerInput = input.toLowerCase();
  
  for (const [keyword, reply] of Object.entries(fallbackResponses)) {
    if (lowerInput.includes(keyword)) {
      return reply;
    }
  }
  
  return "I'm not sure about that. Could you rephrase? Or type 'help' for suggestions. For personalized medical advice, consider booking a teleconsult with a healthcare professional.";
}

