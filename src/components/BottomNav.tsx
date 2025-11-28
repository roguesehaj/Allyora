import { NavLink } from "@/components/NavLink";
import { Home, Calendar, FileText, Users, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const navItems = [
    { to: "/dashboard", icon: Home, label: "Home" },
    { to: "/entries", icon: Calendar, label: "Tracking" },
    { to: "/articles", icon: FileText, label: "Articles" },
    { to: "/partner", icon: Users, label: "Partner" },
    { to: "/chat", icon: MessageCircle, label: "Chat" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-2xl mx-auto flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            activeClassName="text-primary bg-primary/10"
          >
            <item.icon className="w-5 h-5" />
            <span className="text-xs font-medium">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
