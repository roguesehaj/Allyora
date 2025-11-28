import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, TrendingUp } from "lucide-react";

interface PredictionCardProps {
  prediction: {
    earliest: string;
    latest: string;
    confidence: number;
    explanation: string;
    irregularity: number;
  };
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
    <Card className="p-6 space-y-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h3 className="font-semibold flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-primary" />
            Next Period Prediction
          </h3>
          <p className="text-sm text-muted-foreground">Based on your cycle history</p>
        </div>
        <Badge className={getConfidenceColor(prediction.confidence)}>
          {prediction.confidence}% confident
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 py-4">
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Earliest</p>
          <p className="text-2xl font-bold text-primary">{formatDate(prediction.earliest)}</p>
        </div>
        <div className="text-center space-y-1">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Latest</p>
          <p className="text-2xl font-bold text-primary">{formatDate(prediction.latest)}</p>
        </div>
      </div>

      <div className="pt-2 border-t border-border/50">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {prediction.explanation}
        </p>
      </div>
    </Card>
  );
}
