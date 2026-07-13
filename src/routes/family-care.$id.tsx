import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import {
  UserCheck, HeartPulse, Baby, Pill, ClipboardList,
  Bell, Shield, Heart, CheckCircle2, ArrowRight, ArrowLeft, Users, Plus
} from "lucide-react";

export const Route = createFileRoute("/family-care/$id")({
  head: ({ params }) => {
    const f = features[params.id];
    return { meta: [{ title: f ? `${f.title} · Family Care · Vishara` : "Family Care · Vishara" }] };
  },
  component: FamilyCareFeaturePage,
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
  profiles: {
    icon: UserCheck,
    gradFrom: "from-primary", gradTo: "to-primary-glow",
    title: "Family Profiles",
    tagline: "One account. Every family member covered.",
    description:
      "Create up to 10 individual health profiles under your single Vishara account. Each family member — from a newborn to a 90-year-old grandparent — gets their own complete, separate health record with their own appointments, prescriptions and medical history.",
    highlights: [
      "Up to 10 separate profiles per account",
      "Each member has their own health timeline",
      "Switch between profiles with one tap",
      "Individual appointment & prescription history per member",
    ],
    steps: [
      { num: "01", title: "Open Health Records", desc: "Go to Health Records from the dashboard and tap 'Add Family Member'." },
      { num: "02", title: "Fill basic details", desc: "Enter name, date of birth, gender, relationship and any known medical conditions or allergies." },
      { num: "03", title: "Switch between profiles anytime", desc: "A profile selector at the top of the app lets you jump between family members instantly." },
    ],
    actionLabel: "Go to Health Records",
    actionTo: "/records",
    details: [
      { heading: "Is each member's data kept separate?", body: "Yes, completely. Each family profile has its own isolated health record. Papa's blood pressure records do not appear in Amma's profile, and vice versa." },
      { heading: "Can I add a newborn baby?", body: "Yes. Newborn and infant profiles are fully supported with special fields for birth weight, blood type, vaccination schedules and growth milestones." },
      { heading: "What happens if I remove a family member?", body: "Removing a profile archives all their data securely. You can restore it at any time within 30 days. After 30 days, data is permanently deleted per our privacy policy." },
    ],
  },
  dashboard: {
    icon: HeartPulse,
    gradFrom: "from-primary-glow", gradTo: "to-accent",
    title: "Shared Health Dashboard",
    tagline: "Your entire family's health at a glance.",
    description:
      "The Family Health Dashboard shows you a consolidated view of all family members — their upcoming appointments, current medications, recent doctor visits, pending vaccinations and active health alerts — all on one screen without switching between profiles.",
    highlights: [
      "All family members' upcoming appointments in one view",
      "Medication schedules consolidated by member",
      "Recent doctor visit summaries for everyone",
      "Health alert badges on each member's card",
    ],
    steps: [
      { num: "01", title: "Open the Dashboard", desc: "Your main dashboard shows a family summary row at the top with a card for each member." },
      { num: "02", title: "Tap any member's card", desc: "Clicking a family card opens their full health timeline — appointments, records, medications." },
      { num: "03", title: "Act on health alerts", desc: "Red badges on cards indicate urgent alerts — overdue vaccinations, missed medications, upcoming appointments." },
    ],
    actionLabel: "Open Dashboard",
    actionTo: "/dashboard",
    details: [
      { heading: "Can I see all appointments in one calendar?", body: "Yes. The Family Calendar view (under Appointments) shows all family members' appointments on a single timeline, colour-coded per member." },
      { heading: "Can other family members see my records?", body: "Only if you grant permission. Each adult member has privacy controls to decide what is visible to other family members vs. private." },
      { heading: "What are health alert badges?", body: "Red dots on a family member's card signal urgent actions: a vaccination due tomorrow, a prescription expiring, a missed medication, or an overdue check-up." },
    ],
  },
  "child-maternal": {
    icon: Baby,
    gradFrom: "from-success", gradTo: "to-primary-glow",
    title: "Child & Maternal Care",
    tagline: "Protecting your little ones and expecting mothers.",
    description:
      "Vishara provides specialized care plans for children and pregnant women. Track growth milestones, vaccination schedules and pediatric check-ups for children. For expecting mothers, monitor prenatal appointments, trimester milestones and delivery planning — all automatically set up when you add the profile.",
    highlights: [
      "Auto-generated vaccination schedule from birth date",
      "Growth tracking: height, weight, head circumference",
      "Trimester-by-trimester prenatal care reminders",
      "One-tap pediatric and OB-GYN specialist booking",
    ],
    steps: [
      { num: "01", title: "Create a child or maternal profile", desc: "Select 'Child' or 'Pregnant' as the profile type — Vishara auto-configures the right care plan and reminder schedule." },
      { num: "02", title: "Log milestones after every visit", desc: "After each check-up, record weight, height, notes and vaccination status. Vishara tracks progress on a growth chart." },
      { num: "03", title: "Receive timely reminders", desc: "Get alerts for BCG at birth, DPT at 6 weeks, OPV, MMR — all pre-scheduled. Prenatal alerts track each trimester milestone." },
    ],
    actionLabel: "Book Pediatric Appointment",
    actionTo: "/appointments",
    details: [
      { heading: "What vaccinations does Vishara track?", body: "Vishara tracks the full Government of India immunization schedule: BCG, Hepatitis B, OPV, IPV, DPT, Hib, Rotavirus, PCV, MR/MMR, JE, Typhoid, Varicella and more — with reminders timed to the exact due date." },
      { heading: "How does prenatal tracking work?", body: "After entering the expected due date, Vishara creates a trimester-by-trimester appointment schedule with reminders for ultrasounds, blood tests, iron supplements, tetanus doses and delivery planning." },
      { heading: "Can I connect my child's records to their own account later?", body: "Yes. When your child turns 18, their health records can be transferred to their own independent Vishara account with full data continuity." },
    ],
  },
  medications: {
    icon: Pill,
    gradFrom: "from-warning", gradTo: "to-primary",
    title: "Medication Reminders",
    tagline: "Never miss a dose — for any family member.",
    description:
      "Set up personalized daily medication reminders for every family member individually. Vishara sends a notification at the right time with the exact medicine name, dosage, and special instructions — making it impossible to miss a critical dose.",
    highlights: [
      "Individual reminders per family member, per medicine",
      "Custom frequency: once, twice, thrice daily or custom",
      "Dosage amount and special instructions in every alert",
      "Refill reminders when a course is near completion",
    ],
    steps: [
      { num: "01", title: "Find the medicine", desc: "Search for the prescribed medicine in the Medicine Guide and open its detail page." },
      { num: "02", title: "Tap 'Set Reminder'", desc: "Choose the family member, dosage, time(s) of day and duration. Takes under 30 seconds." },
      { num: "03", title: "Receive precise reminders", desc: "At the set time, Vishara notifies you: 'Time for Grandpa's Metformin 500mg — take with food'." },
    ],
    actionLabel: "Browse Medicine Guide",
    actionTo: "/medicine-guide",
    details: [
      { heading: "Can I set reminders for multiple medicines?", body: "Yes, unlimited. You can set reminders for every medicine prescribed to every family member — all managed from one central medication list." },
      { heading: "What if a family member takes medicine at an irregular time?", body: "Vishara supports fully custom schedules — every 8 hours, every 12 hours, alternate days, weekly, or any custom interval you specify." },
      { heading: "Can I mark a dose as taken?", body: "Yes. Each reminder notification has a 'Mark as Taken' button. Vishara tracks adherence and shows a weekly medication compliance report." },
    ],
  },
  "records-vault": {
    icon: ClipboardList,
    gradFrom: "from-primary", gradTo: "to-accent",
    title: "Shared Records Vault",
    tagline: "All family health documents in one secure place.",
    description:
      "Upload and organize every health document for every family member — prescriptions, lab reports, X-rays, discharge summaries, vaccination certificates and insurance cards. Access any document in seconds, share with a doctor in one tap, or download for printing.",
    highlights: [
      "Unlimited document storage per family member",
      "Supports PDF, JPG, PNG, DICOM (X-ray) formats",
      "One-tap secure sharing with any Vishara doctor",
      "Downloadable for offline use or printing at a medical shop",
    ],
    steps: [
      { num: "01", title: "Select the family member", desc: "Open Health Records and switch to the family member whose document you want to upload." },
      { num: "02", title: "Tap 'Add Record'", desc: "Choose the document type (prescription / lab report / X-ray / other), then upload from camera, gallery or files." },
      { num: "03", title: "Access & share instantly", desc: "Any uploaded document can be shared with a Vishara doctor or downloaded as a PDF for printing — from any device." },
    ],
    actionLabel: "Open Records Vault",
    actionTo: "/records",
    details: [
      { heading: "Is there a storage limit?", body: "Free accounts get 500MB of document storage. Premium family plans include 5GB shared across all family members. Most families never exceed the free limit." },
      { heading: "Can a doctor outside Vishara access my records?", body: "You can download any document as a PDF or image and share it outside Vishara (WhatsApp, email, print) as needed. The file is not watermarked or locked." },
      { heading: "What if I lose my phone?", body: "All records are backed up on Vishara's secure cloud servers. Log in on any new device and all your family's documents are immediately available." },
    ],
  },
  alerts: {
    icon: Bell,
    gradFrom: "from-destructive", gradTo: "to-primary-glow",
    title: "Health Alerts",
    tagline: "Stay ahead — before problems become emergencies.",
    description:
      "Vishara continuously monitors your family's health timelines and proactively sends smart health alerts before issues escalate. From overdue vaccinations to expiring prescriptions, Vishara makes sure nothing important slips through the cracks.",
    highlights: [
      "Overdue annual check-up and specialist visit reminders",
      "Vaccination due date alerts — per child, per vaccine",
      "Prescription expiry and refill warnings",
      "Doctor-prescribed follow-up reminders",
    ],
    steps: [
      { num: "01", title: "Enable notifications", desc: "Allow Vishara to send notifications — takes one tap. The system then silently monitors all family health timelines." },
      { num: "02", title: "Receive smart alerts", desc: "Alerts are specific: 'Riya's DPT booster is due in 3 days', 'Papa's Amlodipine refill is due this week', 'Amma's annual check-up is 2 months overdue'." },
      { num: "03", title: "Act directly from the notification", desc: "Tap the alert to book an appointment, refill a prescription or mark a task as done — without opening the app." },
    ],
    actionLabel: "Book Appointment",
    actionTo: "/appointments",
    details: [
      { heading: "How does Vishara know what alerts to send?", body: "Vishara builds a health timeline for each family member from their records, prescriptions and appointments. It cross-references with standard medical guidelines (e.g., annual checkup intervals, vaccine schedules) to generate alerts." },
      { heading: "Can I customise or mute alerts?", body: "Yes. In notification settings, you can choose which types of alerts you receive, set quiet hours (e.g., no alerts after 10 PM) and snooze individual alerts." },
      { heading: "Are alerts sent to all family members or just the account holder?", body: "Alerts go to the account holder by default. Caregiver accounts also receive alerts for members they are assigned to. Members with their own login get alerts for their own profile." },
    ],
  },
  privacy: {
    icon: Shield,
    gradFrom: "from-primary", gradTo: "to-primary-glow",
    title: "Privacy Controls",
    tagline: "Your health data. Your rules.",
    description:
      "Every adult family member has complete, granular control over their own health data. You decide what other family members can see, what is shared with doctors, and what stays completely private — record by record. Sensitive data is private by default.",
    highlights: [
      "Per-record privacy settings: Private / Family / Doctor-only",
      "Adult members control their own data independently",
      "Children's data managed by a designated guardian",
      "Complete data deletion available at any time",
    ],
    steps: [
      { num: "01", title: "Open any record or prescription", desc: "Tap the lock icon on any document, prescription or health entry in your profile." },
      { num: "02", title: "Choose visibility", desc: "Set to: 🔒 Private (only you), 👨‍👩‍👧 Family (all family members), or 🩺 Doctor-only (shared only during consultations)." },
      { num: "03", title: "Change privacy settings anytime", desc: "You can update the privacy of any record at any time. It takes effect immediately with no impact on the data itself." },
    ],
    actionLabel: "Manage Your Records",
    actionTo: "/records",
    details: [
      { heading: "Can family members see my prescriptions by default?", body: "No. All records are Private by default. You must explicitly set a record to 'Family' visibility for other members to see it. Nothing is shared without your action." },
      { heading: "What about data security in the cloud?", body: "All Vishara data is encrypted with AES-256 at rest and TLS 1.3 in transit. We are DPDP (Digital Personal Data Protection) Act 2023 compliant and ISO 27001 certified." },
      { heading: "Can I delete all my data from Vishara?", body: "Yes. From Settings → Privacy → Delete My Data, you can permanently delete your entire health record and account. Deletion is irreversible and completes within 30 days per DPDP guidelines." },
    ],
  },
  caregiver: {
    icon: Heart,
    gradFrom: "from-primary-glow", gradTo: "to-accent",
    title: "Caregiver Mode",
    tagline: "Care for your loved ones — even from far away.",
    description:
      "Designate a trusted family member as a caregiver for any dependent family member — an elderly parent, a young child, or someone with a chronic illness. The caregiver gets full access to manage their health: book appointments, set reminders, view records and receive alerts — even from another city.",
    highlights: [
      "Assign any family member as a caregiver to another",
      "Caregiver can book, reschedule and cancel appointments",
      "Full health record and prescription access for their member",
      "Works remotely — caregiver can be in another city",
    ],
    steps: [
      { num: "01", title: "Open the family member's profile", desc: "Go to Health Records, select the elderly or dependent family member, and tap 'Assign Caregiver'." },
      { num: "02", title: "Choose a caregiver", desc: "Select any other family member from your account as the caregiver. They immediately get access to that person's profile." },
      { num: "03", title: "Caregiver takes full responsibility", desc: "The designated caregiver can book appointments, set medication reminders, upload records and receive all health alerts for that person." },
    ],
    actionLabel: "Book an Appointment",
    actionTo: "/appointments",
    details: [
      { heading: "Can the caregiver be in another city?", body: "Yes, absolutely. Caregiver Mode is designed for exactly this situation — a son in Bengaluru managing his parents' health in a village. Everything is done remotely via the Vishara app." },
      { heading: "Can there be multiple caregivers for one person?", body: "Yes. You can assign up to 3 caregivers per family member. For example, both an adult son and a daughter-in-law can be caregivers for the same elderly parent." },
      { heading: "Can the person override the caregiver?", body: "If the member has their own Vishara account, they retain full control and can override any caregiver action. Caregiver access is additive, not replacing the member's own access." },
    ],
  },
};

function FamilyCareFeaturePage() {
  const { id } = Route.useParams();
  const f = features[id];

  if (!f) {
    return (
      <DashboardShell>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Feature not found.</p>
          <Link to="/family-care" className="mt-4 inline-block text-primary font-semibold">← Back to Family Care</Link>
        </div>
      </DashboardShell>
    );
  }

  const Icon = f.icon;

  return (
    <DashboardShell>
      {/* Back */}
      <Link
        to="/family-care"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Family Care
      </Link>

      {/* Hero */}
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

      {/* FAQ */}
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
            <Link to="/family-care">
              <button className="h-12 px-8 rounded-full bg-white/20 text-white font-semibold hover:bg-white/30 transition-colors backdrop-blur">
                ← Other Family Features
              </button>
            </Link>
          </div>
        </div>
      </section>
    </DashboardShell>
  );
}
