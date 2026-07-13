import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import {
  Signal, WifiOff, Mic2, Satellite, Globe2, PhoneCall,
  CheckCircle2, ArrowRight, MapPin, Radio, Download,
  Wifi, Volume2, Building2, Languages, Phone
} from "lucide-react";

export const Route = createFileRoute("/village")({
  head: () => ({ meta: [{ title: "Anywhere, Any Village · Vishara" }] }),
  component: VillagePage,
});

const features = [
  {
    id: "2g-ready",
    icon: Signal,
    color: "text-primary",
    bg: "bg-primary/10",
    gradFrom: "from-primary",
    gradTo: "to-primary-glow",
    title: "2G / 3G Ready",
    tagline: "No fast internet? No problem.",
    description:
      "Vishara is engineered for the slowest connections in India. Every page is compressed, images are lazy-loaded, and critical health data is cached locally so it loads fast — even on 2G EDGE networks.",
    highlights: [
      "Pages load in under 2 seconds on 2G",
      "Compressed images & assets for low bandwidth",
      "Critical health data cached locally",
      "Progressive loading — content appears instantly",
    ],
    steps: [
      { num: "01", title: "Open Vishara", desc: "Works on any browser on your phone or computer — no app install needed." },
      { num: "02", title: "Auto-detects connection", desc: "Vishara detects your network speed and switches to a lightweight mode automatically." },
      { num: "03", title: "Get your care", desc: "Book appointments, check symptoms and view records — all optimized for low data usage." },
    ],
  },
  {
    id: "offline",
    icon: WifiOff,
    color: "text-success",
    bg: "bg-success/10",
    gradFrom: "from-success",
    gradTo: "to-primary",
    title: "Offline Mode",
    tagline: "Your health data, even without signal.",
    description:
      "Once you've loaded your records or prescriptions, Vishara saves them on your device. You can view your health history, medication list, and doctor notes even when there's no internet connection at all.",
    highlights: [
      "Prescriptions saved for offline access",
      "Health history viewable without internet",
      "Doctor notes & reports cached automatically",
      "Syncs automatically when connection returns",
    ],
    steps: [
      { num: "01", title: "Visit your records", desc: "Open Health Records at least once while connected — Vishara saves them automatically." },
      { num: "02", title: "Go offline", desc: "Even in areas with zero signal, your records are accessible from your device." },
      { num: "03", title: "Auto-sync", desc: "When you're back online, any updates sync seamlessly in the background." },
    ],
  },
  {
    id: "voice",
    icon: Mic2,
    color: "text-warning",
    bg: "bg-warning/10",
    gradFrom: "from-warning",
    gradTo: "to-primary-glow",
    title: "Voice-First Interface",
    tagline: "Speak — don't type.",
    description:
      "Not everyone is comfortable typing on a phone. With Vishara's voice interface, you can speak your symptoms in Hindi, Tamil, Telugu or any regional language. Our AI understands and responds in your language.",
    highlights: [
      "Speak symptoms in your own language",
      "Supports Hindi, Tamil, Telugu, Bengali, Marathi",
      "No typing needed — fully voice-driven",
      "AI responds in the same language you spoke",
    ],
    steps: [
      { num: "01", title: "Tap the mic", desc: "Find the microphone button on the AI Symptom Checker page." },
      { num: "02", title: "Speak naturally", desc: "Describe your symptoms in any regional language — no need for English." },
      { num: "03", title: "Get guidance", desc: "Vishara's AI understands and gives you health guidance in your language." },
    ],
  },
  {
    id: "clinic-sync",
    icon: Satellite,
    color: "text-primary",
    bg: "bg-primary/10",
    gradFrom: "from-primary",
    gradTo: "to-accent",
    title: "Satellite Clinic Sync",
    tagline: "Connected to your nearest health centre.",
    description:
      "Vishara integrates with the network of Primary Health Centres (PHC) and Community Health Centres (CHC) across rural India. Your records, referrals and prescriptions are shared securely with your nearest government clinic.",
    highlights: [
      "Syncs with 500+ PHC/CHC partner centres",
      "Referrals sent directly to nearest clinic",
      "Government health scheme integration",
      "Secure record sharing with authorized doctors",
    ],
    steps: [
      { num: "01", title: "Register your village", desc: "Enter your village or PIN code — Vishara finds your nearest partner PHC/CHC." },
      { num: "02", title: "Doctor refers you", desc: "If you need in-person care, Vishara's doctor sends a referral directly to the PHC." },
      { num: "03", title: "Walk in with your records", desc: "The PHC already has your medical history — no paperwork needed." },
    ],
  },
  {
    id: "languages",
    icon: Globe2,
    color: "text-accent-foreground",
    bg: "bg-accent/20",
    gradFrom: "from-accent",
    gradTo: "to-primary",
    title: "20+ Languages",
    tagline: "Healthcare in your mother tongue.",
    description:
      "Language should never be a barrier to healthcare. Vishara is fully available in 20+ Indian languages including Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia and more.",
    highlights: [
      "20+ Indian languages fully supported",
      "UI, symptoms and advice — all translated",
      "Switch language anytime from settings",
      "Regional medical terminology supported",
    ],
    steps: [
      { num: "01", title: "Choose your language", desc: "On sign-up or in settings, pick your preferred language from the list." },
      { num: "02", title: "Full UI in your language", desc: "Every button, label, and doctor's advice appears in your chosen language." },
      { num: "03", title: "Switch anytime", desc: "Change language at any point — your data is not affected." },
    ],
  },
  {
    id: "call-in",
    icon: PhoneCall,
    color: "text-destructive",
    bg: "bg-destructive/10",
    gradFrom: "from-destructive",
    gradTo: "to-primary",
    title: "Call-In Option",
    tagline: "No smartphone needed. Just a phone.",
    description:
      "If you don't have a smartphone or internet, simply call 1800-VISHARA (toll-free). A trained care coordinator will guide you through symptoms, book an appointment, and arrange follow-up — all over a regular phone call.",
    highlights: [
      "Toll-free number: 1800-VISHARA",
      "Available 24 hours, 7 days a week",
      "Works on any basic mobile or landline",
      "Care coordinator speaks your language",
    ],
    steps: [
      { num: "01", title: "Call 1800-VISHARA", desc: "Toll-free, available on any phone — no data or internet needed." },
      { num: "02", title: "Describe your issue", desc: "A care coordinator listens and asks questions to understand your health concern." },
      { num: "03", title: "Get full support", desc: "They'll book your appointment, send an SMS confirmation and arrange follow-up." },
    ],
  },
];

