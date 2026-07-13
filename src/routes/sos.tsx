import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Siren, Phone, Ambulance, MapPin, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/sos")({
  head: () => ({ meta: [{ title: "Emergency SOS · Vishara" }] }),
  component: SosPage,
});

const hospitals = [
  { name: "Rural Health Centre", dist: "2.4 km", phone: "108" },
  { name: "District General Hospital", dist: "6.1 km", phone: "102" },
  { name: "City Medical Centre", dist: "11.8 km", phone: "1066" },
];

const contacts = [
  { label: "Ambulance", number: "108", icon: Ambulance },
  { label: "Family doctor", number: "+91 98765 43210", icon: Phone },
  { label: "Emergency contact", number: "+91 91234 56780", icon: ShieldAlert },
];

function SosPage() {
  const [triggered, setTriggered] = useState(false);

  function trigger() {
    setTriggered(true);
    toast.success("SOS sent · Ambulance dispatched · Family notified");
  }

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-sos grid place-items-center shadow-soft">
          <Siren className="w-6 h-6 text-destructive-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Emergency SOS</h1>
          <p className="text-sm text-muted-foreground">One tap connects you with the nearest hospital and dispatches help.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        {/* SOS button */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-sos text-destructive-foreground p-10 shadow-card grid place-items-center text-center min-h-[24rem]">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/10 blur-3xl" />
          <div className="relative">
            <button
              onClick={trigger}
              className="w-44 h-44 rounded-full bg-white text-destructive font-extrabold text-3xl shadow-card animate-pulse-ring hover:scale-105 transition-transform"
            >
              SOS
            </button>
            <p className="mt-8 text-lg font-semibold">
              {triggered ? "Help is on the way." : "Press and hold in an emergency"}
            </p>
            <p className="mt-1 text-sm opacity-80 max-w-sm mx-auto">
              {triggered
                ? "Stay calm. Ambulance is en route. Your live location has been shared with emergency contacts."
                : "We will share your live location, dispatch the nearest ambulance and alert your family."}
            </p>
          </div>
        </section>

        {/* Contacts */}
        <section className="bg-card border border-border rounded-3xl p-6 shadow-soft">
          <h2 className="font-semibold mb-4">Quick call</h2>
          <div className="space-y-3">
            {contacts.map((c) => (
              <a
                key={c.label} href={`tel:${c.number}`}
                className="flex items-center justify-between p-4 rounded-2xl border border-border hover:bg-secondary/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-destructive/10 text-destructive grid place-items-center">
                    <c.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.number}</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-primary">Call now</span>
              </a>
            ))}
          </div>
        </section>

        {/* Hospitals */}
        <section className="lg:col-span-2 bg-card border border-border rounded-3xl p-6 shadow-soft">
          <h2 className="font-semibold mb-4 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Nearby hospitals
          </h2>
          <div className="grid sm:grid-cols-3 gap-3">
            {hospitals.map((h) => (
              <div key={h.name} className="p-5 rounded-2xl border border-border hover:shadow-card transition-shadow">
                <p className="font-semibold">{h.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{h.dist} away</p>
                <a
                  href={`tel:${h.phone}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
                >
                  <Phone className="w-3.5 h-3.5" /> {h.phone}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Guidance */}
        <section className="lg:col-span-2 bg-gradient-hero border border-border rounded-3xl p-6 shadow-soft">
          <h2 className="font-semibold">Emergency guidance</h2>
          <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-sm">
            <li className="bg-card/80 rounded-xl p-4 border border-border">
              <strong>Stay calm.</strong> Sit or lie the patient down in a comfortable position.
            </li>
            <li className="bg-card/80 rounded-xl p-4 border border-border">
              <strong>Check breathing.</strong> If absent, begin CPR if you're trained.
            </li>
            <li className="bg-card/80 rounded-xl p-4 border border-border">
              <strong>Don't move</strong> a person with possible spine injury unless they're in danger.
            </li>
            <li className="bg-card/80 rounded-xl p-4 border border-border">
              <strong>Stay on the line</strong> with the responder until help arrives.
            </li>
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
