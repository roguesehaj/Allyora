import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUser, getEntries } from "@/lib/mockDb";
import { predictFromHistory, predictFromQuiz, computeIrregularity, symptomIndex, checkHealthAlert, getOvulationAndFertileDates } from "@/utils/predict";
import { PredictionCard } from "@/components/PredictionCard";
import { Calendar } from "@/components/Calendar";
import { AnalyticsTile } from "@/components/AnalyticsTile";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Plus, AlertTriangle } from "lucide-react";
import type { QuizResponse, Entry, Prediction, FlowType } from "@/types";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<QuizResponse | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [irregularity, setIrregularity] = useState(0);
  const [symptomScore, setSymptomScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [healthAlert, setHealthAlert] = useState<{ shouldAlert: boolean; message: string; severity: 'low' | 'medium' | 'high' } | null>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const userId = getCurrentUser();
        if (!userId) {
          navigate("/");
          return;
        }

        const userData = getUser(userId);
        if (!userData) {
          navigate("/");
          return;
        }

        setUser(userData);
        let userEntries = getEntries(userId);
        
        // Include quiz last_period_start if it exists and isn't already an entry
        if (userData.quiz.last_period_start) {
          const quizDate = userData.quiz.last_period_start;
          const quizDateFormatted = new Date(quizDate).toISOString().slice(0, 10);
          const existsAsEntry = userEntries.some(e => e.date === quizDateFormatted);
          
          if (!existsAsEntry) {
            // Create a virtual entry for the quiz date to display on calendar
            const virtualEntry: Entry = {
              id: `quiz_entry_${quizDateFormatted}`,
              user_id: userId,
              date: quizDateFormatted,
              flow: (userData.quiz.flow_description || 'medium') as FlowType,
              pain: userData.quiz.pain || 0,
              mood: [],
              symptoms: [],
              product: 'pad',
              notes: 'Initial period date from quiz',
              created_at: new Date().toISOString(),
            };
            userEntries = [...userEntries, virtualEntry];
          }
        }
        setEntries(userEntries);

        // Calculate prediction
        const startDates = userEntries.map((e) => e.date).sort();
        let pred: Prediction | null;
        if (startDates.length >= 3) {
          pred = predictFromHistory(startDates, userData.quiz);
        } else {
          const lastStart = userData.quiz.last_period_start || null;
          pred = predictFromQuiz(userData.quiz, lastStart, startDates);
        }
        setPrediction(pred);

        // Calculate analytics
        setIrregularity(computeIrregularity(userData.quiz, startDates));
        setSymptomScore(symptomIndex(userData.quiz));
        
        // Check for health alerts
        if (pred) {
          const alert = checkHealthAlert(startDates, pred);
          setHealthAlert(alert);
        }
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
        setError(err instanceof Error ? err.message : "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
    
    // Listen for entries updates
    const handleEntriesUpdate = () => {
      loadData();
    };
    window.addEventListener('entriesUpdated', handleEntriesUpdate);
    
    return () => {
      window.removeEventListener('entriesUpdated', handleEntriesUpdate);
    };
  }, [navigate]);

  const handleAddEntry = () => {
    navigate("/entries");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <p className="text-destructive font-medium">Error loading dashboard</p>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </div>
    );
  }

  if (!user || !prediction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-5">
        {/* Header */}
        <div className="py-6 flex items-center justify-between fade-in">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
              Welcome back, {user.quiz?.name || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground text-sm">Here is your cycle overview</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors"
            onClick={() => navigate("/settings")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </Button>
        </div>

        {/* Health Alert */}
        {healthAlert && healthAlert.shouldAlert && (
          <Alert 
            className={`fade-in ${
              healthAlert.severity === 'high' 
                ? 'border-destructive/50 bg-destructive/10 shadow-sm' 
                : healthAlert.severity === 'medium'
                ? 'border-warning/50 bg-warning/10 shadow-sm'
                : 'border-primary/50 bg-primary/10 shadow-sm'
            }`}
          >
            <AlertTriangle className={`h-4 w-4 ${
              healthAlert.severity === 'high' 
                ? 'text-destructive' 
                : healthAlert.severity === 'medium'
                ? 'text-warning'
                : 'text-primary'
            }`} />
            <AlertTitle className="font-semibold">
              {healthAlert.severity === 'high' 
                ? 'Health Recommendation' 
                : healthAlert.severity === 'medium'
                ? 'Cycle Irregularity Notice'
                : 'Cycle Update'}
            </AlertTitle>
            <AlertDescription className="mt-1">{healthAlert.message}</AlertDescription>
            <div className="mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/book")}
                className="rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                Book Doctor Consultation
              </Button>
            </div>
          </Alert>
        )}

        {/* Prediction Card */}
        <PredictionCard prediction={prediction} />

        {/* Calendar */}
        <Calendar entries={entries} prediction={prediction} />

        {/* Analytics */}
        <div className="grid grid-cols-2 gap-4">
          <AnalyticsTile
            title="Cycle Irregularity"
            score={irregularity}
            description={
              irregularity > 50
                ? "High variability detected"
                : irregularity > 30
                ? "Moderate irregularity"
                : "Regular cycles"
            }
          />
          <AnalyticsTile
            title="Symptom Severity"
            score={symptomScore}
            description={
              symptomScore > 60
                ? "Consider tracking more"
                : symptomScore > 30
                ? "Moderate symptoms"
                : "Mild symptoms"
            }
          />
        </div>

        {/* FAB */}
        <Button
          size="icon"
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-glow-lg hover:shadow-glow hover:scale-110 transition-all duration-300 z-40"
          onClick={handleAddEntry}
        >
          <Plus className="w-6 h-6" />
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