function VillagePage() {
  return (
    <DashboardShell>
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-accent p-8 md:p-12 shadow-card">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
            Live in 1,200+ villages across India
          </span>
          <h1 className="mt-5 text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Anywhere, Any Village
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl text-base leading-relaxed">
            Vishara is built from scratch for rural India — low connectivity, basic phones, regional languages.
            Every feature below works even in the most remote corners of the country.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { k: "1,200+", v: "Villages" },
              { k: "28", v: "States" },
              { k: "2G", v: "Min. speed needed" },
              { k: "20+", v: "Languages" },
            ].map((s) => (
              <div key={s.v} className="bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20">
                <p className="text-2xl font-extrabold text-white">{s.k}</p>
                <p className="text-xs text-white/70 mt-1">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature detail cards */}
      <div className="mt-10 space-y-10">
        {features.map((f, i) => (
          <section
            key={f.id}
            id={f.id}
            className="bg-card border border-border rounded-3xl overflow-hidden shadow-soft hover:shadow-card transition-shadow"
          >
            <div className={`grid md:grid-cols-2 ${i % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
              {/* Colored panel */}
              <div className={`bg-gradient-to-br ${f.gradFrom} ${f.gradTo} p-8 md:p-10 flex flex-col justify-center md:[direction:ltr]`}>
                <div className="w-14 h-14 rounded-2xl bg-white/20 grid place-items-center">
                  <f.icon className="w-7 h-7 text-white" />
                </div>
                <h2 className="mt-5 text-2xl md:text-3xl font-extrabold text-white">{f.title}</h2>
                <p className="mt-2 text-white/70 font-medium">{f.tagline}</p>
                <ul className="mt-6 space-y-3">
                  {f.highlights.map((h) => (
                    <li key={h} className="flex items-start gap-3 text-sm text-white/90">
                      <CheckCircle2 className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Info panel */}
              <div className="p-8 md:p-10 md:[direction:ltr] flex flex-col justify-center">
                <p className="text-muted-foreground leading-relaxed">{f.description}</p>

                <div className="mt-8 space-y-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary">How it works</p>
                  {f.steps.map((s) => (
                    <div key={s.num} className="flex gap-4">
                      <span className={`w-9 h-9 rounded-xl bg-gradient-to-br ${f.gradFrom} ${f.gradTo} text-white text-sm font-bold grid place-items-center flex-shrink-0`}>
                        {s.num}
                      </span>
                      <div>
                        <p className="font-semibold text-sm">{s.title}</p>
                        <p className="text-sm text-muted-foreground mt-0.5">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* CTA */}
      <section className="mt-10 bg-card border border-border rounded-3xl p-8 md:p-10 text-center shadow-soft">
        <MapPin className="w-10 h-10 text-primary mx-auto" />
        <h2 className="mt-4 text-2xl font-bold">Ready to get care, wherever you are?</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Sign in and start using Vishara from your village — no matter your connection, device or language.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/symptom">
            <button className="h-12 px-8 rounded-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition-shadow flex items-center gap-2">
              Check Symptoms <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
          <Link to="/appointments">
            <button className="h-12 px-8 rounded-full bg-card border border-border font-semibold hover:bg-secondary transition-colors">
              Book a Doctor
            </button>
          </Link>
        </div>
      </section>
    </DashboardShell>
  );
}
