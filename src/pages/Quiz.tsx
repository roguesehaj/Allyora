import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { quizQuestions } from "@/lib/quizQuestions";
import { QuizCard } from "@/components/QuizCard";
import { ProgressBar } from "@/components/ProgressBar";
import { createUser, setCurrentUser } from "@/lib/mockDb";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

const Quiz = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<any>({});
  const [showingSummary, setShowingSummary] = useState(false);

  const filteredQuestions = quizQuestions.filter((q) => {
    if (!q.conditional) return true;
    return answers[q.conditional.field] === q.conditional.value;
  });

  const currentQuestion = filteredQuestions[currentIndex];
  const progress = ((currentIndex + 1) / filteredQuestions.length) * 100;

  const handleAnswer = (answer: any) => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
  };

  const handleNext = () => {
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
    handleNext();
  };

  const handleFinish = () => {
    const user = createUser(answers);
    setCurrentUser(user.user_id);
    navigate("/dashboard");
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

      <div className="p-4 max-w-md mx-auto py-8">
        <QuizCard
          question={currentQuestion}
          answer={answers[currentQuestion.id]}
          onAnswer={handleAnswer}
          onNext={handleNext}
          onSkip={handleSkip}
        />
      </div>
    </div>
  );
};

export default Quiz;
