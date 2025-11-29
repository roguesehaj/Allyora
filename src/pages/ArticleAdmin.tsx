import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDoctorArticles, approveDoctorArticle, rejectDoctorArticle } from "@/lib/mockDb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Check, X, Clock, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { DoctorArticle } from "@/types";

const ArticleAdmin = () => {
  const navigate = useNavigate();
  const [pendingArticles, setPendingArticles] = useState<DoctorArticle[]>([]);
  const [approvedArticles, setApprovedArticles] = useState<DoctorArticle[]>([]);
  const [rejectedArticles, setRejectedArticles] = useState<DoctorArticle[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "rejected">("pending");

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = () => {
    const pending = getDoctorArticles("pending");
    const approved = getDoctorArticles("approved");
    const rejected = getDoctorArticles("rejected");
    setPendingArticles(pending);
    setApprovedArticles(approved);
    setRejectedArticles(rejected);
  };

  const handleApprove = (articleId: string) => {
    try {
      approveDoctorArticle(articleId);
      toast.success("Article approved successfully!");
      loadArticles();
    } catch (error) {
      toast.error("Failed to approve article");
      console.error(error);
    }
  };

  const handleReject = (articleId: string) => {
    try {
      rejectDoctorArticle(articleId);
      toast.success("Article rejected");
      loadArticles();
    } catch (error) {
      toast.error("Failed to reject article");
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderArticleCard = (article: DoctorArticle, showActions: boolean = false) => (
    <Card key={article.id} className="p-5 space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-lg">{article.title}</h3>
            <Badge variant="outline">{article.category}</Badge>
            {article.status === "approved" && (
              <Badge variant="default" className="bg-primary/20 text-primary border-primary/30">
                <Stethoscope className="w-3 h-3 mr-1" />
                Approved
              </Badge>
            )}
            {article.status === "rejected" && (
              <Badge variant="destructive">Rejected</Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground line-clamp-2">{article.excerpt}</p>
          
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {article.readTime} min read
            </div>
            <span>•</span>
            <span>Submitted: {formatDate(article.submittedAt)}</span>
            {article.approvedAt && (
              <>
                <span>•</span>
                <span>Approved: {formatDate(article.approvedAt)}</span>
              </>
            )}
          </div>

          <div className="pt-2 border-t">
            <p className="text-sm font-medium">{article.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {article.author.credentials}
              {article.author.specialization && ` • ${article.author.specialization}`}
            </p>
          </div>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-2 border-t">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Reject Article?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reject this article? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => handleReject(article.id)}
                  className="bg-destructive text-destructive-foreground"
                >
                  Reject
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <Button
            variant="default"
            size="sm"
            className="flex-1"
            onClick={() => handleApprove(article.id)}
          >
            <Check className="w-4 h-4 mr-2" />
            Approve
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto p-4">
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
              <h1 className="text-2xl font-bold">Article Moderation</h1>
              <p className="text-sm text-muted-foreground">Review and approve doctor articles</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex gap-2">
          <Button
            variant={activeTab === "pending" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("pending")}
          >
            Pending
            {pendingArticles.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {pendingArticles.length}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "approved" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("approved")}
          >
            Approved
            {approvedArticles.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {approvedArticles.length}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "rejected" ? "default" : "outline"}
            size="sm"
            className="flex-1"
            onClick={() => setActiveTab("rejected")}
          >
            Rejected
            {rejectedArticles.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {rejectedArticles.length}
              </Badge>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {activeTab === "pending" && (
            <>
              {pendingArticles.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No pending articles to review</p>
                </Card>
              ) : (
                pendingArticles.map((article) => renderArticleCard(article, true))
              )}
            </>
          )}

          {activeTab === "approved" && (
            <>
              {approvedArticles.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No approved articles yet</p>
                </Card>
              ) : (
                approvedArticles.map((article) => renderArticleCard(article, false))
              )}
            </>
          )}

          {activeTab === "rejected" && (
            <>
              {rejectedArticles.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground">No rejected articles</p>
                </Card>
              ) : (
                rejectedArticles.map((article) => renderArticleCard(article, false))
              )}
            </>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default ArticleAdmin;

