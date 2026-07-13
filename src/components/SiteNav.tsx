import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
          <li><Link to="/" className="hover:text-foreground transition-colors">Home</Link></li>
          <li><a href="/#services" className="hover:text-foreground transition-colors">Services</a></li>
          <li><a href="/#doctors" className="hover:text-foreground transition-colors">Doctors</a></li>
          <li><a href="/#contact" className="hover:text-foreground transition-colors">Contact</a></li>
        </ul>
        <Link to="/login">
          <Button variant="default" className="rounded-full px-6 bg-gradient-primary shadow-soft hover:shadow-glow transition-shadow">
            Login
          </Button>
        </Link>
      </nav>
    </header>
  );
}
