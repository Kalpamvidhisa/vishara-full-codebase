import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/SiteNav";
import { Button } from "@/components/ui/button";
import doctorHero from "@/assets/doctor-hero.jpg";
import {
  Activity, Stethoscope, FileHeart, Siren, PhoneCall, WifiOff,
  Languages, Users, ArrowRight, CheckCircle2, MapPin, Mail, Phone, Brain,
  Signal, Satellite, Globe2, Mic2, Baby, Heart, UserCheck, ClipboardList,
  Bell, Shield, HeartPulse, Pill
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vishara — Healthcare Support for Everyone, Anywhere, Anytime" },
      { name: "description", content: "Modern rural telemedicine platform with AI symptom checker, doctor appointments, health records, and 24/7 emergency SOS." },
      { property: "og:title", content: "Vishara — Rural Telemedicine" },
      { property: "og:description", content: "Healthcare Support for Everyone, Anywhere, Anytime." },
    ],
  }),
  component: Landing,
});

const services = [
  { icon: Activity, title: "AI Symptom Checker", desc: "Describe symptoms in plain language and get instant guidance." },
  { icon: Stethoscope, title: "Doctor Appointments", desc: "Book trusted general physicians and specialists in minutes." },
  { icon: Brain, title: "AI Disease Analyzer", desc: "Upload report sheets or photos of symptoms to detect and analyze health issues." },
  { icon: FileHeart, title: "Health Records", desc: "Securely store prescriptions, reports and medical history." },
  { icon: Siren, title: "Emergency SOS", desc: "One-tap help with the nearest hospital and ambulance dispatch." },
];

const ruralFeatures = [
  { icon: PhoneCall, title: "Voice-call support", desc: "Care over a regular phone call — no app needed." },
  { icon: WifiOff, title: "Works on low internet", desc: "Optimized for 2G/3G connections and offline reads." },
  { icon: Languages, title: "Multilingual", desc: "Hindi, English and regional languages for everyone." },
  { icon: Users, title: "Elderly friendly", desc: "Large text, simple flows, and gentle guidance." },
];

