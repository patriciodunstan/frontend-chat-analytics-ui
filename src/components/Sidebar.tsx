import { NavLink } from "react-router-dom";
import { MessageSquare, BarChart2, LogOut, User } from "lucide-react";
import { useAuthStore } from "../stores/authStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 flex flex-col border-r bg-card text-card-foreground">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold tracking-tight">Chat Analytics</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <MessageSquare size={20} />
          <span>Chat Assistant</span>
        </NavLink>

        <NavLink
          to="/reports"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm font-medium",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )
          }
        >
          <BarChart2 size={20} />
          <span>Reports</span>
        </NavLink>
      </nav>

      <div className="p-4 border-t bg-muted/20">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <User size={16} />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.full_name}</p>
            <p className="text-xs text-muted-foreground truncate capitalize">
              {user?.role}
            </p>
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={logout}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </Button>
      </div>
    </aside>
  );
}
