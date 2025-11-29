import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { quizQuestions } from "@/lib/quizQuestions";
import { QuizCard } from "@/components/QuizCard";
import { ProgressBar } from "@/components/ProgressBar";
import { createUser, setCurrentUser } from "@/lib/mockDb";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import type { UserQuiz } from "@/types";
import { toast } from "sonner";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Partial<UserQuiz>>({});
  const [showingSummary, setShowingSummary] = useState(false);

  const filteredQuestions = useMemo(() => {
    return quizQuestions.filter((q) => {
      if (!q.conditional) return true;
      return answers[q.conditional.field] === q.conditional.value;
    });
  }, [answers]);

  // Reset index if it becomes invalid after filtering
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length && filteredQuestions.length > 0) {
      setCurrentIndex(Math.max(0, filteredQuestions.length - 1));
    }
  }, [filteredQuestions.length, currentIndex]);

  const currentQuestion = filteredQuestions[currentIndex];
  const progress = filteredQuestions.length > 0 
    ? ((currentIndex + 1) / filteredQuestions.length) * 100 
    : 0;

  const handleAnswer = (answer: string | string[] | number | null) => {
    if (!currentQuestion) return;
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = () => {
    if (!currentQuestion) return;
    
    // Check if required question is answered
    if (currentQuestion.required && !answers[currentQuestion.id]) {
      toast.error("This question is required");
      return;
    }

    if (currentIndex < filteredQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowingSummary(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else {
      navigate("/");
    }
  };

  const handleSkip = () => {
    if (currentQuestion?.required) {
      toast.error("This question is required and cannot be skipped");
      return;
    }
    handleNext();
  };

  const handleFinish = () => {
    try {
      const user = createUser(answers as UserQuiz);
      setCurrentUser(user.user_id);
      navigate("/dashboard");
    } catch (error) {
      console.error("Failed to create user:", error);
      toast.error(error instanceof Error ? error.message : "Failed to save quiz responses");
    }
  };

  if (showingSummary) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 animate-scale-in">
          <div className="text-center space-y-4">
            <div className="text-6xl animate-bounce-subtle">✨</div>
            <h2 className="text-2xl font-bold">Quiz Complete!</h2>
            <p className="text-muted-foreground">
              Great work! We have gathered your responses. Let us create your personalized cycle dashboard.
            </p>
          </div>
          
          <Button 
            className="w-full rounded-full h-12"
            onClick={handleFinish}
          >
            Save & Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="p-4">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={handleBack}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {filteredQuestions.length}
              </p>
            </div>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>

      {currentQuestion && (
        <div className="p-4 max-w-md mx-auto py-8">
          <QuizCard
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onAnswer={handleAnswer}
            onNext={handleNext}
            onSkip={handleSkip}
          />
        </div>
      )}
    </div>
  );
};

export default Quiz;
