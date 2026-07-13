import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import {
  UserCheck, HeartPulse, Baby, Pill, ClipboardList,
  Bell, Shield, Heart, CheckCircle2, ArrowRight,
  Users, Plus, Calendar, FileText, Lock, AlertCircle
} from "lucide-react";

export const Route = createFileRoute("/family-care")({
  head: () => ({ meta: [{ title: "Family Care · Vishara" }] }),
  component: FamilyCarePage,
});

const features = [
  {
    id: "family-profiles",
    icon: UserCheck,
    gradFrom: "from-primary",
    gradTo: "to-primary-glow",
    title: "Family Profiles",
    tagline: "One account for the whole family.",
    description:
      "Add up to 10 family members under a single Vishara account. Each member — from a newborn to a grandparent — gets their own complete health profile with separate records, appointments and prescriptions.",
    highlights: [
      "Up to 10 family members per account",
      "Separate health timeline for each member",
      "Switch between profiles with one tap",
      "Individual appointment and prescription history",
    ],
    steps: [
      { num: "01", title: "Go to Family", desc: "Open Health Records and tap 'Add Family Member' to create a new profile." },
      { num: "02", title: "Fill basic details", desc: "Enter name, date of birth, relationship and any known health conditions." },
      { num: "03", title: "Switch anytime", desc: "Use the profile switcher at the top to jump between family members instantly." },
    ],
    actionLabel: "Add Family Member",
    actionTo: "/records" as const,
  },
  {
    id: "shared-dashboard",
    icon: HeartPulse,
    gradFrom: "from-primary-glow",
    gradTo: "to-accent",
    title: "Shared Health Dashboard",
    tagline: "Everyone's health, one unified view.",
    description:
      "See upcoming appointments, current medications, recent doctor visits and health alerts for every family member in one place. The family dashboard gives you a complete health picture at a glance.",
    highlights: [
      "Upcoming appointments for all members",
      "Medication schedules consolidated",
      "Recent doctor visit summaries",
      "Health alert notifications per member",
    ],
    steps: [
      { num: "01", title: "Open Dashboard", desc: "Your dashboard shows a summary card for each family member at the top." },
      { num: "02", title: "Tap a member", desc: "Click any family member's card to see their full health timeline." },
      { num: "03", title: "Act on alerts", desc: "Health alerts prompt you when a check-up or vaccination is due." },
    ],
    actionLabel: "View Dashboard",
    actionTo: "/dashboard" as const,
  },
  {
    id: "child-maternal",
    icon: Baby,
    gradFrom: "from-success",
    gradTo: "to-primary-glow",
    title: "Child & Maternal Care",
    tagline: "Protecting your little ones and expecting mothers.",
    description:
      "Track your child's growth milestones, vaccination schedule and pediatric check-ups. For expecting mothers, Vishara monitors prenatal appointments, trimester milestones and delivery planning — all in one place.",
    highlights: [
      "Complete vaccination schedule with reminders",
      "Growth milestone tracking (height, weight, head circumference)",
      "Trimester-by-trimester prenatal care guide",
      "Pediatric and OB-GYN specialist booking",
    ],
    steps: [
      { num: "01", title: "Add child or mother", desc: "Create a child or maternal profile and Vishara sets up the right care plan automatically." },
      { num: "02", title: "Track milestones", desc: "Log weight, height and developmental milestones after each visit." },
      { num: "03", title: "Get reminders", desc: "Receive vaccination reminders and prenatal check-up alerts on time." },
    ],
    actionLabel: "Book Pediatric Appointment",
    actionTo: "/appointments" as const,
  },
  {
    id: "medication-reminders",
    icon: Pill,
    gradFrom: "from-warning",
    gradTo: "to-primary",
    title: "Medication Reminders",
    tagline: "Never miss a dose again.",
    description:
      "Set up daily, twice-daily or custom medication reminders for every family member. Vishara sends you alerts at the right time with the medicine name, dosage and instructions — so no one misses a critical dose.",
    highlights: [
      "Per-member, per-medicine reminders",
      "Custom frequency — once, twice, three times daily",
      "Dosage and special instructions included",
      "Refill reminders when medicines run low",
    ],
    steps: [
      { num: "01", title: "Open Medicine Guide", desc: "Search for your prescribed medicine and tap 'Set Reminder'." },
      { num: "02", title: "Set schedule", desc: "Choose the time(s) and frequency for the reminder." },
      { num: "03", title: "Get notified", desc: "Vishara sends you a notification with medicine name, dose and instructions." },
    ],
    actionLabel: "Browse Medicine Guide",
    actionTo: "/medicine-guide" as const,
  },
  {
    id: "records-vault",
    icon: ClipboardList,
    gradFrom: "from-primary",
    gradTo: "to-accent",
    title: "Shared Records Vault",
    tagline: "One place for all family health documents.",
    description:
      "Upload and store prescriptions, lab reports, discharge summaries, X-rays and vaccination certificates for every family member in a single secure vault. Access any document instantly — no searching through physical files.",
    highlights: [
      "Store unlimited documents per family member",
      "Supports PDF, images and reports",
      "Share securely with any Vishara doctor",
      "Downloadable for offline use or printing",
    ],
    steps: [
      { num: "01", title: "Open Records", desc: "Go to Health Records and select the family member." },
      { num: "02", title: "Upload a document", desc: "Tap 'Add Record', choose the file type and upload from your phone or camera." },
      { num: "03", title: "Access & share", desc: "View or share any document with your doctor with a single tap." },
    ],
    actionLabel: "Open Records Vault",
    actionTo: "/records" as const,
  },
  {
    id: "health-alerts",
    icon: Bell,
    gradFrom: "from-destructive",
    gradTo: "to-primary-glow",
    title: "Health Alerts",
    tagline: "Stay ahead of health issues.",
    description:
      "Vishara proactively monitors your family's health timelines and sends alerts before things become problems. Get notified for overdue check-ups, expiring prescriptions, missed vaccinations and doctor follow-ups.",
    highlights: [
      "Overdue check-up reminders",
      "Vaccination due date alerts",
      "Prescription refill warnings",
      "Doctor follow-up reminders",
    ],
    steps: [
      { num: "01", title: "Enable notifications", desc: "Allow Vishara to send notifications — it monitors your family health silently." },
      { num: "02", title: "Receive alerts", desc: "Get timely nudges: 'Riya's DPT vaccine is due in 3 days' or 'Papa's checkup is overdue'." },
      { num: "03", title: "Take action", desc: "Tap the alert to book an appointment or mark as done — right from the notification." },
    ],
    actionLabel: "Book Appointment",
    actionTo: "/appointments" as const,
  },
  {
    id: "privacy-controls",
    icon: Shield,
    gradFrom: "from-primary",
    gradTo: "to-primary-glow",
    title: "Privacy Controls",
    tagline: "Your health. Your choice. Your privacy.",
    description:
      "Every family member has full control over their own health data. Adults can choose exactly which records, reports or prescriptions are visible to other family members. Sensitive information stays private by default.",
    highlights: [
      "Per-record privacy control (public / family / private)",
      "Adult members manage their own visibility",
      "Children's data managed by guardian",
      "Full data deletion option at any time",
    ],
    steps: [
      { num: "01", title: "Open any record", desc: "Tap the lock icon on any document or prescription in your vault." },
      { num: "02", title: "Set visibility", desc: "Choose: Private (only you), Family (shared), or Doctor-only." },
      { num: "03", title: "Change anytime", desc: "Privacy settings can be updated at any time with no effect on your data." },
    ],
    actionLabel: "Manage Records",
    actionTo: "/records" as const,
  },
  {
    id: "caregiver-mode",
    icon: Heart,
    gradFrom: "from-primary-glow",
    gradTo: "to-accent",
    title: "Caregiver Mode",
    tagline: "Care for your loved ones, even from far away.",
    description:
      "Designate a trusted family member as a caregiver for elderly or dependent members. The caregiver can book appointments, view records, set medication reminders and receive health alerts on behalf of that person.",
    highlights: [
      "Assign a caregiver to any family member",
      "Caregiver can book & manage appointments",
      "Full record access with permission",
      "Works across cities — manage remotely",
    ],
    steps: [
      { num: "01", title: "Select a family member", desc: "Open their profile and tap 'Assign Caregiver'." },
      { num: "02", title: "Choose caregiver", desc: "Pick any other family member as caregiver — they get full access to that profile." },
      { num: "03", title: "Caregiver takes over", desc: "The caregiver can now book, manage and monitor — even from another city." },
    ],
    actionLabel: "Book an Appointment",
    actionTo: "/appointments" as const,
  },
];

