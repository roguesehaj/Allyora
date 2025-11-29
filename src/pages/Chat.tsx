import { useState, useRef, useEffect } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Send, Bot, User, Loader2, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getChatResponse, getFallbackResponse, type ChatMessage } from "@/lib/openrouter";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  type: "ai" | "expert";
  timestamp: number;
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your AI cycle assistant. Ask me anything about periods, symptoms, cycle tracking, or your menstrual health. I'm here to help!",
      sender: "assistant",
      type: "ai",
      timestamp: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [useAI, setUseAI] = useState(true); // Always use AI model
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: "user",
      type: "ai",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    setApiError(null);

    // Check if user wants expert help
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("doctor") || lowerInput.includes("consult") || lowerInput.includes("expert") || lowerInput.includes("book")) {
      setIsLoading(false);
      const expertMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I recommend speaking with a healthcare expert for personalized medical advice. Would you like to book a teleconsult?",
        sender: "assistant",
        type: "expert",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, expertMessage]);
      return;
    }

    try {
      // Build conversation history for context
      const conversationHistory: ChatMessage[] = messages
        .filter((msg) => msg.sender === "assistant" || msg.sender === "user")
        .slice(-10) // Keep last 10 messages for context
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      // Always use AI - no fallback mode
      let response: string;
      let responseType: "ai" | "expert" = "ai";

      try {
        response = await getChatResponse(conversationHistory, userMessage.text);
        responseType = "ai";
        setApiError(null); // Clear any previous errors on success
      } catch (error) {
        console.error("AI API failed:", error);
        if (error instanceof Error) {
          const errorMsg = error.message;
          setApiError(errorMsg);
          if (errorMsg.includes("API key") || errorMsg.includes("Invalid")) {
            toast.error("Invalid API key. Check your .env file and restart server.");
            response = "I'm sorry, I need a valid API key to respond. Please configure VITE_OPENROUTER_API_KEY in your .env file and restart the server.";
          } else if (errorMsg.includes("Rate limit") || errorMsg.includes("429")) {
            toast.error("Rate limit exceeded. Please try again in a moment.");
            response = "I'm experiencing high demand right now. Please try again in a few moments.";
          } else if (errorMsg.includes("credits") || errorMsg.includes("402")) {
            toast.error("Insufficient credits. Please add credits to your OpenRouter account.");
            response = "I need credits to continue. Please add credits to your OpenRouter account.";
          } else if (errorMsg.includes("Network") || errorMsg.includes("connection")) {
            toast.error("Network error. Check your internet connection.");
            response = "I'm having trouble connecting. Please check your internet connection and try again.";
          } else {
            toast.error(`AI error: ${errorMsg}`);
            response = `I encountered an error: ${errorMsg}. Please try again or check your API configuration.`;
          }
        } else {
          toast.error("AI service unavailable. Please try again.");
          response = "I'm sorry, I'm having technical difficulties. Please try again in a moment.";
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "assistant",
        type: responseType,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error getting chat response:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I encountered an error. Please try again or consider booking a consultation with a healthcare professional.",
        sender: "assistant",
        type: "fallback",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBookConsult = () => {
    navigate("/book");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto flex flex-col h-screen">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Chat Assistant</h1>
              <p className="text-sm text-muted-foreground">
                AI-powered cycle assistant
              </p>
            </div>
          </div>
          {apiError && (
            <Alert className="mt-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">{apiError}</AlertDescription>
            </Alert>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                }`}
              >
                {message.sender === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={`flex-1 ${message.sender === "user" ? "text-right" : ""}`}>
                <Card
                  className={`inline-block p-3 max-w-[85%] ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </Card>
                {message.sender === "assistant" && (
                  <Badge
                    variant="secondary"
                    className="text-xs mt-1"
                  >
                    {message.type === "expert"
                      ? "Expert Recommended"
                      : "AI"}
                  </Badge>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-secondary">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <Card className="inline-block p-3 bg-card">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </Card>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t space-y-2">
          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={handleBookConsult}
          >
            Book Doctor Consultation
          </Button>
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Type your message..."
              className="rounded-full"
              disabled={isLoading}
            />
            <Button
              size="icon"
              className="rounded-full"
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;
