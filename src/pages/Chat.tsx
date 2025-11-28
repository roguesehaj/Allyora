import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  type: "canned" | "expert";
}

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi! I'm your cycle assistant. Ask me about periods, symptoms, or your health. Type 'help' for suggestions.",
      sender: "assistant",
      type: "canned",
    },
  ]);
  const [input, setInput] = useState("");

  const cannedResponses: Record<string, string> = {
    pain: "For period pain, try heat therapy (heating pad), gentle exercise like yoga, and anti-inflammatory foods. If pain is severe, consult a doctor.",
    cramps: "Cramps are common. Try: heat pads, magnesium-rich foods, gentle stretching, and staying hydrated. Consult a doctor if cramps are debilitating.",
    irregular: "Irregular cycles can be caused by stress, diet, PCOS, or other factors. Track your cycles and symptoms. Consider booking a teleconsult for personalized advice.",
    pcos: "PCOS (Polycystic Ovary Syndrome) often causes irregular periods, weight gain, and acne. Lifestyle changes and medication can help. Would you like to book a doctor consultation?",
    fertility: "Fertility is affected by cycle regularity, age, health conditions, and lifestyle. Track ovulation for best results. Speak to a specialist for personalized guidance.",
    spotting: "Spotting between periods can be normal but may indicate hormonal changes, stress, or health conditions. If persistent, consult a doctor.",
    mood: "Mood swings are common during PMS due to hormonal changes. Exercise, sleep, and stress management help. If severe, consider professional support.",
    help: "I can help with: period pain, irregular cycles, PCOS, fertility, spotting, mood swings, and general cycle questions. You can also book a doctor consultation!",
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: "user",
      type: "canned",
    };

    setMessages((prev) => [...prev, userMessage]);

    // Check for keywords
    const lowerInput = input.toLowerCase();
    let response = "I'm not sure about that. Could you rephrase? Or type 'help' for suggestions.";
    let responseType: "canned" | "expert" = "canned";

    for (const [keyword, reply] of Object.entries(cannedResponses)) {
      if (lowerInput.includes(keyword)) {
        response = reply;
        break;
      }
    }

    // Check if user wants expert help
    if (lowerInput.includes("doctor") || lowerInput.includes("consult") || lowerInput.includes("expert")) {
      responseType = "expert";
      response = "I recommend speaking with a healthcare expert. Would you like to book a teleconsult?";
    }

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        sender: "assistant",
        type: responseType,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 500);

    setInput("");
  };

  const handleBookConsult = () => {
    navigate("/book");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto flex flex-col h-screen">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Chat Assistant</h1>
          <p className="text-sm text-muted-foreground">Ask me anything about your cycle</p>
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
                {message.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div className={`flex-1 ${message.sender === "user" ? "text-right" : ""}`}>
                <Card
                  className={`inline-block p-3 ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                </Card>
                {message.sender === "assistant" && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {message.type === "canned" ? "Auto-reply" : "Expert needed"}
                  </Badge>
                )}
              </div>
            </div>
          ))}
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
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your message..."
              className="rounded-full"
            />
            <Button size="icon" className="rounded-full" onClick={handleSend}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Chat;
