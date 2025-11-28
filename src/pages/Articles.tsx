import { useState } from "react";
import { articles } from "@/data/articles";
import { BottomNav } from "@/components/BottomNav";
import { ArticleCard } from "@/components/ArticleCard";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Articles = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ["All", "Menstrual Health", "Sleep", "Fitness", "Nutrition"];

  const filteredArticles = selectedCategory && selectedCategory !== "All"
    ? articles.filter((a) => a.category === selectedCategory)
    : articles;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="py-4">
          <h1 className="text-2xl font-bold">Health Articles</h1>
          <p className="text-muted-foreground">Learn more about your cycle</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category || (category === "All" && !selectedCategory) ? "default" : "outline"}
              size="sm"
              className="rounded-full whitespace-nowrap"
              onClick={() => setSelectedCategory(category === "All" ? null : category)}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="space-y-4">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Articles;
