import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import doctorHero from "@/assets/doctor-hero.jpg";
import {
  Activity, Stethoscope, FileHeart, Siren, ArrowRight, CalendarCheck,
  HeartPulse, Droplet, Pill, Brain, Signal, WifiOff, Mic2, Globe2,
  PhoneCall, Satellite, Users, UserCheck, Baby, ClipboardList,
  Bell, Shield, Heart
} from "lucide-react";
import { useEffect, useState } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Vishara" }] }),
  component: Dashboard,
});

const cards = [
  {
    to: "/symptom",
    icon: Activity,
    title: "AI Symptom Checker",
    desc: "Describe how you feel and get instant guidance.",
    tone: "from-primary to-primary-glow",
  },
  {
    to: "/appointments",
    icon: Stethoscope,
    title: "Doctor Appointments",
    desc: "Book a consult with verified doctors.",
    tone: "from-primary-glow to-accent",
  },
  {
    to: "/disease-analyzer",
    icon: Brain,
    title: "AI Disease Analyzer",
    desc: "Upload report sheets or photos of symptoms to detect and analyze health issues.",
    tone: "from-purple-500 to-indigo-500",
  },
  {
    to: "/records",
    icon: FileHeart,
    title: "Health Records",
    desc: "View prescriptions, reports and history.",
    tone: "from-accent to-primary",
  },
  {
    to: "/sos",
    icon: Siren,
    title: "Emergency SOS",
    desc: "Get help in a crisis — instantly.",
    tone: "from-destructive to-destructive",
  },
  {
    to: "/medicine-guide",
    icon: Pill,
    title: "Medicine Guide",
    desc: "Learn medicines, uses, dosage and precautions.",
    tone: "from-green-500 to-emerald-500",
  },
] as const;

