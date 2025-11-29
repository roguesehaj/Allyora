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
    <Card className="p-5 space-y-4 card-hover border-border/50 bg-card/50">
      <div className="flex items-start justify-between">
        <h4 className="text-sm font-semibold text-muted-foreground">{title}</h4>
        <div className={cn("p-2 rounded-lg bg-background/50", getScoreColor(score))}>
          {getIcon(score)}
        </div>
      </div>

      <div className="space-y-3">
        <div className={cn("text-3xl font-bold", getScoreColor(score))}>
          {score}
          <span className="text-lg text-muted-foreground font-normal">/100</span>
        </div>

        <div className="w-full bg-secondary/60 rounded-full h-2.5 overflow-hidden shadow-inner">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500 shadow-sm",
              score >= 60 ? "bg-destructive" : score >= 30 ? "bg-warning" : "bg-success"
            )}
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Card>
  );
}
