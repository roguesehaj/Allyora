import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import {
  Users,
  Link as LinkIcon,
  Trash2,
  Copy,
  Check,
  Plus,
  Eye,
  EyeOff,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import { getCurrentUser } from "@/lib/mockDb";
import {
  createPartnerShare,
  getUserPartners,
  connectToPartner,
  getViewerConnections,
  revokePartnerShare,
  removePartnerConnection,
  updatePartnerPermissions,
} from "@/lib/mockDb";
import type { Partner, PartnerConnection, PartnerType } from "@/types";

const Partner = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"share" | "connected">("share");
  const [userPartners, setUserPartners] = useState<Partner[]>([]);
  const [partnerConnections, setPartnerConnections] = useState<
    PartnerConnection[]
  >([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerType, setNewPartnerType] = useState<PartnerType>("spouse");
  const [permissions, setPermissions] = useState({
    view_entries: true,
    view_predictions: true,
    view_analytics: true,
    view_quiz: false,
  });

  const [connectCode, setConnectCode] = useState("");
  const [connectName, setConnectName] = useState("");
  const [connectType, setConnectType] = useState<PartnerType>("spouse");

  useEffect(() => {
    loadPartners();
  }, []);

  const loadPartners = () => {
    const userId = getCurrentUser();
    if (!userId) return;

    const partners = getUserPartners(userId);
    // Get connections where current user is viewing someone else's data
    const connections = getViewerConnections(userId);
    setUserPartners(partners);
    setPartnerConnections(connections);
  };

  const handleCreateShare = () => {
    const userId = getCurrentUser();
    if (!userId) {
      toast.error("Please complete the quiz first");
      return;
    }

    if (!newPartnerName.trim()) {
      toast.error("Please enter partner name");
      return;
    }

    try {
      const partner = createPartnerShare(
        userId,
        newPartnerName,
        newPartnerType,
        permissions
      );
      toast.success("Share code created!");
      setNewPartnerName("");
      setPermissions({
        view_entries: true,
        view_predictions: true,
        view_analytics: true,
        view_quiz: false,
      });
      loadPartners();
    } catch (error) {
      toast.error("Failed to create share code");
      console.error(error);
    }
  };

  const handleConnect = () => {
    if (!connectCode.trim() || !connectName.trim()) {
      toast.error("Please enter share code and your name");
      return;
    }

    const userId = getCurrentUser();
    if (!userId) {
      toast.error("Please complete the quiz first");
      return;
    }

    try {
      connectToPartner(
        connectCode.trim().toUpperCase(),
        connectName,
        connectType,
        userId
      );
      toast.success("Connected successfully!");
      setConnectCode("");
      setConnectName("");
      loadPartners();
      setActiveTab("connected");
    } catch (error) {
      toast.error("Invalid share code or connection failed");
      console.error(error);
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success("Share code copied!");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleRevoke = (partnerId: string) => {
    const userId = getCurrentUser();
    if (!userId) return;

    try {
      revokePartnerShare(userId, partnerId);
      toast.success("Partner access revoked");
      loadPartners();
    } catch (error) {
      toast.error("Failed to revoke access");
      console.error(error);
    }
  };

  const handleDisconnect = (connectionId: string) => {
    try {
      removePartnerConnection(connectionId);
      toast.success("Disconnected");
      loadPartners();
    } catch (error) {
      toast.error("Failed to disconnect");
      console.error(error);
    }
  };

  const handleUpdatePermissions = (
    partnerId: string,
    newPermissions: Partner["permissions"]
  ) => {
    const userId = getCurrentUser();
    if (!userId) return;

    try {
      updatePartnerPermissions(userId, partnerId, newPermissions);
      toast.success("Permissions updated");
      loadPartners();
    } catch (error) {
      toast.error("Failed to update permissions");
      console.error(error);
    }
  };

  const getPartnerTypeLabel = (type: PartnerType) => {
    const labels: Record<PartnerType, string> = {
      spouse: "Spouse/Partner",
      family: "Family Member",
      healthcare: "Healthcare Provider",
      other: "Other",
    };
    return labels[type];
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-2xl mx-auto p-4 space-y-6">
        <div className="py-4">
          <h1 className="text-2xl font-bold">Partner Connect</h1>
          <p className="text-muted-foreground">
            Share your cycle data with trusted partners
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant={activeTab === "share" ? "default" : "outline"}
            className="flex-1 rounded-full"
            onClick={() => setActiveTab("share")}
          >
            Share My Data
            {userPartners.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {userPartners.length}
              </Badge>
            )}
          </Button>
          <Button
            variant={activeTab === "connected" ? "default" : "outline"}
            className="flex-1 rounded-full"
            onClick={() => setActiveTab("connected")}
          >
            View Shared Data
            {partnerConnections.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {partnerConnections.length}
              </Badge>
            )}
          </Button>
        </div>

        {activeTab === "share" && (
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Share Code
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Share Code</DialogTitle>
                  <DialogDescription>
                    Generate a code to share your cycle data with someone you
                    trust.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Partner Name</Label>
                    <Input
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                      placeholder="e.g., John, Mom, Dr. Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Partner Type</Label>
                    <Select
                      value={newPartnerType}
                      onValueChange={(v) => setNewPartnerType(v as PartnerType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse/Partner</SelectItem>
                        <SelectItem value="family">Family Member</SelectItem>
                        <SelectItem value="healthcare">
                          Healthcare Provider
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-3">
                    <Label>Permissions</Label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={permissions.view_entries}
                          onCheckedChange={(checked) =>
                            setPermissions({
                              ...permissions,
                              view_entries: checked === true,
                            })
                          }
                        />
                        <span className="text-sm">View period entries</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={permissions.view_predictions}
                          onCheckedChange={(checked) =>
                            setPermissions({
                              ...permissions,
                              view_predictions: checked === true,
                            })
                          }
                        />
                        <span className="text-sm">View cycle predictions</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={permissions.view_analytics}
                          onCheckedChange={(checked) =>
                            setPermissions({
                              ...permissions,
                              view_analytics: checked === true,
                            })
                          }
                        />
                        <span className="text-sm">View analytics</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={permissions.view_quiz}
                          onCheckedChange={(checked) =>
                            setPermissions({
                              ...permissions,
                              view_quiz: checked === true,
                            })
                          }
                        />
                        <span className="text-sm">View quiz responses</span>
                      </label>
                    </div>
                  </div>
                  <Button onClick={handleCreateShare} className="w-full">
                    Create Share Code
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {userPartners.length === 0 ? (
              <Card className="p-8 text-center">
                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No active shares</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Create a share code to let someone view your cycle data
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {userPartners.map((partner) => (
                  <Card key={partner.id} className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {partner.partner_name}
                          </h3>
                          <Badge variant="outline">
                            {getPartnerTypeLabel(partner.partner_type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Connected:{" "}
                          {new Date(partner.connected_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-secondary/50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Share Code
                          </p>
                          <p className="font-mono text-lg font-bold">
                            {partner.share_code}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyCode(partner.share_code)}
                        >
                          {copiedCode === partner.share_code ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        Permissions
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {partner.permissions.view_entries && (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Entries
                          </Badge>
                        )}
                        {partner.permissions.view_predictions && (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Predictions
                          </Badge>
                        )}
                        {partner.permissions.view_analytics && (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Analytics
                          </Badge>
                        )}
                        {partner.permissions.view_quiz && (
                          <Badge variant="secondary" className="text-xs">
                            <Eye className="w-3 h-3 mr-1" />
                            Quiz
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Edit Permissions
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Permissions</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-3">
                            <label className="flex items-center gap-2">
                              <Checkbox
                                checked={partner.permissions.view_entries}
                                onCheckedChange={(checked) =>
                                  handleUpdatePermissions(partner.id, {
                                    ...partner.permissions,
                                    view_entries: checked === true,
                                  })
                                }
                              />
                              <span className="text-sm">
                                View period entries
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <Checkbox
                                checked={partner.permissions.view_predictions}
                                onCheckedChange={(checked) =>
                                  handleUpdatePermissions(partner.id, {
                                    ...partner.permissions,
                                    view_predictions: checked === true,
                                  })
                                }
                              />
                              <span className="text-sm">
                                View cycle predictions
                              </span>
                            </label>
                            <label className="flex items-center gap-2">
                              <Checkbox
                                checked={partner.permissions.view_analytics}
                                onCheckedChange={(checked) =>
                                  handleUpdatePermissions(partner.id, {
                                    ...partner.permissions,
                                    view_analytics: checked === true,
                                  })
                                }
                              />
                              <span className="text-sm">View analytics</span>
                            </label>
                            <label className="flex items-center gap-2">
                              <Checkbox
                                checked={partner.permissions.view_quiz}
                                onCheckedChange={(checked) =>
                                  handleUpdatePermissions(partner.id, {
                                    ...partner.permissions,
                                    view_quiz: checked === true,
                                  })
                                }
                              />
                              <span className="text-sm">
                                View quiz responses
                              </span>
                            </label>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex-1"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Revoke
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Revoke Access?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will revoke access for {partner.partner_name}
                              . They will no longer be able to view your data.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleRevoke(partner.id)}
                            >
                              Revoke
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "connected" && (
          <div className="space-y-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full rounded-full">
                  <LinkIcon className="w-4 h-4 mr-2" />
                  Connect to Partner
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Connect to Partner</DialogTitle>
                  <DialogDescription>
                    Enter a share code to view someone's cycle data.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Share Code</Label>
                    <Input
                      value={connectCode}
                      onChange={(e) =>
                        setConnectCode(e.target.value.toUpperCase())
                      }
                      placeholder="Enter 8-character code"
                      maxLength={8}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Name</Label>
                    <Input
                      value={connectName}
                      onChange={(e) => setConnectName(e.target.value)}
                      placeholder="How they'll see you"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Your Relationship</Label>
                    <Select
                      value={connectType}
                      onValueChange={(v) => setConnectType(v as PartnerType)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse/Partner</SelectItem>
                        <SelectItem value="family">Family Member</SelectItem>
                        <SelectItem value="healthcare">
                          Healthcare Provider
                        </SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleConnect} className="w-full">
                    Connect
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {partnerConnections.length === 0 ? (
              <Card className="p-8 text-center">
                <LinkIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">No connections</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect to a partner using their share code
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {partnerConnections.map((connection) => (
                  <Card key={connection.id} className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {connection.partner_name}
                          </h3>
                          <Badge variant="outline">
                            {getPartnerTypeLabel(connection.partner_type)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Connected:{" "}
                          {new Date(
                            connection.connected_at
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-muted-foreground">
                        You can view
                      </p>
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
                            Quiz
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => navigate(`/partner/view/${connection.id}`)}
                    >
                      View Shared Data
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full text-destructive"
                      onClick={() => handleDisconnect(connection.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Disconnect
                    </Button>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        <Card className="p-4 bg-muted/50">
          <h4 className="font-medium text-sm mb-2">About Partner Connect</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Partner Connect allows you to securely share your cycle data with
            trusted partners like spouses, family members, or healthcare
            providers. You control what data is shared and can revoke access
            anytime. Share codes are unique and can only be used once per
            connection.
          </p>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
};

export default Partner;