function Dashboard() {
  const [userName, setUserName] = useState("User");
  const [nextVisit, setNextVisit] = useState("No appointment");
  const [smsStatus, setSmsStatus] = useState("SMS not sent yet");
  const [appointment, setAppointment] = useState<{ doctorName?: string; specialty?: string; date?: string; time?: string; smsStatus?: string; fee?: number } | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) return;
      console.log("Current User:", user);
      console.log("Phone:", user.phoneNumber);
      console.log("Email:", user.email);
      console.log("UID:", user.uid);

      const userDoc = await getDoc(doc(db, "users", user.uid));

      console.log("User document exists:", userDoc.exists());

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserName(userData.name || "User");
      }

      const q = query(
        collection(db, "appointments"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setAppointment(data as any);
        setNextVisit(`${data.date} · ${data.time}`);

        if (data.smsStatus) {
          const statusMap: Record<string, string> = {
            sent: "Confirmation SMS sent ✅",
            failed: "SMS failed to send ⚠️",
            skipped: "SMS skipped (no phone) 📋",
            pending: "SMS pending…",
          };
          setSmsStatus(statusMap[data.smsStatus] ?? `SMS ${data.smsStatus}`);
        } else {
          setSmsStatus("SMS not sent yet");
        }
      }
    });

    return () => unsubscribe();
  }, []);
  return (
    <DashboardShell>
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-hero border border-border p-8 md:p-10 shadow-soft">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Welcome back</p>
            <h1 className="mt-2 text-3xl md:text-4xl font-bold">Hello, {userName} </h1>
            <p className="mt-3 text-muted-foreground max-w-xl">
              Your daily health snapshot looks good. Schedule a check-up, refill prescriptions or talk to a doctor below.
            </p>
            <div className="mt-6 grid gap-4 xl:grid-cols-[1fr_320px] items-start">
              <div className="flex flex-wrap gap-3 items-center">
                <Link to="/appointments">
                  <button className="h-11 px-5 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition-shadow">
                    Book a consultation
                  </button>
                </Link>

                <Link to="/symptom">
                  <button className="h-11 px-5 rounded-full bg-card border border-border font-semibold hover:bg-secondary transition-colors">
                    Talk to AI
                  </button>
                </Link>
              </div>

              <div className="rounded-3xl border border-border bg-secondary/80 p-5 text-sm text-muted-foreground">
                <div className="font-semibold text-base">Appointment details</div>
                <div className="mt-3 text-foreground text-sm font-semibold">{appointment?.doctorName ?? "No appointment yet"}</div>
                <div className="text-xs mt-1 text-muted-foreground">{appointment?.specialty ?? "Specialty not scheduled"}</div>
                <div className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">When</div>
                <div className="mt-1 text-foreground">{nextVisit}</div>
                <div className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">SMS status</div>
                <div className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  appointment?.smsStatus === "sent"
                    ? "bg-success/10 text-success"
                    : appointment?.smsStatus === "failed"
                    ? "bg-destructive/10 text-destructive"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {smsStatus}
                </div>
                <div className="mt-4 text-xs uppercase tracking-[0.18em] text-muted-foreground">Fee</div>
                <div className="mt-1 text-foreground">{appointment?.fee ? `₹${appointment.fee}` : "—"}</div>
              </div>
            </div>
          </div>
          <img src={doctorHero} alt="Your doctor" className="hidden md:block w-44 h-44 rounded-2xl object-cover shadow-card animate-float" />
        </div>
      </section>

      {/* Vitals */}
      <section className="mt-6 grid sm:grid-cols-3 gap-4">
        {[
          { icon: HeartPulse, label: "Heart rate", value: "72 bpm", tone: "text-destructive bg-destructive/10" },
          { icon: Droplet, label: "Blood sugar", value: "98 mg/dL", tone: "text-primary bg-primary/10" },
          { icon: CalendarCheck, label: "Next visit", value: nextVisit, tone: "text-success bg-success/10" },
        ].map((v) => (
          <div key={v.label} className="bg-card border border-border rounded-2xl p-5 shadow-soft flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl grid place-items-center ${v.tone}`}>
              <v.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">{v.label}</p>
              <p className="font-semibold text-lg">{v.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Services */}
      <section className="mt-8">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-xl font-bold">Quick services</h2>
          <span className="text-xs text-muted-foreground">Tap a card to begin</span>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cards.map((c) => (
            <Link
              key={c.title} to={c.to}
              className="group bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${c.tone} grid place-items-center shadow-soft group-hover:shadow-glow transition-shadow`}>
                <c.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="mt-5 font-semibold text-lg">{c.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{c.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ANYWHERE ANY VILLAGE */}
      <section className="mt-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold">Anywhere, Any Village</h2>
            <p className="text-sm text-muted-foreground mt-1">Designed for rural India — works on any device, even low connectivity.</p>
          </div>
        </div>

        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-accent p-8 md:p-10 shadow-card mb-6">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid md:grid-cols-2 gap-8 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                Live in 1,200+ villages
              </span>
              <h3 className="mt-4 text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Healthcare that travels with you — even to the last mile.
              </h3>
              <p className="mt-3 text-white/80 text-sm leading-relaxed">
                Our platform adapts to your device, your language and your connectivity — from mountain hamlets to remote tribal villages.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "1,200+", v: "Villages" },
                { k: "28", v: "States" },
                { k: "2G", v: "Min. connection" },
                { k: "20+", v: "Languages" },
              ].map((s) => (
                <div key={s.v} className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20">
                  <p className="text-2xl font-extrabold text-white">{s.k}</p>
                  <p className="text-xs text-white/70 mt-1">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Village feature cards — all clickable */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            { icon: Signal,    title: "2G / 3G Ready",  desc: "Lightweight pages load in under 2 seconds even on 2G.",       bg: "bg-primary/10",     color: "text-primary",          to: "/village/2g-ready" as const },
            { icon: WifiOff,   title: "Offline Mode",    desc: "Access prescriptions and records even when offline.",         bg: "bg-accent/20",      color: "text-accent-foreground", to: "/village/offline" as const },
            { icon: Mic2,      title: "Voice-First",     desc: "Speak symptoms in Hindi or your regional language.",         bg: "bg-success/10",     color: "text-success",          to: "/village/voice" as const },
            { icon: Satellite, title: "Clinic Sync",     desc: "Syncs with nearest PHC/CHC for referrals and coordination.", bg: "bg-primary/10",     color: "text-primary",          to: "/village/clinic-sync" as const },
            { icon: Globe2,    title: "20+ Languages",   desc: "Hindi, Tamil, Telugu, Bengali, Marathi and more.",           bg: "bg-warning/10",     color: "text-warning",          to: "/village/languages" as const },
            { icon: PhoneCall, title: "Call-In Option",  desc: "No smartphone? Call 1800-VISHARA for guided support.",       bg: "bg-destructive/10", color: "text-destructive",      to: "/village/call-in" as const },
          ].map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className="group bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 block"
            >
              <div className={`w-11 h-11 rounded-xl ${f.bg} grid place-items-center`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="mt-4 font-semibold text-base">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-primary group-hover:gap-2 transition-all">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* FAMILY CARE */}
      <section className="mt-10">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-xl font-bold">Family Care</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage health for your entire family — newborns to grandparents.</p>
          </div>
        </div>

        {/* Family feature cards — all clickable */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: UserCheck,     title: "Family Profiles",      desc: "Add up to 10 members, each with their own health timeline.",       highlight: true,  to: "/family-care/profiles" as const },
            { icon: HeartPulse,   title: "Shared Dashboard",     desc: "Everyone's appointments, prescriptions and vitals in one view.",   highlight: false, to: "/family-care/dashboard" as const },
            { icon: Baby,         title: "Child & Maternal",     desc: "Track vaccinations, growth milestones and prenatal check-ups.",    highlight: false, to: "/family-care/child-maternal" as const },
            { icon: Pill,         title: "Medication Reminders", desc: "Set daily reminders for every family member's medicines.",         highlight: true,  to: "/family-care/medications" as const },
            { icon: ClipboardList,title: "Records Vault",        desc: "One secure folder for all family medical documents.",             highlight: false, to: "/family-care/records-vault" as const },
            { icon: Bell,         title: "Health Alerts",        desc: "Get notified for check-ups, vaccinations, and condition changes.", highlight: false, to: "/family-care/alerts" as const },
            { icon: Shield,       title: "Privacy Controls",     desc: "Each member controls what they share with others.",               highlight: false, to: "/family-care/privacy" as const },
            { icon: Heart,        title: "Caregiver Mode",       desc: "A caregiver can book and view records for elderly members.",      highlight: true,  to: "/family-care/caregiver" as const },
          ].map((f) => (
            <Link
              key={f.title}
              to={f.to}
              className={`group rounded-2xl p-5 border transition-all duration-300 hover:-translate-y-1 block ${
                f.highlight
                  ? "bg-gradient-to-br from-primary to-primary-glow border-primary/30 shadow-glow"
                  : "bg-card border-border shadow-soft hover:shadow-card"
              }`}
            >
              <div className={`w-10 h-10 rounded-xl grid place-items-center ${ f.highlight ? "bg-white/20" : "bg-primary/10" }`}>
                <f.icon className={`w-5 h-5 ${ f.highlight ? "text-white" : "text-primary" }`} />
              </div>
              <h3 className={`mt-3 font-semibold text-sm ${ f.highlight ? "text-white" : "" }`}>{f.title}</h3>
              <p className={`mt-1 text-xs leading-relaxed ${ f.highlight ? "text-white/80" : "text-muted-foreground" }`}>{f.desc}</p>
              <span className={`mt-3 inline-flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all ${ f.highlight ? "text-white/90" : "text-primary" }`}>
                Open <ArrowRight className="w-3 h-3" />
              </span>
            </Link>
          ))}
        </div>

        {/* Family CTA */}
        <div className="mt-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-card border border-border rounded-2xl p-6 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center shadow-soft flex-shrink-0">
              <Users className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold">Start managing your family's health today.</p>
              <p className="text-sm text-muted-foreground">Free for up to 5 members. No credit card required.</p>
            </div>
          </div>
          <Link to="/appointments">
            <button className="h-11 px-6 rounded-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition-shadow whitespace-nowrap flex items-center gap-2">
              Add Family Members <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </section>

      <section className="mt-8">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">SMS & appointment summary</h2>
              <p className="text-sm text-muted-foreground">Your latest confirmation message and appointment details.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">SMS status</p>
              <p className="mt-2 font-semibold text-foreground">{smsStatus}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Appointment</p>
              <p className="mt-2 font-semibold text-foreground">{appointment?.doctorName ?? "No appointment yet"}</p>
              <p className="mt-1 text-sm text-muted-foreground">{appointment?.specialty ?? "--"}</p>
              <p className="mt-2 text-sm text-muted-foreground">{nextVisit}</p>
            </div>
            <div className="rounded-2xl border border-border p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Consultation fee</p>
              <p className="mt-2 font-semibold text-foreground">{appointment?.fee ? `₹${appointment.fee}` : "—"}</p>
            </div>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
