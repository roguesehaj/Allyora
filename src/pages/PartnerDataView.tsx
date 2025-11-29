import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getSharedUserData, getPartnerConnection } from "@/lib/mockDb";
import { predictFromHistory, predictFromQuiz, computeIrregularity, symptomIndex } from "@/utils/predict";
import { PredictionCard } from "@/components/PredictionCard";
import { Calendar } from "@/components/Calendar";
import { AnalyticsTile } from "@/components/AnalyticsTile";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import type { ExportedUserData, Entry, Prediction, PartnerConnection, FlowType } from "@/types";

const PartnerDataView = () => {
  const { connectionId } = useParams<{ connectionId: string }>();
  const navigate = useNavigate();
  const [connection, setConnection] = useState<PartnerConnection | null>(null);
  const [sharedData, setSharedData] = useState<ExportedUserData | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [irregularity, setIrregularity] = useState(0);
  const [symptomScore, setSymptomScore] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!connectionId) {
          setError("Invalid connection ID");
          return;
        }

        // Get connection and shared data
        const result = getSharedUserData(connectionId);
        if (!result) {
          setError("Shared data not found or access revoked");
          return;
        }

        setConnection(result.connection);
        setSharedData(result.data);

        // Process entries
        let userEntries = result.data.entries || [];
        
        // Include quiz last_period_start if available and permitted
        if (result.data.user?.quiz.last_period_start && result.connection.permissions.view_quiz) {
          const quizDate = result.data.user.quiz.last_period_start;
          const quizDateFormatted = new Date(quizDate).toISOString().slice(0, 10);
          const existsAsEntry = userEntries.some(e => e.date === quizDateFormatted);
          
          if (!existsAsEntry) {
            const virtualEntry: Entry = {
              id: `quiz_entry_${quizDateFormatted}`,
              user_id: result.data.user.user_id,
              date: quizDateFormatted,
              flow: (result.data.user.quiz.flow_description || 'medium') as FlowType,
              pain: result.data.user.quiz.pain || 0,
              mood: [],
              symptoms: [],
              product: 'pad',
              notes: 'Initial period date',
              created_at: new Date().toISOString(),
            };
            userEntries = [...userEntries, virtualEntry];
          }
        }
        setEntries(userEntries);

        // Calculate prediction if permitted
        if (result.connection.permissions.view_predictions && result.data.user) {
          const startDates = userEntries.map((e) => e.date).sort();
          let pred: Prediction | null;
          if (startDates.length >= 3) {
            pred = predictFromHistory(startDates, result.data.user.quiz);
          } else {
            const lastStart = result.data.user.quiz.last_period_start || null;
            pred = predictFromQuiz(result.data.user.quiz, lastStart, startDates);
          }
          setPrediction(pred);
        }

        // Calculate analytics if permitted
        if (result.connection.permissions.view_analytics && result.data.user) {
          const startDates = userEntries.map((e) => e.date).sort();
          setIrregularity(computeIrregularity(result.data.user.quiz, startDates));
          setSymptomScore(symptomIndex(result.data.user.quiz));
        }
      } catch (err) {
        console.error("Failed to load shared data:", err);
        setError(err instanceof Error ? err.message : "Failed to load shared data");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [connectionId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-muted-foreground">Loading shared data...</p>
        </div>
      </div>
    );
  }

  if (error || !connection || !sharedData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-6 max-w-md w-full text-center space-y-4">
          <Lock className="w-12 h-12 mx-auto text-muted-foreground" />
          <div>
            <h2 className="text-xl font-bold mb-2">Unable to Load Data</h2>
            <p className="text-muted-foreground text-sm">{error || "Connection not found or access revoked"}</p>
          </div>
          <Button onClick={() => navigate("/partner")} className="w-full">
            Back to Partners
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => navigate("/partner")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-bold">Shared Cycle Data</h1>
              <p className="text-xs text-muted-foreground">
                Viewing {connection.partner_name}'s information
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 space-y-6">
        {/* Permissions Info */}
        <Card className="p-4 bg-muted/50">
          <div className="flex items-center gap-2 mb-2">
            <Eye className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm font-medium">You can view</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {connection.permissions.view_entries && (
              <Badge variant="secondary" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Entries
              </Badge>
            )}
            {connection.permissions.view_predictions && (
              <Badge variant="secondary" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Predictions
              </Badge>
            )}
            {connection.permissions.view_analytics && (
              <Badge variant="secondary" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Analytics
              </Badge>
            )}
            {connection.permissions.view_quiz && (
              <Badge variant="secondary" className="text-xs">
                <Eye className="w-3 h-3 mr-1" />
                Quiz Data
              </Badge>
            )}
          </div>
        </Card>

        {/* Prediction */}
        {connection.permissions.view_predictions && prediction && (
          <PredictionCard prediction={prediction} />
        )}

        {/* Calendar */}
        {connection.permissions.view_entries && (
          <Calendar entries={entries} prediction={prediction} />
        )}

        {/* Analytics */}
        {connection.permissions.view_analytics && (
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
        )}

        {/* Quiz Data */}
        {connection.permissions.view_quiz && sharedData.user && (
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-lg">Health Profile</h2>
            <div className="space-y-3">
              {sharedData.user.quiz.age && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Age</span>
                  <span className="text-sm font-medium">{sharedData.user.quiz.age}</span>
                </div>
              )}
              {sharedData.user.quiz.period_regular && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Period Regularity</span>
                  <Badge variant="outline" className="text-xs">
                    {sharedData.user.quiz.period_regular === 'yes' ? 'Regular' : 'Irregular'}
                  </Badge>
                </div>
              )}
              {sharedData.user.quiz.flow_description && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Flow</span>
                  <Badge variant="outline" className="text-xs capitalize">
                    {sharedData.user.quiz.flow_description}
                  </Badge>
                </div>
              )}
              {sharedData.user.quiz.pain !== undefined && (
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pain Level</span>
                  <span className="text-sm font-medium">{sharedData.user.quiz.pain}/10</span>
                </div>
              )}
              {sharedData.user.quiz.reproductive_conditions && sharedData.user.quiz.reproductive_conditions.length > 0 && (
                <div>
                  <span className="text-sm text-muted-foreground block mb-2">Health Conditions</span>
                  <div className="flex flex-wrap gap-2">
                    {sharedData.user.quiz.reproductive_conditions.map((condition, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Entries List */}
        {connection.permissions.view_entries && entries.length > 0 && (
          <Card className="p-5 space-y-4">
            <h2 className="font-semibold text-lg">Period Entries</h2>
            <div className="space-y-3">
              {entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 10)
                .map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium text-sm">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs capitalize">
                          {entry.flow}
                        </Badge>
                        {entry.pain > 0 && (
                          <Badge variant="outline" className="text-xs">
                            Pain: {entry.pain}/10
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            {entries.length > 10 && (
              <p className="text-xs text-muted-foreground text-center">
                Showing 10 of {entries.length} entries
              </p>
            )}
          </Card>
        )}

        {/* No Data Message */}
        {!connection.permissions.view_entries && 
         !connection.permissions.view_predictions && 
         !connection.permissions.view_analytics && 
         !connection.permissions.view_quiz && (
          <Card className="p-8 text-center">
            <EyeOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No data available to view</p>
            <p className="text-sm text-muted-foreground mt-2">
              This partner hasn't granted any viewing permissions yet.
            </p>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
};

export default PartnerDataView;

