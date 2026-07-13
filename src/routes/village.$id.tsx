import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import {
  Signal, WifiOff, Mic2, Satellite, Globe2, PhoneCall,
  CheckCircle2, ArrowRight, ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/village/$id")({
  head: ({ params }) => {
    const f = features[params.id];
    return { meta: [{ title: f ? `${f.title} · Vishara` : "Village Features · Vishara" }] };
  },
  component: VillageFeaturePage,
});

const features: Record<string, {
  icon: React.ElementType;
  gradFrom: string; gradTo: string;
  title: string; tagline: string; description: string;
  highlights: string[];
  steps: { num: string; title: string; desc: string }[];
  actionLabel: string; actionTo: string;
  details: { heading: string; body: string }[];
}> = {
  "2g-ready": {
    icon: Signal,
    gradFrom: "from-primary", gradTo: "to-primary-glow",
    title: "2G / 3G Ready",
    tagline: "No fast internet? No problem.",
    description:
      "Vishara is engineered for the slowest connections in India. Every page is compressed, images are lazy-loaded, and critical health data is cached locally so pages load fast — even on 2G EDGE networks in the most remote villages.",
    highlights: [
      "Pages load in under 2 seconds on 2G",
      "Compressed images & assets for low bandwidth",
      "Critical health data cached locally on your device",
      "Progressive loading — content appears instantly",
    ],
    steps: [
      { num: "01", title: "Open Vishara on any browser", desc: "Works on Chrome, Firefox, UC Browser — no app download needed." },
      { num: "02", title: "Vishara auto-detects your speed", desc: "Our system detects your network quality and switches to a compressed, lightweight mode automatically." },
      { num: "03", title: "Get full healthcare", desc: "Book appointments, check symptoms and view records — all optimized for minimal data usage." },
    ],
    actionLabel: "Check Symptoms Now",
    actionTo: "/symptom",
    details: [
      { heading: "How much data does Vishara use?", body: "A typical consultation on Vishara uses less than 500KB of data — that's less than loading a single photo on social media. Our engineers have optimized every byte." },
      { heading: "Which networks are supported?", body: "Vishara works on 2G EDGE (minimum), 3G, 4G and Wi-Fi. Even on 2G, all core features are functional — symptom checker, appointments, records and emergency SOS." },
      { heading: "What about areas with no signal at all?", body: "If you go offline, Vishara's cached content (your records, prescriptions, doctor notes) is still viewable. When signal returns, everything syncs automatically." },
    ],
  },
  offline: {
    icon: WifiOff,
    gradFrom: "from-success", gradTo: "to-primary",
    title: "Offline Mode",
    tagline: "Your health data, even without signal.",
    description:
      "Once you've visited your records or prescriptions, Vishara saves them on your device automatically. You can read your full health history, medication list and doctor notes even in areas with zero internet connectivity.",
    highlights: [
      "Prescriptions automatically saved for offline access",
      "Full health history viewable without internet",
      "Doctor notes & lab reports cached locally",
      "Automatic background sync when connection returns",
    ],
    steps: [
      { num: "01", title: "Visit your records once", desc: "Open Health Records while connected — Vishara caches everything automatically in the background." },
      { num: "02", title: "Go to any area, even with zero signal", desc: "Your records, prescriptions and doctor notes remain fully accessible from your device storage." },
      { num: "03", title: "Automatic sync on reconnect", desc: "The moment your connection returns, Vishara syncs any new data silently in the background." },
    ],
    actionLabel: "Open Health Records",
    actionTo: "/records",
    details: [
      { heading: "What is saved offline?", body: "Vishara caches: all your prescriptions, health records, doctor visit summaries, lab reports you've uploaded, and vaccination history. New uploads sync when you reconnect." },
      { heading: "How much storage does offline mode use?", body: "Offline storage typically uses 2–10MB depending on how many records you have. This is automatically managed — Vishara removes old cached data to free up space." },
      { heading: "Is my offline data secure?", body: "Yes. Offline data is encrypted on your device using AES-256. Even if someone gets access to your phone, they cannot read your health data without your PIN." },
    ],
  },
  voice: {
    icon: Mic2,
    gradFrom: "from-warning", gradTo: "to-primary-glow",
    title: "Voice-First Interface",
    tagline: "Speak — don't type.",
    description:
      "Many rural users are not comfortable typing on a smartphone. With Vishara's voice interface, you simply speak your symptoms out loud in Hindi, Tamil, Telugu or your regional language — and our AI listens, understands and responds in the same language.",
    highlights: [
      "Speak symptoms in your own language — no English needed",
      "Supports Hindi, Tamil, Telugu, Bengali, Marathi, Kannada & more",
      "No typing required — fully voice-driven interaction",
      "AI responds with guidance in the language you spoke",
    ],
    steps: [
      { num: "01", title: "Open AI Symptom Checker", desc: "Go to the AI Symptom Checker from your dashboard." },
      { num: "02", title: "Tap the microphone button", desc: "The mic icon appears in the chat input. Tap it and speak your symptoms naturally." },
      { num: "03", title: "Receive guidance in your language", desc: "Vishara's AI understands regional accents and dialects, and responds with health guidance in your language." },
    ],
    actionLabel: "Try Voice Symptom Check",
    actionTo: "/symptom",
    details: [
      { heading: "Which languages are supported for voice?", body: "Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi and Odia. More languages are added regularly." },
      { heading: "Does it understand rural accents?", body: "Yes. Vishara's voice model is trained on diverse Indian regional accents and dialects, not just standard pronunciation. It works for most rural speech patterns." },
      { heading: "What if I make a mistake?", body: "You can type to correct or re-speak at any time. The AI keeps the full conversation context so corrections are easy." },
    ],
  },
  "clinic-sync": {
    icon: Satellite,
    gradFrom: "from-primary", gradTo: "to-accent",
    title: "Satellite Clinic Sync",
    tagline: "Connected to your nearest government health centre.",
    description:
      "Vishara is integrated with Primary Health Centres (PHC) and Community Health Centres (CHC) across 28 states. Your Vishara doctor can send referrals, share records and coordinate care directly with your nearest government clinic.",
    highlights: [
      "Network of 500+ PHC/CHC partner centres",
      "Referrals sent directly from your Vishara doctor to the clinic",
      "Integration with Ayushman Bharat & government schemes",
      "Secure medical record sharing with authorized clinic staff",
    ],
    steps: [
      { num: "01", title: "Register your village or PIN code", desc: "During sign-up or in settings, enter your village name or PIN code. Vishara automatically maps your nearest partner PHC/CHC." },
      { num: "02", title: "Consult a Vishara doctor", desc: "After your teleconsultation, if in-person care is needed, the doctor sends a digital referral directly to your PHC." },
      { num: "03", title: "Walk into the PHC with no paperwork", desc: "The clinic receives your referral and medical history digitally — no printouts, no repeating your history." },
    ],
    actionLabel: "Book a Consultation",
    actionTo: "/appointments",
    details: [
      { heading: "Which government schemes are integrated?", body: "Vishara is integrated with Ayushman Bharat PM-JAY, e-Sanjeevani and ABDM (Ayushman Bharat Digital Mission). Your Vishara records are linked to your ABHA health ID." },
      { heading: "What if my village PHC is not in the network?", body: "We're expanding rapidly. If your PHC is not yet a partner, your Vishara doctor will give you a printable referral letter with your full medical history." },
      { heading: "Is my record sharing secure?", body: "Only authorized clinic staff at the referred centre can access your records, and only after you consent. You can revoke access at any time." },
    ],
  },
  languages: {
    icon: Globe2,
    gradFrom: "from-accent", gradTo: "to-primary",
    title: "20+ Languages",
    tagline: "Healthcare in your mother tongue.",
    description:
      "Language is one of the biggest barriers to healthcare in rural India. Vishara removes it completely. The full platform — every button, label, doctor's advice, prescription and health tip — is available in 20+ Indian languages.",
    highlights: [
      "20+ Indian languages with full UI translation",
      "Symptoms, advice and prescriptions all translated",
      "Switch language instantly from settings",
      "Regional medical terminology accurately translated",
    ],
    steps: [
      { num: "01", title: "Pick your language on sign-up", desc: "During registration, choose your preferred language. Vishara immediately switches the entire UI." },
      { num: "02", title: "Everything in your language", desc: "All menus, buttons, doctor advice, prescriptions and health tips appear in your chosen language." },
      { num: "03", title: "Change anytime in settings", desc: "You can switch languages at any point — your data and records are not affected at all." },
    ],
    actionLabel: "Get Started",
    actionTo: "/symptom",
    details: [
      { heading: "All 20+ supported languages", body: "Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, Gujarati, Punjabi, Odia, Assamese, Urdu, Sindhi, Konkani, Manipuri, Bodo, Dogri, Kashmiri, Maithili, Santali, Sanskrit." },
      { heading: "Are doctor consultations also multilingual?", body: "Yes. You can choose to consult doctors who speak your language. Vishara has doctors fluent in all major regional languages. AI translation assists for others." },
      { heading: "Is translation medically accurate?", body: "Our translations are reviewed by medical professionals and regional language experts to ensure accuracy of medical terminology — not just literal translation." },
    ],
  },
  "call-in": {
    icon: PhoneCall,
    gradFrom: "from-destructive", gradTo: "to-primary",
    title: "Call-In Option",
    tagline: "No smartphone or internet needed — just a phone call.",
    description:
      "If you don't have a smartphone, data plan or internet access, Vishara still reaches you. Simply call our toll-free helpline 1800-VISHARA from any mobile phone or landline. A trained care coordinator speaks your language and helps you get care.",
    highlights: [
      "Toll-free number: 1800-VISHARA — completely free to call",
      "Available 24 hours a day, 7 days a week, 365 days a year",
      "Works on any basic mobile phone or landline",
      "Care coordinators speak Hindi and all regional languages",
    ],
    steps: [
      { num: "01", title: "Call 1800-VISHARA (toll-free)", desc: "No data needed. Call from any basic phone — prepaid, postpaid or landline. The call is completely free." },
      { num: "02", title: "Speak to a care coordinator", desc: "A trained coordinator listens to your symptoms, asks questions and connects you to a doctor if needed." },
      { num: "03", title: "Get full support", desc: "The coordinator books your appointment, sends an SMS confirmation and arranges follow-up calls." },
    ],
    actionLabel: "Go to Emergency SOS",
    actionTo: "/sos",
    details: [
      { heading: "Is 1800-VISHARA really free?", body: "Yes. 1800-VISHARA is a toll-free number. Calling it costs you nothing — no call charges from any Indian mobile or landline network." },
      { heading: "What happens on the call?", body: "A care coordinator (human, not a bot) speaks with you, records your symptoms, checks your existing Vishara records if you're registered, and connects you to a doctor via phone if needed." },
      { heading: "Can I register on Vishara through the call?", body: "Yes! If you're not registered, the coordinator creates a Vishara account for you over the phone using your Aadhaar or mobile number. All your future records are stored safely." },
    ],
  },
};

