import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getEntries, addEntry, deleteEntry } from "@/lib/mockDb";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const Entries = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [flow, setFlow] = useState<string>("medium");
  const [pain, setPain] = useState<number>(0);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const userId = getCurrentUser();
    if (!userId) {
      navigate("/");
      return;
    }
    loadEntries();
  }, [navigate]);

  const loadEntries = () => {
    const userId = getCurrentUser();
    if (userId) {
      const userEntries = getEntries(userId);
      setEntries(userEntries);
    }
  };

  const handleAddEntry = () => {
    const userId = getCurrentUser();
    if (!userId) return;

    addEntry(userId, {
      date: format(date, "yyyy-MM-dd"),
      flow: flow as any,
      pain,
      mood: [],
      symptoms: [],
      product: "pad",
      notes,
    });

    toast.success("Entry added successfully!");
    setIsDialogOpen(false);
    setDate(new Date());
    setFlow("medium");
    setPain(0);
    setNotes("");
    loadEntries();
  };

  const handleDeleteEntry = (entryId: string) => {
    const userId = getCurrentUser();
    if (!userId) return;

    deleteEntry(userId, entryId);
    toast.success("Entry deleted");
    loadEntries();
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold">Period Tracking</h1>
            <p className="text-muted-foreground">Log your cycles</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Period Entry</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal rounded-2xl",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => d && setDate(d)}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Flow</Label>
                  <Select value={flow} onValueChange={setFlow}>
                    <SelectTrigger className="rounded-2xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="heavy">Heavy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Pain Level (0-10): {pain}</Label>
                  <Slider
                    value={[pain]}
                    onValueChange={(v) => setPain(v[0])}
                    max={10}
                    step={1}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any additional notes..."
                    className="rounded-2xl"
                  />
                </div>

                <Button className="w-full rounded-full" onClick={handleAddEntry}>
                  Add Entry
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          {entries.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">No entries yet. Add your first period log!</p>
            </Card>
          ) : (
            entries
              .slice()
              .reverse()
              .map((entry) => (
                <Card key={entry.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <p className="font-medium">
                        {new Date(entry.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex gap-2 text-sm text-muted-foreground">
                        <span className="capitalize">{entry.flow} flow</span>
                        <span>•</span>
                        <span>Pain: {entry.pain}/10</span>
                      </div>
                      {entry.notes && (
                        <p className="text-sm text-muted-foreground mt-2">{entry.notes}</p>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteEntry(entry.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </Card>
              ))
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};

export default Entries;
