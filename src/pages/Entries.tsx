import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, getEntries, addEntry, editEntry, deleteEntry } from "@/lib/mockDb";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Entry, FlowType } from "@/types";

const Entries = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [date, setDate] = useState<Date>(new Date());
  const [flow, setFlow] = useState<FlowType>("medium");
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
    try {
      const userId = getCurrentUser();
      if (!userId) {
        toast.error("Please log in to add entries");
        navigate("/");
        return;
      }

      // Validate date - cannot add future dates
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      if (date > today) {
        toast.error("Cannot add entries for future dates");
        return;
      }

      // Validate date is not too old (optional, e.g., max 2 years)
      const twoYearsAgo = new Date();
      twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
      if (date < twoYearsAgo) {
        toast.error("Cannot add entries older than 2 years");
        return;
      }

      const entryDate = format(date, "yyyy-MM-dd");

      // Check for duplicate entries on the same date
      const existingEntry = entries.find((e) => e.date === entryDate);
      if (existingEntry) {
        toast.error("An entry already exists for this date. Please edit the existing entry.");
        return;
      }

      // Validate pain level
      if (pain < 0 || pain > 10) {
        toast.error("Pain level must be between 0 and 10");
        return;
      }

      if (editingEntry) {
        editEntry(userId, {
          ...editingEntry,
          date: entryDate,
          flow: flow as FlowType,
          pain,
          notes: notes.trim(),
        });
        toast.success("Entry updated successfully!");
      } else {
        addEntry(userId, {
          date: entryDate,
          flow: flow as FlowType,
          pain,
          mood: [],
          symptoms: [],
          product: "pad",
          notes: notes.trim(),
        });
        toast.success("Entry added successfully!");
      }

      setIsDialogOpen(false);
      setEditingEntry(null);
      setDate(new Date());
      setFlow("medium");
      setPain(0);
      setNotes("");
      loadEntries();
      
      // Dispatch event to notify Dashboard
      window.dispatchEvent(new Event('entriesUpdated'));
    } catch (error) {
      console.error("Failed to add entry:", error);
      toast.error(error instanceof Error ? error.message : "Failed to add entry");
    }
  };

  const handleDeleteEntry = (entryId: string) => {
    const userId = getCurrentUser();
    if (!userId) return;

    deleteEntry(userId, entryId);
    toast.success("Entry deleted");
    loadEntries();
    
    // Dispatch event to notify Dashboard
    window.dispatchEvent(new Event('entriesUpdated'));
  };

  const handleEditEntry = (entry: Entry) => {
    setEditingEntry(entry);
    setDate(new Date(entry.date));
    setFlow(entry.flow);
    setPain(entry.pain);
    setNotes(entry.notes || "");
    setIsDialogOpen(true);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingEntry(null);
      setDate(new Date());
      setFlow("medium");
      setPain(0);
      setNotes("");
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl font-bold">Period Tracking</h1>
            <p className="text-muted-foreground">Log your cycles</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button size="icon" className="rounded-full">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEntry ? "Edit Period Entry" : "Add Period Entry"}</DialogTitle>
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
                  {editingEntry ? "Update Entry" : "Add Entry"}
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
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditEntry(entry)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
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