function VillageFeaturePage() {
  const { id } = Route.useParams();
  const f = features[id];

  if (!f) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Feature not found.</p>
          <Link to="/village" className="mt-4 inline-block text-primary font-semibold">← Back to Anywhere, Any Village</Link>
        </div>
      </DashboardShell>
    );
  }

  const Icon = f.icon;

  return (
    <DashboardShell>
      {/* Back */}
      <Link
        to="/village"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Anywhere, Any Village
      </Link>

      {/* Hero panel */}
      <section className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${f.gradFrom} ${f.gradTo} p-10 md:p-14 shadow-card`}>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-white/20 grid place-items-center">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <h1 className="mt-6 text-3xl md:text-5xl font-extrabold text-white">{f.title}</h1>
          <p className="mt-3 text-white/70 text-xl font-medium">{f.tagline}</p>
          <p className="mt-5 text-white/80 max-w-2xl leading-relaxed">{f.description}</p>
        </div>
      </section>

      <div className="mt-8 grid md:grid-cols-2 gap-8">
        {/* Highlights */}
        <section className="bg-card border border-border rounded-3xl p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-5">Key Features</p>
          <ul className="space-y-4">
            {f.highlights.map((h) => (
              <li key={h} className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-full bg-gradient-to-br ${f.gradFrom} ${f.gradTo} grid place-items-center flex-shrink-0 mt-0.5`}>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-sm leading-relaxed">{h}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* How it works */}
        <section className="bg-card border border-border rounded-3xl p-8 shadow-soft">
          <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-5">How It Works</p>
          <div className="space-y-6">
            {f.steps.map((s) => (
              <div key={s.num} className="flex gap-4">
                <span className={`w-10 h-10 rounded-xl bg-gradient-to-br ${f.gradFrom} ${f.gradTo} text-white text-sm font-bold grid place-items-center flex-shrink-0`}>
                  {s.num}
                </span>
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Detail Q&A */}
      <section className="mt-8 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">Frequently Asked Questions</p>
        {f.details.map((d) => (
          <div key={d.heading} className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <p className="font-semibold">{d.heading}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{d.body}</p>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className={`mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-br ${f.gradFrom} ${f.gradTo} p-8 md:p-10 shadow-card text-center`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative">
          <h2 className="text-2xl font-bold text-white">Ready to use {f.title}?</h2>
          <p className="mt-2 text-white/80">Access this feature right now — no extra setup needed.</p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <Link to={f.actionTo as any}>
              <button className="h-12 px-8 rounded-full bg-white text-foreground font-semibold shadow-card hover:shadow-glow transition-shadow flex items-center gap-2">
                {f.actionLabel} <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/village">
              <button className="h-12 px-8 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors backdrop-blur">
                ← Other Village Features
              </button>
            </Link>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
