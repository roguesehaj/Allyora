import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon } from "lucide-react";
import type { Prediction } from "@/types";

interface PredictionCardProps {
  prediction: Prediction;
}

export function PredictionCard({ prediction }: PredictionCardProps) {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return "bg-success text-success-foreground";
    if (confidence >= 40) return "bg-warning text-warning-foreground";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <Card className="p-6 space-y-5 bg-gradient-to-br from-primary/8 via-primary/5 to-primary/10 border-primary/30 shadow-sm fade-in relative overflow-hidden">
      {/* Decorative gradient overlay */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -z-0" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5">
            <h3 className="font-semibold flex items-center gap-2 text-lg">
              <div className="p-1.5 rounded-lg bg-primary/15">
                <CalendarIcon className="w-4 h-4 text-primary" />
              </div>
              Next Period Prediction
            </h3>
            <p className="text-sm text-muted-foreground">Based on your cycle history</p>
          </div>
          <Badge className={`${getConfidenceColor(prediction.confidence)} shadow-sm`}>
            {prediction.confidence}% confident
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 py-5">
          <div className="text-center space-y-2 p-3 rounded-xl bg-background/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Earliest</p>
            <p className="text-2xl font-bold text-primary">{formatDate(prediction.earliest)}</p>
          </div>
          <div className="text-center space-y-2 p-3 rounded-xl bg-background/50">
            <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">Latest</p>
            <p className="text-2xl font-bold text-primary">{formatDate(prediction.latest)}</p>
          </div>
        </div>

        <div className="pt-3 border-t border-border/50">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {prediction.explanation}
          </p>
        </div>
      </div>
    </Card>
  );
}
