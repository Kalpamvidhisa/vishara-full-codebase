import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import doctorHero from "@/assets/doctor-hero.jpg";
import { login } from "@/lib/auth";
import { Phone, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, collection, addDoc } from "firebase/firestore";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login · Vishara" },
      { name: "description", content: "Login to your Vishara account to access doctors, records and emergency support." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // 1. Sign in with Firebase Auth using virtual email
      const userCredential = await signInWithEmailAndPassword(auth, `${phone}@vishara.com`, password);
      const user = userCredential.user;

      // 2. Fetch user details from Firestore
      let name = "Patient";
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          name = userDoc.data().name || "Patient";
        }
      } catch (err) {
        console.error("Error fetching user name:", err);
      }

      // 3. Log login history in Firestore (Non-blocking to prevent offline hangs)
      addDoc(collection(db, "login_history"), {
        uid: user.uid,
        phone: phone,
        name: name,
        timestamp: new Date().toISOString(),
        userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
        type: "login"
      }).catch(err => {
        console.error("Failed to write login log to Firestore:", err);
      });

      // 4. Set client-side session state
      login(phone, name);

      toast.success("Welcome back to Vishara");
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      console.error(err);
      if (
        err.code === "auth/wrong-password" ||
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        toast.error("Invalid phone number or password");
      } else {
        toast.error(err.message || "Failed to sign in. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Illustration */}
      <div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-hero overflow-hidden">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-accent/40 blur-3xl" />
        <Logo />
        <div className="relative z-10">
          <img src={doctorHero} alt="Vishara doctor" className="w-full max-w-md mx-auto rounded-3xl shadow-card" />
          <div className="mt-8 max-w-md">
            <h2 className="text-3xl font-bold leading-tight">Care that travels to your village.</h2>
            <p className="mt-3 text-muted-foreground">
              Log in to consult doctors, access your health records and get instant emergency help — all in one place.
            </p>
          </div>
        </div>
        <div className="relative z-10 flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="w-4 h-4 text-success" /> Your data is encrypted and private.
        </div>
      </div>

      {/* Form */}
      <div className="flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8"><Logo /></div>
          <div className="bg-card border border-border rounded-3xl shadow-card p-8 md:p-10">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="mt-2 text-sm text-muted-foreground">Sign in with your phone number to continue.</p>

            <form onSubmit={submit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="phone" type="tel" inputMode="numeric" maxLength={10}
                    placeholder="98765 43210" className="pl-10 h-12 rounded-xl"
                    value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password" type="password" placeholder="••••••••"
                    className="pl-10 h-12 rounded-xl"
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                type="submit" disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-primary shadow-soft hover:shadow-glow transition-shadow text-base font-semibold"
              >
                {loading ? "Signing in…" : "Login"}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                By continuing you agree to Vishara's terms and privacy policy.
              </p>
            </form>
          </div>

          <p className="mt-6 text-sm text-center text-muted-foreground">
            New to Vishara?{" "}
            <Link to="/signup" className="text-primary font-semibold hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
