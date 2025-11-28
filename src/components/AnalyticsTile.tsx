import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, AlertCircle } from "lucide-react";

interface AnalyticsTileProps {
  title: string;
  score: number;
  description: string;
}

export function AnalyticsTile({ title, score, description }: AnalyticsTileProps) {
  const getScoreColor = (score: number) => {
    if (score >= 60) return "text-destructive";
    if (score >= 30) return "text-warning";
    return "text-success";
  };

  const getIcon = (score: number) => {
    if (score >= 60) return <AlertCircle className="w-5 h-5" />;
    return <TrendingUp className="w-5 h-5" />;
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className={cn(getScoreColor(score))}>{getIcon(score)}</div>
      </div>

      <div className="space-y-2">
        <div className={cn("text-3xl font-bold", getScoreColor(score))}>
          {score}
          <span className="text-lg text-muted-foreground">/100</span>
        </div>

        <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all",
              score >= 60 ? "bg-destructive" : score >= 30 ? "bg-warning" : "bg-success"
            )}
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Card>
  );
}
