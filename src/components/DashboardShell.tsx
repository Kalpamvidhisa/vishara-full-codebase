import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./Logo";
import {
  Bell,
  LogOut,
  User,
  PhoneCall,
  MapPin,
  Stethoscope,
  MessageCircle,
  X,
} from "lucide-react";
import { getUser, logout, type VisharaUser } from "@/lib/auth";

export function DashboardShell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<VisharaUser | null>(null);
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      navigate({ to: "/login" });
      return;
    }
    setUser(u);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Logo to="/dashboard" />
          <div className="flex items-center gap-3">
            <button className="relative w-10 h-10 rounded-full bg-secondary hover:bg-accent transition-colors grid place-items-center" aria-label="Notifications">
              <Bell className="w-4 h-4 text-secondary-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <div className="hidden sm:flex items-center gap-2 px-3 h-10 rounded-full bg-secondary">
              <div className="w-7 h-7 rounded-full bg-gradient-primary grid place-items-center">
                <User className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-medium">{user?.phone ?? "Guest"}</span>
            </div>
            <button
              onClick={() => { logout(); navigate({ to: "/login" }); }}
              className="w-10 h-10 rounded-full bg-secondary hover:bg-destructive/10 hover:text-destructive transition-colors grid place-items-center"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
<footer className="max-w-7xl mx-auto px-6 py-8 text-xs text-muted-foreground text-center">
  © {new Date().getFullYear()} Vishara · Healthcare Support for Everyone, Anywhere, Anytime.
  <span className="mx-2">·</span>
  <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
</footer>

  <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50">

  {showEmergency && (
    <>
      <button
        onClick={() => navigate({ to: "/symptom" })}
        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
      >
        <MessageCircle className="w-5 h-5" />
        AI Assistant
      </button>

      <a
        href="tel:108"
        className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-700"
      >
        <PhoneCall className="w-5 h-5" />
        Call 108
      </a>

      <button
        className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-green-700"
      >
        <Stethoscope className="w-5 h-5" />
        Doctor
      </button>

      <button
        className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-purple-700"
      >
        <MapPin className="w-5 h-5" />
        Location
      </button>
    </>
  )}

  <button
    onClick={() => setShowEmergency(!showEmergency)}
    className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-2xl flex items-center justify-center"
  >
    {showEmergency ? <X className="w-8 h-8" /> : <PhoneCall className="w-8 h-8" />}
  </button>

</div>

</div>
  );
}
