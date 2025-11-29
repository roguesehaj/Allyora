import { NavLink } from "@/components/NavLink";
import { Home, Calendar, FileText, Users, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export function BottomNav() {
  const location = useLocation();
  const isHomeActive = location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border/30 z-50">
      {/* Gradient background with backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-50/70 via-pink-50/40 to-transparent backdrop-blur-md" />
      {/* Content */}
      <div className="relative">
        <div className="max-w-2xl mx-auto grid grid-cols-5 items-center h-16 px-2">
          {/* Tracking */}
          <NavLink
            to="/entries"
            className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground hover:text-foreground"
            activeClassName="text-primary"
          >
            <Calendar className="w-5 h-5" />
            <span className="text-xs font-medium">Tracking</span>
          </NavLink>

          {/* Articles */}
          <NavLink
            to="/articles"
            className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground hover:text-foreground"
            activeClassName="text-primary"
          >
            <FileText className="w-5 h-5" />
            <span className="text-xs font-medium">Articles</span>
          </NavLink>

          {/* Center Home Button - Prominent Red Circular Button */}
          <div className="flex items-center justify-center">
            <NavLink
              to="/dashboard"
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-full transition-all shadow-lg",
                isHomeActive
                  ? "bg-red-500 text-white scale-110 shadow-xl shadow-red-500/30"
                  : "bg-white text-muted-foreground hover:bg-red-50 hover:text-red-500 shadow-md"
              )}
            >
              <Home className="w-6 h-6" />
            </NavLink>
          </div>

          {/* Partner */}
          <NavLink
            to="/partner"
            className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground hover:text-foreground"
            activeClassName="text-primary"
          >
            <Users className="w-5 h-5" />
            <span className="text-xs font-medium">Partner</span>
          </NavLink>

          {/* Chat */}
          <NavLink
            to="/chat"
            className="flex flex-col items-center justify-center gap-1 transition-colors text-muted-foreground hover:text-foreground"
            activeClassName="text-primary"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-xs font-medium">Chat</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