function FamilyCarePage() {
  return (
    <DashboardShell>
      {/* Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary-glow to-accent p-8 md:p-12 shadow-card">
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 text-white text-xs font-semibold backdrop-blur">
            <Users className="w-3.5 h-3.5" />
            Family health made simple
          </span>
          <h1 className="mt-5 text-3xl md:text-5xl font-extrabold text-white leading-tight">
            Family Care
          </h1>
          <p className="mt-4 text-white/80 max-w-2xl text-base leading-relaxed">
            One Vishara account protects your entire family — from newborns to grandparents.
            Manage records, appointments, medications and alerts for everyone in one place.
          </p>
          <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { k: "10", v: "Members per account" },
              { k: "Free", v: "For up to 5 members" },
              { k: "24/7", v: "Health alerts" },
              { k: "100%", v: "Secure & private" },
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
      <div className="mt-10 space-y-8">
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
                <Link to={f.actionTo} className="mt-8 w-fit">
                  <button className="h-10 px-6 rounded-full bg-white/20 hover:bg-white/30 text-white text-sm font-semibold transition-colors flex items-center gap-2 backdrop-blur">
                    {f.actionLabel} <ArrowRight className="w-4 h-4" />
                  </button>
                </Link>
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
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow grid place-items-center mx-auto shadow-glow">
          <Users className="w-7 h-7 text-white" />
        </div>
        <h2 className="mt-5 text-2xl font-bold">Start protecting your whole family today.</h2>
        <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
          Free for up to 5 family members. No credit card required. Add your first family member in under a minute.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/records">
            <button className="h-12 px-8 rounded-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground font-semibold shadow-soft hover:shadow-glow transition-shadow flex items-center gap-2">
              Add Family Member <Plus className="w-4 h-4" />
            </button>
          </Link>
          <Link to="/appointments">
            <button className="h-12 px-8 rounded-full bg-card border border-border font-semibold hover:bg-secondary transition-colors">
              Book Appointment
            </button>
          </Link>
        </div>
      </section>
    </DashboardShell>
  );
}
