import { useNavigate } from "react-router-dom";
import { getCurrentUser, exportUserData, deleteUserData, clearCurrentUser } from "@/lib/mockDb";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Download, Trash2, Shield, Globe } from "lucide-react";
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

const Settings = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    const userId = getCurrentUser();
    if (!userId) return;

    const data = exportUserData(userId);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `allyora-data-${userId}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleDelete = () => {
    const userId = getCurrentUser();
    if (!userId) return;

    deleteUserData(userId);
    clearCurrentUser();
    toast.success("All data deleted");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto p-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings & Privacy</h1>
          <p className="text-muted-foreground">Manage your data and preferences</p>
        </div>

        <Card className="divide-y">
          <button
            className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
            onClick={handleExport}
          >
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Download className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium">Export Your Data</h3>
              <p className="text-sm text-muted-foreground">Download all your data as JSON</p>
            </div>
          </button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full p-4 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left">
                <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center">
                  <Trash2 className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Delete All Data</h3>
                  <p className="text-sm text-muted-foreground">Permanently remove your data</p>
                </div>
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account data
                  including all period logs, quiz responses, and bookings.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                  Delete Everything
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex gap-3">
            <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium">Privacy Promise</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Your data is stored locally on your device. Allyora does not sell or share your
                personal health information with third parties. All data is encrypted and secure.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex gap-3">
            <Globe className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="font-medium">Language</h3>
              <p className="text-sm text-muted-foreground">
                Currently: English (with Hindi translations)
              </p>
            </div>
          </div>
        </Card>

        <div className="text-center pt-4">
          <p className="text-xs text-muted-foreground">
            Allyora v1.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
