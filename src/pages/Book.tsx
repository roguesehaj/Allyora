import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, createBooking } from "@/lib/mockDb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Video, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const Book = () => {
  const navigate = useNavigate();
  const [reason, setReason] = useState("");
  const [slot, setSlot] = useState("");
  const [booking, setBooking] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userId = getCurrentUser();
    if (!userId) {
      navigate("/");
      return;
    }

    const newBooking = createBooking(userId, {
      reason,
      slot: slot || new Date().toISOString(),
    });

    setBooking(newBooking);
    toast.success("Consultation booked!");
  };

  if (booking) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="max-w-md w-full p-6 space-y-6 animate-scale-in">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <Video className="w-8 h-8 text-success" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Consultation Booked!</h2>
              <p className="text-muted-foreground mt-2">
                Your teleconsultation has been scheduled
              </p>
            </div>
          </div>

          <div className="space-y-3 p-4 bg-secondary/50 rounded-2xl">
            <div>
              <p className="text-sm text-muted-foreground">Reason</p>
              <p className="font-medium">{booking.reason}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Booking ID</p>
              <p className="font-mono text-sm">{booking.booking_id}</p>
            </div>
          </div>

          <Button
            className="w-full rounded-full h-12"
            onClick={() => window.open(booking.join_url, "_blank")}
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Join Video Call
          </Button>

          <Button
            variant="outline"
            className="w-full rounded-full"
            onClick={() => navigate("/dashboard")}
          >
            Back to Dashboard
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Demo: This opens a Jitsi meeting room
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b">
        <div className="max-w-2xl mx-auto p-4">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => navigate("/chat")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 py-8">
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Book Teleconsultation</h2>
            <p className="text-muted-foreground">
              Connect with a healthcare expert via video call
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for consultation</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Describe your symptoms or questions..."
                required
                className="rounded-2xl"
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slot">Preferred date & time (optional)</Label>
              <Input
                id="slot"
                type="datetime-local"
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className="rounded-2xl"
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to book immediately
              </p>
            </div>

            <Button type="submit" className="w-full rounded-full h-12">
              Confirm Booking
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Book;
