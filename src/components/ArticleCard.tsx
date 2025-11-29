import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Stethoscope } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="p-5 cursor-pointer card-hover group overflow-hidden relative"
      onClick={() => navigate(`/article/${article.id}`)}
    >
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="flex gap-4 relative z-10">
        <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 flex items-center justify-center text-3xl group-hover:scale-105 transition-transform duration-300 shadow-sm">
          {article.image}
        </div>
        <div className="flex-1 space-y-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight text-base group-hover:text-primary transition-colors duration-200 line-clamp-2">
              {article.title}
            </h3>
            <Badge variant="secondary" className="text-xs whitespace-nowrap flex-shrink-0 bg-secondary/80">
              <Clock className="w-3 h-3 mr-1" />
              {article.readTime}min
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className="text-xs border-border/50">
              {article.category}
            </Badge>
            {article.isDoctorApproved && (
              <Badge variant="default" className="text-xs bg-primary/15 text-primary border-primary/30 hover:bg-primary/20 transition-colors">
                <Stethoscope className="w-3 h-3 mr-1" />
                Doctor Approved
              </Badge>
            )}
            {article.author && (
              <Badge variant="secondary" className="text-xs bg-secondary/60">
                {article.author.name}, {article.author.credentials}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
