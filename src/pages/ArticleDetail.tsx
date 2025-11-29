import { useParams, useNavigate } from "react-router-dom";
import { articles } from "@/data/articles";
import { getApprovedDoctorArticles } from "@/lib/mockDb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Clock, Stethoscope } from "lucide-react";
import type { Article } from "@/data/articles";
import type { DoctorArticle } from "@/types";

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Check regular articles first
  let article: Article | null = articles.find((a) => a.id === id) || null;
  
  // If not found, check doctor articles
  if (!article) {
    const doctorArticles = getApprovedDoctorArticles();
    const doctorArticle = doctorArticles.find((a) => a.id === id);
    if (doctorArticle) {
      article = {
        id: doctorArticle.id,
        title: doctorArticle.title,
        category: doctorArticle.category,
        readTime: doctorArticle.readTime,
        image: doctorArticle.image,
        excerpt: doctorArticle.excerpt,
        content: doctorArticle.content,
        author: doctorArticle.author,
        isDoctorApproved: true,
      };
    }
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-muted-foreground">Article not found</p>
          <Button className="mt-4" onClick={() => navigate("/articles")}>
            Back to Articles
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto p-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate("/articles")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6 pb-8">
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10 text-5xl mx-auto">
            {article.image}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Badge variant="secondary">{article.category}</Badge>
              {article.isDoctorApproved && (
                <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                  <Stethoscope className="w-3 h-3 mr-1" />
                  Doctor Approved
                </Badge>
              )}
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {article.readTime} min read
              </div>
            </div>

            <h1 className="text-3xl font-bold text-center">{article.title}</h1>
            
            {article.author && (
              <div className="text-center">
                <p className="text-sm font-medium">{article.author.name}</p>
                <p className="text-xs text-muted-foreground">
                  {article.author.credentials}
                  {article.author.specialization && ` • ${article.author.specialization}`}
                </p>
              </div>
            )}
          </div>

          <p className="text-muted-foreground text-center">{article.excerpt}</p>
        </Card>

        <Card className="p-6">
          <div className="prose prose-sm max-w-none">
            {article.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4 text-foreground leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ArticleDetail;
