import { useState, useEffect } from "react";
import { articles } from "@/data/articles";
import { getApprovedDoctorArticles, ensureDoctorArticlesSeeded } from "@/lib/mockDb";
import { BottomNav } from "@/components/BottomNav";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Article } from "@/data/articles";
import type { DoctorArticle } from "@/types";

const Articles = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "doctors">("all");
  const [doctorArticles, setDoctorArticles] = useState<DoctorArticle[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure demo articles are seeded
    ensureDoctorArticlesSeeded();
    // Load approved doctor articles
    const approved = getApprovedDoctorArticles();
    setDoctorArticles(approved);
  }, []);

  const categories = ["All", "Menstrual Health", "Sleep", "Fitness", "Nutrition"];

  const filteredArticles = selectedCategory && selectedCategory !== "All"
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  const filteredDoctorArticles = selectedCategory && selectedCategory !== "All"
    ? doctorArticles.filter((a) => a.category === selectedCategory)
    : doctorArticles;

  // Convert DoctorArticle to Article format for ArticleCard
  const convertDoctorArticle = (docArticle: DoctorArticle): Article => ({
    id: docArticle.id,
    title: docArticle.title,
    category: docArticle.category,
    readTime: docArticle.readTime,
    image: docArticle.image,
    excerpt: docArticle.excerpt,
    content: docArticle.content,
    author: docArticle.author,
    isDoctorApproved: true,
  });

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-5">
        <div className="py-6 flex items-center justify-between fade-in">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Health Articles
            </h1>
            <p className="text-muted-foreground text-sm">Learn more about your cycle</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="rounded-full"
              onClick={() => navigate("/articles/admin")}
              title="Article Moderation"
            >
              <Shield className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              onClick={() => navigate("/articles/submit")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Submit Article
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "all" | "doctors")} className="fade-in">
          <TabsList className="grid w-full grid-cols-2 bg-secondary/50">
            <TabsTrigger value="all" className="transition-all">All Articles</TabsTrigger>
            <TabsTrigger value="doctors" className="transition-all">
              Doctor Approved
              {doctorArticles.length > 0 && (
                <Badge variant="secondary" className="ml-2 bg-primary/20 text-primary border-primary/30">
                  {doctorArticles.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-5 mt-5">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"}
                  size="sm"
                  className="rounded-full whitespace-nowrap transition-all hover:scale-105"
                  onClick={() => setSelectedCategory(category === "All" ? null : category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {filteredArticles.map((article, index) => (
                <div key={article.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                  <ArticleCard article={article} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="doctors" className="space-y-5 mt-5">
            <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"}
                  size="sm"
                  className="rounded-full whitespace-nowrap transition-all hover:scale-105"
                  onClick={() => setSelectedCategory(category === "All" ? null : category)}
                >
                  {category}
                </Button>
              ))}
            </div>

            {filteredDoctorArticles.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground fade-in">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-primary/50" />
                </div>
                <p className="text-lg font-medium mb-2">No approved doctor articles yet</p>
                <p className="text-sm">Check back soon for expert insights from healthcare professionals.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredDoctorArticles.map((article, index) => (
                  <div key={article.id} className="fade-in" style={{ animationDelay: `${index * 0.05}s` }}>
                    <ArticleCard article={convertDoctorArticle(article)} />
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
};

export default Articles;
