import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Article } from "@/data/articles";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
      onClick={() => navigate(`/article/${article.id}`)}
    >
      <div className="flex gap-4">
        <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
          {article.image}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold leading-tight">{article.title}</h3>
            <Badge variant="secondary" className="text-xs whitespace-nowrap">
              <Clock className="w-3 h-3 mr-1" />
              {article.readTime}min
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
          <Badge variant="outline" className="text-xs">
            {article.category}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
