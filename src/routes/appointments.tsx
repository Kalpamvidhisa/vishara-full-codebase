import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Check, Stethoscope } from "lucide-react";
import { toast } from "sonner";
import { addDoc, collection, serverTimestamp, updateDoc, doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { sendSms } from "@/lib/api/sms.functions";
import { getUser } from "@/lib/auth";
import { onAuthStateChanged, type User as FirebaseUser } from "firebase/auth";

export const Route = createFileRoute("/appointments")({
  head: () => ({ meta: [{ title: "Book Appointment · Vishara" }] }),
  component: AppointmentsPage,
});

const doctors = [
  { id: "uid_doctor_anjali", name: "Dr. Anjali Mehta", spec: "General Physician", fee: 299, color: "from-primary to-primary-glow", phone: "+91 98765 43210" },
  { id: "uid_doctor_rajesh", name: "Dr. Rajesh Kumar", spec: "Cardiologist", fee: 599, color: "from-accent to-primary", phone: "+91 98765 43211" },
  { id: "uid_doctor_priya", name: "Dr. Priya Nair", spec: "Pediatrician", fee: 399, color: "from-primary-glow to-accent", phone: "+91 98765 43212" },
  { id: "uid_doctor_arvind", name: "Dr. Arvind Rao", spec: "Dermatologist", fee: 449, color: "from-primary to-accent", phone: "+91 98765 43213" },
];

const slots = ["09:00", "10:30", "12:00", "14:00", "16:30", "18:00"];

function AppointmentsPage() {
  const [doctorId, setDoctorId] = useState(doctors[0].id);
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [confirmed, setConfirmed] = useState<{ doctor: string; date: string; slot: string; smsResult: "sent" | "skipped" | "failed" } | null>(null);
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);

  const doctor = useMemo(() => doctors.find((d) => d.id === doctorId)!, [doctorId]);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  async function book() {
    if (!date || !slot) {
      toast.error("Please select a date and a time slot");
      return;
    }

    if (!currentUser) {
      toast.error("You must be signed in to book an appointment.");
      return;
    }

    try {
      const appointmentRef = await addDoc(collection(db, "appointments"), {
        uid: currentUser.uid,
        doctorName: doctor.name,
        specialty: doctor.spec,
        date,
        time: slot,
        fee: doctor.fee,
        smsStatus: "pending",
        createdAt: new Date(),
      });

      toast.success("Appointment confirmed!");

      // Send SMS confirmation (server-side Twilio) and record a log in Firestore.
      let smsResult: "sent" | "skipped" | "failed" = "skipped";
      try {
        // 1. Try localStorage first (set during login)
        const localUser = getUser();
        let rawPhone = localUser?.phone?.replace(/^\+91/, "").trim();

        // 2. Fallback: read phone from Firestore users/{uid} document
        if (!rawPhone) {
          try {
            const userSnap = await getDoc(doc(db, "users", currentUser.uid));
            if (userSnap.exists()) {
              const userData = userSnap.data();
              rawPhone = (userData.phone ?? "").replace(/^\+91/, "").trim();
            }
          } catch (fetchErr) {
            console.warn("Could not fetch phone from Firestore:", fetchErr);
          }
        }

        const to = rawPhone ? `+91${rawPhone}` : undefined;

        // Format date nicely e.g. "19 June 2026"
        const formattedDate = new Date(date).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

        const body =
          `Hi! Your Vishara appointment is confirmed.\n` +
          `Doctor: ${doctor.name} (${doctor.spec})\n` +
          `Date: ${formattedDate}\n` +
          `Time: ${slot}\n` +
          `Fee: \u20B9${doctor.fee}\n` +
          `Please arrive 10 mins early. For help call 1800-VISHARA.`;

        if (!to) {
          console.warn("SMS skipped: no phone number found in localStorage or Firestore.");
          smsResult = "skipped";
          await updateDoc(appointmentRef, { smsStatus: "skipped" });
        } else {
          try {
            await sendSms({ data: { to, body, apiKey: import.meta.env.VITE_SMS_API_KEY } });
            await addDoc(collection(db, "sms_logs"), {
              uid: currentUser.uid,
              to,
              body,
              status: "sent",
              appointment: { doctor: doctor.name, date, slot },
              createdAt: serverTimestamp(),
            });
            await updateDoc(appointmentRef, { smsStatus: "sent" });
            smsResult = "sent";
          } catch (err: any) {
            console.error("SMS send failed:", err);
            await addDoc(collection(db, "sms_logs"), {
              uid: currentUser.uid,
              to,
              body,
              status: "failed",
              error: String(err?.message ?? err),
              appointment: { doctor: doctor.name, date, slot },
              createdAt: serverTimestamp(),
            });
            await updateDoc(appointmentRef, { smsStatus: "failed" });
            smsResult = "failed";
          }
        }
      } catch (err) {
        console.error("SMS enqueue failed:", err);
        smsResult = "failed";
      }

      setConfirmed({ doctor: doctor.name, date, slot, smsResult });
    } catch (error) {
      console.error(error);
      toast.error("Failed to save appointment");
    }
  }

  if (confirmed) {
    return (
      <DashboardShell>
        <div className="max-w-lg mx-auto bg-card border border-border rounded-3xl shadow-card p-10 text-center">
          <div className="w-16 h-16 rounded-full bg-success/15 grid place-items-center mx-auto">
            <Check className="w-8 h-8 text-success" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Appointment confirmed</h1>
          <p className="mt-2 text-muted-foreground">
            {confirmed.smsResult === "sent"
              ? "✅ A confirmation SMS has been sent to your phone."
              : confirmed.smsResult === "failed"
              ? "⚠️ Appointment saved, but SMS could not be sent. Please note your booking details below."
              : "📋 Appointment saved. No phone number on file — SMS was not sent."}
          </p>
          <div className="mt-6 text-left bg-secondary/50 rounded-2xl p-5 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Doctor</span><span className="font-semibold">{confirmed.doctor}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Date</span><span className="font-semibold">{confirmed.date}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Time</span><span className="font-semibold">{confirmed.slot}</span></div>
          </div>
          <Button
            onClick={() => { setConfirmed(null); setSlot(""); setDate(""); }}
            className="mt-6 w-full h-12 rounded-xl bg-gradient-primary shadow-soft hover:shadow-glow"
          >
            Book another
          </Button>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary grid place-items-center shadow-soft">
          <CalendarCheck className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Book an Appointment</h1>
          <p className="text-sm text-muted-foreground">Choose a doctor, pick a date and a convenient time.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          {/* Doctors */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <h2 className="font-semibold mb-4">Select Doctor</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {doctors.map((d) => {
                const active = d.id === doctorId;
                return (
                  <button
                    key={d.id} onClick={() => setDoctorId(d.id)}
                    className={`text-left p-4 rounded-2xl border transition-all ${active ? "border-primary bg-primary/5 shadow-soft" : "border-border hover:bg-secondary/50"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${d.color} grid place-items-center text-primary-foreground font-bold`}>
                        {d.name.split(" ")[1][0]}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.spec} · ₹{d.fee}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <h2 className="font-semibold mb-4">Select Date</h2>
            <input
              type="date" min={today} value={date}
              onChange={(e) => setDate(e.target.value)}
              className="h-12 px-4 rounded-xl border border-border bg-background w-full max-w-xs"
            />
          </div>

          {/* Slots */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-soft">
            <h2 className="font-semibold mb-4">Select Time</h2>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {slots.map((s) => (
                <button
                  key={s} onClick={() => setSlot(s)}
                  className={`h-11 rounded-xl text-sm font-semibold border transition-colors ${slot === s
                    ? "border-primary bg-gradient-primary text-primary-foreground"
                    : "border-border hover:bg-secondary"
                    }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <aside className="bg-card border border-border rounded-2xl p-6 shadow-card h-fit lg:sticky lg:top-24">
          <h2 className="font-semibold">Summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <Row label="Doctor" value={doctor.name} />
            <Row label="Specialty" value={doctor.spec} />
            <Row label="Date" value={date || "—"} />
            <Row label="Time" value={slot || "—"} />
            <div className="border-t border-border pt-3 flex justify-between font-semibold">
              <span>Total</span><span>₹{doctor.fee}</span>
            </div>
          </div>

          <Button
            onClick={book}
            className="mt-6 w-full h-12 rounded-xl bg-gradient-primary shadow-soft hover:shadow-glow text-base"
          >
            <Stethoscope className="w-4 h-4 mr-2" /> Confirm booking
          </Button>
        </aside>
      </div>
    </DashboardShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
