import { Link } from "@tanstack/react-router";
import { HeartPulse } from "lucide-react";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-primary shadow-soft group-hover:shadow-glow transition-shadow">
        <HeartPulse className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
      </span>
      <span className="font-display font-extrabold text-xl tracking-tight text-foreground">
        Vishara
      </span>
    </Link>
  );
}
