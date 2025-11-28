import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Link as LinkIcon, Trash2 } from "lucide-react";
import { toast } from "sonner";

const Partner = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [partner] = useState({
    name: "HealthPartner Demo",
    logo: "🏥",
    description: "Connected health tracking partner for enhanced insights",
  });

  const handleConnect = () => {
    setIsConnected(true);
    toast.success("Partner connected!");
  };

  const handleRevoke = () => {
    setIsConnected(false);
    toast.success("Partner connection removed");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="py-4">
          <h1 className="text-2xl font-bold">Partner Connect</h1>
          <p className="text-muted-foreground">Share data with trusted health partners</p>
        </div>

        {isConnected ? (
          <Card className="p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl">
                  {partner.logo}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{partner.name}</h3>
                    <Badge variant="secondary" className="text-xs">
                      Connected
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t space-y-2">
              <h4 className="text-sm font-medium">Shared Data</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Cycle tracking</Badge>
                <Badge variant="outline">Symptom logs</Badge>
                <Badge variant="outline">Analytics</Badge>
              </div>
            </div>

            <Button
              variant="destructive"
              className="w-full rounded-full"
              onClick={handleRevoke}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Revoke Connection
            </Button>
          </Card>
        ) : (
          <Card className="p-6 space-y-4">
            <div className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">No Partner Connected</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect with health partners to share your cycle data for better insights and care
                </p>
              </div>
            </div>

            <div className="p-4 bg-secondary/50 rounded-2xl space-y-3">
              <div className="flex gap-3">
                <div className="text-2xl">{partner.logo}</div>
                <div className="flex-1">
                  <h4 className="font-medium">{partner.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{partner.description}</p>
                </div>
              </div>
            </div>

            <Button className="w-full rounded-full" onClick={handleConnect}>
              <LinkIcon className="w-4 h-4 mr-2" />
              Connect Partner
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Demo: Partner integration is mocked for prototype
            </p>
          </Card>
        )}

        <Card className="p-4 bg-muted/50">
          <h4 className="font-medium text-sm mb-2">About Partner Connect</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Partner Connect allows you to share your cycle and health data with trusted healthcare
            providers and wellness partners. You maintain full control and can revoke access anytime.
            Your data is never sold to third parties.
          </p>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Partner;
