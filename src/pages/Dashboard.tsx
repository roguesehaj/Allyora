import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getUser, getEntries } from "@/lib/mockDb";
import { predictFromHistory, predictFromQuiz, computeIrregularity, symptomIndex } from "@/utils/predict";
import { PredictionCard } from "@/components/PredictionCard";
import { Calendar } from "@/components/Calendar";
import { AnalyticsTile } from "@/components/AnalyticsTile";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [prediction, setPrediction] = useState<any>(null);
  const [irregularity, setIrregularity] = useState(0);
  const [symptomScore, setSymptomScore] = useState(0);

  useEffect(() => {
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
    const userEntries = getEntries(userId);
    setEntries(userEntries);

    // Calculate prediction
    const startDates = userEntries.map((e: any) => e.date).sort();
    let pred;
    if (startDates.length >= 3) {
      pred = predictFromHistory(startDates, userData.quiz);
    } else {
      const lastStart = userData.quiz.last_period_start || null;
      pred = predictFromQuiz(userData.quiz, lastStart);
    }
    setPrediction(pred);

    // Calculate analytics
    setIrregularity(computeIrregularity(userData.quiz));
    setSymptomScore(symptomIndex(userData.quiz));
  }, [navigate]);

  const handleAddEntry = () => {
    navigate("/entries");
  };

  if (!user || !prediction) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        {/* Header */}
        <div className="py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {user.quiz?.name || 'there'}! 👋
            </h1>
            <p className="text-muted-foreground">Here is your cycle overview</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
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
          className="fixed bottom-24 right-6 w-14 h-14 rounded-full shadow-lg"
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
