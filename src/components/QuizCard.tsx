import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { QuizQuestion } from "@/lib/quizQuestions";

interface QuizCardProps {
  question: QuizQuestion;
  answer: any;
  onAnswer: (answer: any) => void;
  onNext: () => void;
  onSkip: () => void;
}

export function QuizCard({ question, answer, onAnswer, onNext, onSkip }: QuizCardProps) {
  const isAnswered = answer !== undefined && answer !== null && answer !== "";

  const renderInput = () => {
    switch (question.type) {
      case "number":
        return (
          <Input
            type="number"
            value={answer || ""}
            onChange={(e) => onAnswer(Number(e.target.value))}
            placeholder="Enter number"
            className="text-lg"
          />
        );

      case "text":
        return (
          <Input
            type="text"
            value={answer || ""}
            onChange={(e) => onAnswer(e.target.value)}
            placeholder="Type your answer"
            className="text-lg"
          />
        );

      case "date":
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal rounded-2xl h-12",
                  !answer && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {answer ? format(new Date(answer), "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={answer ? new Date(answer) : undefined}
                onSelect={(date) => date && onAnswer(format(date, "yyyy-MM-dd"))}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      case "single":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <Button
                key={option.value}
                variant={answer === option.value ? "default" : "outline"}
                className="w-full justify-start rounded-2xl h-12 text-left"
                onClick={() => onAnswer(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>
        );

      case "multi":
        const multiAnswer = Array.isArray(answer) ? answer : [];
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <label
                key={option.value}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-colors",
                  multiAnswer.includes(option.value)
                    ? "bg-primary/10 border-primary"
                    : "border-border hover:bg-muted"
                )}
              >
                <Checkbox
                  checked={multiAnswer.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onAnswer([...multiAnswer, option.value]);
                    } else {
                      onAnswer(multiAnswer.filter((v: string) => v !== option.value));
                    }
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        );

      case "pictorial":
        return (
          <div className="grid grid-cols-2 gap-3">
            {question.pictorialOptions?.map((option) => (
              <Button
                key={option.value}
                variant={answer === option.value ? "default" : "outline"}
                className="h-24 flex-col gap-2 rounded-2xl"
                onClick={() => onAnswer(option.value)}
              >
                <span className="text-3xl">{option.image}</span>
                <span className="text-sm">{option.label}</span>
              </Button>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label className="flex items-start gap-3 p-4 rounded-2xl border cursor-pointer">
            <Checkbox
              checked={answer === true}
              onCheckedChange={(checked) => onAnswer(checked === true)}
            />
            <span className="text-sm leading-relaxed">{question.question}</span>
          </label>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="p-6 space-y-6 animate-fade-in shadow-lg">
      {question.type !== "checkbox" && (
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold leading-tight">{question.question}</h2>
          {question.questionHindi && (
            <p className="text-sm text-muted-foreground">{question.questionHindi}</p>
          )}
        </div>
      )}

      <div className="space-y-4">{renderInput()}</div>

      <div className="flex gap-3">
        {!question.required && (
          <Button
            variant="ghost"
            className="flex-1 rounded-full"
            onClick={onSkip}
          >
            Skip
          </Button>
        )}
        <Button
          className="flex-1 rounded-full"
          onClick={onNext}
          disabled={question.required && !isAnswered}
        >
          Next
        </Button>
      </div>
    </Card>
  );
}
