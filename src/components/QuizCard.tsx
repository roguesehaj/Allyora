import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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

export function QuizCard({
  question,
  answer,
  onAnswer,
  onNext,
  onSkip,
}: QuizCardProps) {
  const isAnswered = answer !== undefined && answer !== null && answer !== "";
  const cardRef = useRef<HTMLDivElement>(null);

  // Handle Enter key globally for the card
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle Enter key
      if (e.key !== "Enter") return;

      // Don't trigger if user is typing in an input (let it handle Enter normally)
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return;
      }

      // Prevent default behavior
      e.preventDefault();

      // Check if we can proceed
      if (question.required && !isAnswered) {
        return; // Can't proceed if required and not answered
      }

      // Proceed to next
      onNext();
    };

    const cardElement = cardRef.current;
    if (cardElement) {
      cardElement.addEventListener("keydown", handleKeyDown);
      return () => {
        cardElement.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [question.required, isAnswered, onNext]);

  const renderInput = () => {
    switch (question.type) {
      case "number":
        return (
          <Input
            type="number"
            value={answer || ""}
            onChange={(e) => onAnswer(Number(e.target.value))}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = Number((e.target as HTMLInputElement).value);
                const hasValue =
                  !isNaN(value) &&
                  value !== 0 &&
                  value !== null &&
                  value !== undefined;
                if (question.required && !hasValue) {
                  return;
                }
                onNext();
              }
            }}
            placeholder="Enter number"
            className="text-lg"
            autoFocus
          />
        );

      case "text":
        return (
          <Input
            type="text"
            value={answer || ""}
            onChange={(e) => onAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                const value = (e.target as HTMLInputElement).value.trim();
                const hasValue =
                  value !== "" && value !== null && value !== undefined;
                if (question.required && !hasValue) {
                  return;
                }
                onNext();
              }
            }}
            placeholder="Type your answer"
            className="text-lg"
            autoFocus
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
                {answer ? (
                  format(new Date(answer), "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={answer ? new Date(answer) : undefined}
                onSelect={(date) =>
                  date && onAnswer(format(date, "yyyy-MM-dd"))
                }
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onAnswer(option.value);
                  }
                }}
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    const checked = multiAnswer.includes(option.value);
                    if (checked) {
                      onAnswer(
                        multiAnswer.filter((v: string) => v !== option.value)
                      );
                    } else {
                      onAnswer([...multiAnswer, option.value]);
                    }
                  }
                }}
                tabIndex={0}
              >
                <Checkbox
                  checked={multiAnswer.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onAnswer([...multiAnswer, option.value]);
                    } else {
                      onAnswer(
                        multiAnswer.filter((v: string) => v !== option.value)
                      );
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
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onAnswer(option.value);
                  }
                }}
              >
                <span className="text-3xl">{option.image}</span>
                <span className="text-sm">{option.label}</span>
              </Button>
            ))}
          </div>
        );

      case "checkbox":
        return (
          <label
            className="flex items-start gap-3 p-4 rounded-2xl border cursor-pointer"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onAnswer(answer !== true);
              }
            }}
            tabIndex={0}
          >
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
    <Card
      ref={cardRef}
      className="p-6 space-y-6 animate-fade-in shadow-lg"
      tabIndex={0}
    >
      {question.type !== "checkbox" && (
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold leading-tight">
            {question.question}
          </h2>
          {question.questionHindi && (
            <p className="text-sm text-muted-foreground">
              {question.questionHindi}
            </p>
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
