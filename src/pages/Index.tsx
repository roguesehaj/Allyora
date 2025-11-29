import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { getAllUsers, setCurrentUser } from "@/lib/mockDb";
import { useEffect, useState } from "react";
import { Sparkles, Calendar, TrendingUp } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/40 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      <div className="max-w-md w-full space-y-6 fade-in relative z-10">
        {/* Logo/Brand */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center mb-4 animate-bounce-subtle">
            <img src="/logo.png" alt="Allyora Logo" className="w-48 h-18 drop-shadow-sm" />
          </div>
          <p className="text-muted-foreground text-sm font-medium">Your Menstrual Ally</p>
        </div>

        {/* Main CTA Card */}
        <Card className="p-6 space-y-4 shadow-glow-lg card-hover border-primary/10">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <div className="p-2 rounded-xl bg-primary/10">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              Start Your Journey
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Take our personalized quiz to get cycle predictions, track your periods, and receive health insights.
            </p>
          </div>
          
          <Button 
            className="w-full rounded-full h-12 text-base font-medium shadow-glow hover:shadow-glow-lg hover:scale-[1.02] transition-all duration-300"
            onClick={handleStartQuiz}
          >
            Begin Quiz
          </Button>
        </Card>

        {/* Features */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center space-y-2 group">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Calendar className="w-7 h-7 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Track Cycles</p>
          </div>
          <div className="text-center space-y-2 group">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <TrendingUp className="w-7 h-7 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Get Predictions</p>
          </div>
          <div className="text-center space-y-2 group">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
              <Sparkles className="w-7 h-7 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">Expert Chat</p>
          </div>
        </div>

        {/* Demo Users */}
        {demoUsers.length > 0 && (
          <Card className="p-5 space-y-3 border-dashed border-primary/20 bg-secondary/30">
            <p className="text-xs text-muted-foreground text-center font-medium">
              Quick Demo Access
            </p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <Button
                  key={user.user_id}
                  variant="outline"
                  className="w-full justify-start text-sm rounded-full hover:bg-primary/10 hover:text-primary hover:border-primary/30 transition-colors"
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
