import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getAllUsers, setCurrentUser } from "@/lib/mockDb";
import { useEffect, useState } from "react";
import { Heart, Sparkles, Calendar, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [demoUsers, setDemoUsers] = useState<any[]>([]);

  useEffect(() => {
    const users = getAllUsers();
    setDemoUsers(users.slice(0, 3));
  }, []);

  const handleLoadDemoUser = (userId: string) => {
    setCurrentUser(userId);
    navigate("/dashboard");
  };

  const handleStartQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6 animate-fade-in">
        {/* Logo/Brand */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 animate-bounce-subtle">
            <Heart className="w-10 h-10 text-primary fill-primary" />
          </div>
          <h1 className="text-4xl font-bold text-foreground">Allyora</h1>
          <p className="text-muted-foreground">Your personal cycle companion</p>
        </div>

        {/* Main CTA Card */}
        <Card className="p-6 space-y-4 shadow-lg">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Start Your Journey
            </h2>
            <p className="text-sm text-muted-foreground">
              Take our personalized quiz to get cycle predictions, track your periods, and receive health insights.
            </p>
          </div>
          
          <Button 
            className="w-full rounded-full h-12 text-base font-medium"
            onClick={handleStartQuiz}
          >
            Begin Quiz
          </Button>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Track Cycles</p>
          </div>
          <div className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Get Predictions</p>
          </div>
          <div className="text-center space-y-1">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground">Expert Chat</p>
          </div>
        </div>

        {/* Demo Users */}
        {demoUsers.length > 0 && (
          <Card className="p-4 space-y-3 border-dashed">
            <p className="text-xs text-muted-foreground text-center font-medium">
              Quick Demo Access
            </p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <Button
                  key={user.user_id}
                  variant="outline"
                  className="w-full justify-start text-sm rounded-full"
                  onClick={() => handleLoadDemoUser(user.user_id)}
                >
                  Load {user.user_id.replace('_', ' ')}
                </Button>
              ))}
            </div>
          </Card>
        )}

        <p className="text-xs text-center text-muted-foreground">
          Demo prototype • Your data stays on your device
        </p>
      </div>
    </div>
  );
};

export default Index;
