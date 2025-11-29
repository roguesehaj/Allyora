import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Send } from "lucide-react";
import { submitDoctorArticle } from "@/lib/mockDb";
import { toast } from "sonner";

const ArticleSubmit = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "" as "Menstrual Health" | "Sleep" | "Fitness" | "Nutrition" | "",
    excerpt: "",
    content: "",
    image: "📝",
    readTime: "",
    authorName: "",
    authorCredentials: "",
    authorSpecialization: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.title ||
      !formData.category ||
      !formData.excerpt ||
      !formData.content ||
      !formData.authorName ||
      !formData.authorCredentials
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock doctor ID - in production, this would come from authentication
      const doctorId = `doctor_${Date.now()}`;

      const readTime =
        parseInt(formData.readTime) ||
        Math.ceil(formData.content.length / 1000);

      submitDoctorArticle(doctorId, {
        title: formData.title,
        category: formData.category as
          | "Menstrual Health"
          | "Sleep"
          | "Fitness"
          | "Nutrition",
        excerpt: formData.excerpt,
        content: formData.content,
        image: formData.image,
        readTime: readTime,
        author: {
          name: formData.authorName,
          credentials: formData.authorCredentials,
          specialization: formData.authorSpecialization || undefined,
        },
      });

      toast.success(
        "Article submitted successfully! It will be reviewed by our team."
      );
      setTimeout(() => {
        navigate("/articles");
      }, 1500);
    } catch (error) {
      console.error("Failed to submit article:", error);
      toast.error("Failed to submit article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate("/articles")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Submit Article</h1>
            <p className="text-muted-foreground text-sm">
              Share your expertise with our community
            </p>
          </div>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Article Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter article title"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value as any })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Menstrual Health">
                      Menstrual Health
                    </SelectItem>
                    <SelectItem value="Sleep">Sleep</SelectItem>
                    <SelectItem value="Fitness">Fitness</SelectItem>
                    <SelectItem value="Nutrition">Nutrition</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="readTime">Read Time (minutes)</Label>
                <Input
                  id="readTime"
                  type="number"
                  min="1"
                  value={formData.readTime}
                  onChange={(e) =>
                    setFormData({ ...formData, readTime: e.target.value })
                  }
                  placeholder="Auto-calculated if empty"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Brief summary of the article (2-3 sentences)"
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Article Content *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Write your article content here..."
                rows={12}
                required
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-4 border-t pt-4">
              <h3 className="font-semibold">Author Information</h3>

              <div className="space-y-2">
                <Label htmlFor="authorName">Full Name *</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) =>
                    setFormData({ ...formData, authorName: e.target.value })
                  }
                  placeholder="Dr. Jane Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorCredentials">Credentials *</Label>
                <Input
                  id="authorCredentials"
                  value={formData.authorCredentials}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authorCredentials: e.target.value,
                    })
                  }
                  placeholder="MD, PhD, FACOG"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorSpecialization">
                  Specialization (Optional)
                </Label>
                <Input
                  id="authorSpecialization"
                  value={formData.authorSpecialization}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      authorSpecialization: e.target.value,
                    })
                  }
                  placeholder="Reproductive Endocrinology"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/articles")}
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for Review
                  </>
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default ArticleSubmit;