const villageFeatures = [
  {
    icon: Signal,
    title: "2G / 3G Ready",
    desc: "Works on the slowest connections. Lightweight pages load in under 2 seconds even on 2G.",
    color: "from-primary to-primary-glow",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: WifiOff,
    title: "Offline Mode",
    desc: "Access your prescriptions, health records and doctor notes even when you go offline.",
    color: "from-accent to-primary",
    bg: "bg-accent/20",
    iconColor: "text-accent-foreground",
  },
  {
    icon: Mic2,
    title: "Voice-First Interface",
    desc: "Speak your symptoms in Hindi or your regional language — no typing needed.",
    color: "from-success to-primary",
    bg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    icon: Satellite,
    title: "Satellite Clinic Sync",
    desc: "Syncs with nearest rural health centre (PHC/CHC) for coordinated care and referrals.",
    color: "from-primary-glow to-accent",
    bg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    icon: Globe2,
    title: "20+ Languages",
    desc: "Hindi, Tamil, Telugu, Bengali, Marathi, Kannada and more — everyone is included.",
    color: "from-warning to-primary-glow",
    bg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    icon: PhoneCall,
    title: "Call-In Option",
    desc: "No smartphone? Call 1800-VISHARA. A care coordinator will guide you step by step.",
    color: "from-destructive to-primary",
    bg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
];

const familyFeatures = [
  {
    icon: UserCheck,
    title: "Family Profiles",
    desc: "Add up to 10 family members — parents, children, grandparents — each with their own health timeline.",
    highlight: true,
  },
  {
    icon: HeartPulse,
    title: "Shared Health Dashboard",
    desc: "See everyone's upcoming appointments, prescriptions and vitals in one unified view.",
    highlight: false,
  },
  {
    icon: Baby,
    title: "Child & Maternal Care",
    desc: "Track vaccination schedules, growth milestones, and prenatal check-ups for mother and child.",
    highlight: false,
  },
  {
    icon: Pill,
    title: "Medication Reminders",
    desc: "Never miss a dose. Set daily reminders for every family member's medicines.",
    highlight: true,
  },
  {
    icon: ClipboardList,
    title: "Shared Records Vault",
    desc: "One secure folder for all family medical documents — reports, prescriptions, discharge summaries.",
    highlight: false,
  },
  {
    icon: Bell,
    title: "Health Alerts",
    desc: "Get notified for upcoming check-ups, overdue vaccinations, or changes in a family member's condition.",
    highlight: false,
  },
  {
    icon: Shield,
    title: "Privacy Controls",
    desc: "Each member controls their own privacy. Share only what you choose with other family members.",
    highlight: false,
  },
  {
    icon: Heart,
    title: "Caregiver Mode",
    desc: "Designate a family caregiver who can book appointments and view records on behalf of elderly members.",
    highlight: true,
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero" />
        <div className="absolute -top-40 -right-40 w-[480px] h-[480px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[420px] h-[420px] rounded-full bg-accent/40 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32 grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card shadow-soft border border-border text-xs font-semibold text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
              Trusted telemedicine for rural India
            </span>
            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold leading-[1.05] tracking-tight text-foreground">
              Healthcare Support for{" "}
              <span className="text-gradient">Everyone, Anywhere,</span> Anytime.
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl">
              Vishara connects villages and remote communities to qualified doctors, AI-powered
              symptom guidance, secure health records and 24/7 emergency response — even on a basic phone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/login">
                <Button size="lg" className="rounded-full bg-gradient-primary shadow-glow hover:shadow-card px-7 h-12">
                  Get Started <ArrowRight className="ml-1 w-4 h-4" />
                </Button>
              </Link>
              <a href="#services">
                <Button size="lg" variant="outline" className="rounded-full h-12 px-7 border-border bg-card/60 backdrop-blur">
                  Explore services
                </Button>
              </a>
            </div>
            <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> 500+ verified doctors</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-success" /> 24/7 SOS</div>
            </div>
          </div>

          <div className="relative animate-fade-up">
            <div className="absolute inset-0 bg-gradient-primary rounded-3xl blur-2xl opacity-25" />
            <div className="relative bg-card rounded-3xl shadow-card overflow-hidden border border-border">
              <img
                src={doctorHero}
                alt="Friendly doctor ready to consult on Vishara telemedicine"
                width={1024}
                height={1024}
                className="w-full h-auto"
              />
            </div>
            <div className="absolute -left-6 bottom-10 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 animate-float">
              <div className="w-10 h-10 rounded-xl bg-success/15 grid place-items-center">
                <Activity className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Live vitals</p>
                <p className="text-sm font-semibold">Heart rate · 72 bpm</p>
              </div>
            </div>
            <div className="absolute -right-4 top-10 bg-card rounded-2xl shadow-card px-4 py-3 flex items-center gap-3 animate-float [animation-delay:1.5s]">
              <div className="w-10 h-10 rounded-xl bg-primary/10 grid place-items-center">
                <Stethoscope className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Next appointment</p>
                <p className="text-sm font-semibold">Dr. Mehta · 4:30 PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">About Vishara</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Bridging the rural healthcare gap.</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Millions of villagers struggle to reach specialists due to distance, cost and connectivity.
              Vishara brings the clinic to the patient — combining AI triage, qualified doctors and a network
              of partner hospitals into one simple platform built for non-technical users.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Affordable consultations from anywhere",
                "Voice-call fallback when internet drops",
                "Designed with elderly and first-time users in mind",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { k: "120k+", v: "Consultations" },
              { k: "1,200+", v: "Villages served" },
              { k: "500+", v: "Doctors onboarded" },
              { k: "24/7", v: "Emergency support" },
            ].map((s) => (
              <div key={s.v} className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow">
                <p className="text-3xl font-extrabold text-gradient">{s.k}</p>
                <p className="text-sm text-muted-foreground mt-1">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="bg-secondary/40 py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Services</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Everything you need for healthier living.</h2>
            <p className="mt-4 text-muted-foreground">Five core services — designed to be simple, fast and reliable.</p>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {services.map((s) => (
              <div key={s.title} className="group bg-card rounded-2xl p-6 border border-border shadow-soft hover:shadow-card hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-xl bg-gradient-primary grid place-items-center shadow-soft group-hover:shadow-glow transition-shadow">
                  <s.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="mt-5 font-semibold text-lg">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section id="doctors" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Our Doctors</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">Meet a few of the specialists on Vishara.</h2>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: "Dr. Anjali Mehta", spec: "General Physician", exp: "12 yrs", color: "from-primary to-primary-glow" },
            { name: "Dr. Rajesh Kumar", spec: "Cardiologist", exp: "18 yrs", color: "from-accent to-primary" },
            { name: "Dr. Priya Nair", spec: "Pediatrician", exp: "9 yrs", color: "from-primary-glow to-accent" },
          ].map((d) => (
            <div key={d.name} className="bg-card border border-border rounded-2xl p-6 shadow-soft hover:shadow-card transition-shadow">
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${d.color} grid place-items-center text-primary-foreground text-2xl font-bold`}>
                {d.name.split(" ")[1][0]}
              </div>
              <h3 className="mt-4 font-semibold text-lg">{d.name}</h3>
              <p className="text-sm text-muted-foreground">{d.spec} · {d.exp}</p>
              <Link to="/login" className="mt-4 inline-flex text-sm font-semibold text-primary hover:gap-2 transition-all items-center gap-1">
                Book consult <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* EMERGENCY */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-sos text-destructive-foreground p-10 md:p-14 shadow-card">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider opacity-80">Emergency Support</p>
              <h2 className="mt-3 text-3xl md:text-4xl font-bold">In a crisis, every second counts.</h2>
              <p className="mt-3 max-w-xl opacity-90">
                One tap connects you to nearest hospital, dispatches an ambulance and shares your live location with emergency contacts.
              </p>
            </div>
            <Link to="/login">
              <button className="relative w-32 h-32 rounded-full bg-white text-destructive font-extrabold text-xl shadow-card animate-pulse-ring">
                SOS
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* RURAL */}
      <section className="bg-secondary/40 py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Built for Rural Communities</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">Designed for real-world conditions.</h2>
          </div>
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {ruralFeatures.map((f) => (
              <div key={f.title} className="bg-card rounded-2xl p-6 border border-border shadow-soft">
                <div className="w-11 h-11 rounded-xl bg-primary/10 grid place-items-center">
                  <f.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ANYWHERE ANY VILLAGE */}
      <section id="village" className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Anywhere, Any Village</p>
          <h2 className="mt-3 text-3xl md:text-4xl font-bold">
            No signal barrier. <span className="text-gradient">No distance too far.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Vishara is engineered from the ground up for India's rural reality — low connectivity,
            regional languages, and basic phones.
          </p>
        </div>

        {/* Big hero banner */}
        <div className="mt-14 relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-accent p-10 md:p-14 shadow-card">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-white/10 blur-2xl" />
          <div className="relative grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur">
                <span className="w-2 h-2 rounded-full bg-green-300 animate-pulse" />
                Live in 1,200+ villages
              </span>
              <h3 className="mt-5 text-3xl md:text-4xl font-extrabold text-white leading-tight">
                Healthcare that travels with you — even to the last mile.
              </h3>
              <p className="mt-4 text-white/80 leading-relaxed">
                Whether you're in a mountain hamlet or a remote tribal village, Vishara reaches you.
                Our platform adapts to your device, your language and your connectivity.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "1,200+", v: "Villages" },
                { k: "28", v: "States covered" },
                { k: "2G", v: "Min. connection" },
                { k: "20+", v: "Languages" },
              ].map((s) => (
                <div key={s.v} className="bg-white/15 backdrop-blur rounded-2xl p-5 border border-white/20">
                  <p className="text-3xl font-extrabold text-white">{s.k}</p>
                  <p className="text-sm text-white/70 mt-1">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature grid */}
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {villageFeatures.map((f) => (
            <div
              key={f.title}
              className="group bg-card border border-border rounded-2xl p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${f.bg} grid place-items-center`}>
                <f.icon className={`w-6 h-6 ${f.iconColor}`} />
              </div>
              <h3 className="mt-5 font-semibold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAMILY CARE */}
      <section id="family-care" className="bg-secondary/40 py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">Family Care</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold">
              One account. <span className="text-gradient">Whole family protected.</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Manage health records, appointments and reminders for every member of your family —
              from newborns to grandparents — in one place.
            </p>
          </div>

          {/* Feature cards — 4-column grid with highlighted cards */}
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {familyFeatures.map((f) => (
              <div
                key={f.title}
                className={`group rounded-2xl p-6 border transition-all duration-300 hover:-translate-y-1 ${
                  f.highlight
                    ? "bg-gradient-to-br from-primary to-primary-glow border-primary/30 shadow-glow text-primary-foreground"
                    : "bg-card border-border shadow-soft hover:shadow-card"
                }`}
              >
                <div
                  className={`w-11 h-11 rounded-xl grid place-items-center ${
                    f.highlight ? "bg-white/20" : "bg-primary/10"
                  }`}
                >
                  <f.icon
                    className={`w-5 h-5 ${
                      f.highlight ? "text-white" : "text-primary"
                    }`}
                  />
                </div>
                <h3 className={`mt-4 font-semibold text-base ${ f.highlight ? "text-white" : ""}`}>{f.title}</h3>
                <p className={`mt-2 text-sm leading-relaxed ${ f.highlight ? "text-white/80" : "text-muted-foreground"}`}>{f.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA strip */}
          <div className="mt-14 flex flex-col sm:flex-row items-center justify-between gap-6 bg-card border border-border rounded-2xl p-8 shadow-soft">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-primary grid place-items-center shadow-glow flex-shrink-0">
                <Users className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="font-bold text-lg">Start managing your family's health today.</p>
                <p className="text-sm text-muted-foreground">Free for up to 5 family members. No credit card required.</p>
              </div>
            </div>
            <Link to="/login">
              <Button size="lg" className="rounded-full bg-gradient-primary shadow-glow hover:shadow-card px-8 h-12 whitespace-nowrap">
                Add Family Members <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary grid place-items-center">
                <Activity className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-extrabold text-xl">Vishara</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground max-w-md">
              Healthcare Support for Everyone, Anywhere, Anytime. A rural telemedicine platform
              built to be simple, reliable and human.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#services" className="hover:text-foreground">Services</a></li>
              <li><a href="#doctors" className="hover:text-foreground">Doctors</a></li>
              <li><a href="#village" className="hover:text-foreground">Anywhere, Any Village</a></li>
              <li><a href="#family-care" className="hover:text-foreground">Family Care</a></li>
              <li><Link to="/login" className="hover:text-foreground">Login</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> 1800-VISHARA</li>
              <li className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /> care@vishara.health</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Bengaluru, India</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Vishara Health. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
