import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Menu, X, LogOut, Zap, Database, TrendingUp, CheckSquare, BookOpen } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Repos", path: "/repos", icon: <Database className="w-5 h-5" /> },
  { label: "Metrics", path: "/metrics", icon: <TrendingUp className="w-5 h-5" /> },
  { label: "Action Plan", path: "/action-plan", icon: <CheckSquare className="w-5 h-5" /> },
  { label: "Foundation Overview", path: "/foundation", icon: <BookOpen className="w-5 h-5" /> },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isAuthenticated, logout, loading } = useAuth();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <div className="animate-pulse text-neon-cyan text-2xl font-bold mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center max-w-md">
          <Zap className="w-16 h-16 text-neon-cyan mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-4 text-neon-cyan">Digital Health</h1>
          <h2 className="text-2xl font-bold mb-6 text-neon-magenta">Dashboard Orchestrator</h2>
          <p className="mb-8 text-muted-foreground">Sign in to access the Global Digital Health Foundation dashboard</p>
          <Button
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            size="lg"
          >
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => location === path;

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r-2 border-neon-purple transition-all duration-300 flex flex-col neon-glow-purple`}
      >
        {/* Header */}
        <div className="p-4 border-b-2 border-neon-purple/30 flex items-center justify-between bg-gradient-to-r from-sidebar to-sidebar/80">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <Zap className="w-6 h-6 text-neon-cyan animate-pulse" />
              <div>
                <div className="font-bold text-sm text-neon-cyan">DHFO</div>
                <div className="text-xs text-neon-magenta">Orchestrator</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-neon-purple/20 rounded transition-colors text-neon-cyan"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(item.path)
                  ? "bg-neon-purple/30 text-neon-cyan border-2 border-neon-purple neon-glow-purple"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/30 hover:text-neon-cyan border-2 border-transparent"
              }`}
              title={item.label}
            >
              {item.icon}
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t-2 border-neon-purple/30 space-y-3 bg-gradient-to-t from-sidebar/80 to-sidebar">
          {sidebarOpen && (
            <div className="px-3 py-2 bg-neon-purple/10 rounded border border-neon-purple/30">
              <p className="text-xs text-neon-cyan font-semibold truncate">{user?.name || user?.email}</p>
              <p className="text-xs text-neon-magenta/70 mt-1">{user?.role === "admin" ? "Administrator" : "User"}</p>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-neon-magenta/20 transition-colors text-neon-magenta border border-neon-magenta/30 hover:border-neon-magenta"
          >
            <LogOut className="w-4 h-4" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gradient-to-br from-background via-background to-sidebar/10">
        {children}
      </main>
    </div>
  );
}
