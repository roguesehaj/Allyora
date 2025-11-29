import { NavLink } from "@/components/NavLink";
import { Home, Calendar, FileText, Users, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export function BottomNav() {
  const location = useLocation();
  const isHomeActive = location.pathname === "/dashboard" || location.pathname === "/";

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-border/40 z-50">
      {/* Enhanced gradient background with backdrop blur */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-xl" />
      {/* Subtle top border glow */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      
      {/* Content */}
      <div className="relative">
        <div className="max-w-2xl mx-auto grid grid-cols-5 items-center h-20 px-2 py-2">
          {/* Tracking */}
          <NavLink
            to="/entries"
            className="flex flex-col items-center justify-center gap-1 transition-all duration-200 text-muted-foreground hover:text-foreground group"
            activeClassName="text-primary"
          >
            <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
              <Calendar className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs font-medium">Tracking</span>
          </NavLink>

          {/* Articles */}
          <NavLink
            to="/articles"
            className="flex flex-col items-center justify-center gap-1 transition-all duration-200 text-muted-foreground hover:text-foreground group"
            activeClassName="text-primary"
          >
            <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
              <FileText className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs font-medium">Articles</span>
          </NavLink>

          {/* Center Home Button - Prominent Primary Circular Button */}
          <div className="flex items-center justify-center">
            <NavLink
              to="/dashboard"
              className={cn(
                "flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl",
                isHomeActive
                  ? "bg-primary text-primary-foreground scale-110 shadow-glow-lg hover:scale-115"
                  : "bg-card text-muted-foreground hover:bg-primary/10 hover:text-primary shadow-md hover:scale-105"
              )}
            >
              <Home className="w-6 h-6" />
            </NavLink>
          </div>

          {/* Partner */}
          <NavLink
            to="/partner"
            className="flex flex-col items-center justify-center gap-1 transition-all duration-200 text-muted-foreground hover:text-foreground group"
            activeClassName="text-primary"
          >
            <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
              <Users className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs font-medium">Partner</span>
          </NavLink>

          {/* Chat */}
          <NavLink
            to="/chat"
            className="flex flex-col items-center justify-center gap-1 transition-all duration-200 text-muted-foreground hover:text-foreground group"
            activeClassName="text-primary"
          >
            <div className="p-2 rounded-xl group-hover:bg-primary/10 transition-colors">
              <MessageCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <span className="text-xs font-medium">Chat</span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
