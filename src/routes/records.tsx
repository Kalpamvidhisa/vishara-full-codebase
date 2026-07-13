import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import {
  FileHeart,
  Download,
  FileText,
  Pill,
  Activity,
} from "lucide-react";
import { toast } from "sonner";
import { getUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";

export const Route = createFileRoute("/records")({
  head: () => ({ meta: [{ title: "Health Records & Vault · Vishara" }] }),
  component: RecordsPage,
});

const profile = {
  age: 34,
  blood: "B+",
  allergies: "Penicillin",
};

const history = [
  { date: "2026-04-12", title: "General consultation", doctor: "Dr. Anjali Mehta", note: "Mild fever and cough. Advised rest." },
  { date: "2025-12-02", title: "Annual health check-up", doctor: "Dr. Rajesh Kumar", note: "All vitals normal." },
  { date: "2025-08-21", title: "Skin allergy review", doctor: "Dr. Arvind Rao", note: "Prescribed antihistamine." },
];

const prescriptions = [
  { name: "Paracetamol 500mg", dose: "1 tab · 3× daily · 5 days" },
  { name: "Cetirizine 10mg", dose: "1 tab · at night · 7 days" },
];

const reports = [
  { name: "CBC Blood Report", date: "2026-04-10" },
  { name: "Lipid Profile", date: "2025-12-02" },
  { name: "Chest X-Ray", date: "2025-08-15" },
];

function downloadPrescriptionPDF(name: string, dose: string, patientName: string) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 0, 210, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("VISHARA HEALTHCARE", 20, 22);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Digital Prescription Record", 20, 29);
  
  // Content
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.text("Patient Name:", 20, 50);
  doc.setFont("helvetica", "bold");
  doc.text(patientName, 65, 50);
  
  doc.setFont("helvetica", "normal");
  doc.text("Allergies Recorded:", 20, 58);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(220, 38, 38);
  doc.text(profile.allergies, 65, 58);
  
  doc.setTextColor(50, 50, 50);
  doc.setFont("helvetica", "normal");
  doc.text("Date:", 20, 66);
  doc.setFont("helvetica", "bold");
  doc.text(new Date().toLocaleDateString(), 65, 66);
  
  doc.line(20, 75, 190, 75);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Rx Medication details:", 20, 86);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(59, 130, 246);
  doc.text(name, 25, 96);
  
  doc.setFont("helvetica", "normal");
  doc.setTextColor(80, 80, 80);
  doc.text(`Instructions: ${dose}`, 25, 104);
  
  // Signature section
  doc.line(20, 130, 190, 130);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("This is an electronically signed document generated through the Vishara telemedicine app.", 20, 140);
  doc.text("For query contact: support@vishara-health-connect.firebaseapp.com", 20, 145);
  
  doc.save(`${name.replace(/\s+/g, "_")}_Prescription.pdf`);
  toast.success(`Prescription ${name} downloaded`);
}

function downloadReportPDF(name: string, date: string, patientName: string) {
  const doc = new jsPDF();
  
  // Header
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 0, 210, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("VISHARA HEALTHCARE", 20, 22);
  
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Laboratory & Diagnostic Report", 20, 29);
  
  // Content
  doc.setTextColor(50, 50, 50);
  doc.setFontSize(11);
  doc.text("Patient Name:", 20, 50);
  doc.setFont("helvetica", "bold");
  doc.text(patientName, 65, 50);
  
  doc.setFont("helvetica", "normal");
  doc.text("Report Name:", 20, 58);
  doc.setFont("helvetica", "bold");
  doc.text(name, 65, 58);
  
  doc.setFont("helvetica", "normal");
  doc.text("Test Date:", 20, 66);
  doc.setFont("helvetica", "bold");
  doc.text(date, 65, 66);
  
  doc.line(20, 75, 190, 75);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Results Summary:", 20, 86);
  
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("All medical checks for this test item fall within safe physiological limits.", 25, 96);
  doc.text("No anomaly was flagged by the lab pathologist.", 25, 102);
  
  // Footer
  doc.line(20, 130, 190, 130);
  doc.setFontSize(9);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(150, 150, 150);
  doc.text("This report is for telemedicine consultation screening. Please review with your doctor.", 20, 140);
  
  doc.save(`${name.replace(/\s+/g, "_")}_Report.pdf`);
  toast.success(`Lab Report ${name} downloaded`);
}

function RecordsPage() {
  const [userName, setUserName] = useState("Patient");

  useEffect(() => {
    const user = getUser();
    if (user?.name) {
      setUserName(user.name);
    }
  }, []);

  return (
    <DashboardShell>
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary grid place-items-center shadow-soft">
          <FileHeart className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Health Records</h1>
          <p className="text-sm text-muted-foreground">Manage your files, medical history, prescriptions, and lab diagnostic reports.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <section className="bg-gradient-hero border border-border rounded-3xl p-6 md:p-8 shadow-soft">
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { k: "Name", v: userName },
              { k: "Age", v: `${profile.age} yrs` },
              { k: "Blood group", v: profile.blood },
              { k: "Allergies", v: profile.allergies },
            ].map((i) => (
              <div key={i.k} className="bg-card/80 backdrop-blur rounded-2xl p-4 border border-border">
                <p className="text-xs text-muted-foreground">{i.k}</p>
                <p className="font-semibold mt-1 text-foreground">{i.v}</p>
              </div>
            ))}
          </div>
        </section>

        {/* History and Prescriptions */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* History */}
          <section className="bg-card border border-border rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-lg text-foreground">Medical history</h2>
            </div>
            <ul className="space-y-4">
              {history.map((h) => (
                <li key={h.date} className="border-l-2 border-primary/40 pl-4">
                  <p className="text-xs text-muted-foreground">{h.date}</p>
                  <p className="font-semibold mt-0.5 text-foreground">{h.title}</p>
                  <p className="text-xs text-muted-foreground">{h.doctor}</p>
                  <p className="text-sm mt-1.5 text-foreground">{h.note}</p>
                </li>
              ))}
            </ul>
          </section>

          {/* Prescriptions */}
          <section className="bg-card border border-border rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-lg text-foreground">Active prescriptions</h2>
            </div>
            <ul className="space-y-3">
              {prescriptions.map((p) => (
                <li key={p.name} className="flex items-start justify-between gap-3 p-3.5 rounded-xl bg-secondary/50">
                  <div>
                    <p className="font-semibold text-foreground text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.dose}</p>
                  </div>
                  <button
                    onClick={() => downloadPrescriptionPDF(p.name, p.dose, userName)}
                    className="text-xs font-semibold text-primary inline-flex items-center gap-1 hover:gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="w-3 h-3" /> PDF
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Reports */}
          <section className="lg:col-span-2 bg-card border border-border rounded-2xl shadow-soft p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-lg text-foreground">Reports & lab results</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {reports.map((r) => (
                <div key={r.name} className="p-5 rounded-2xl border border-border hover:bg-secondary/50 hover:border-border/80 transition-all flex flex-col justify-between">
                  <div>
                    <FileText className="w-7 h-7 text-primary" />
                    <p className="mt-3 font-semibold text-sm text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{r.date}</p>
                  </div>
                  <button
                    onClick={() => downloadReportPDF(r.name, r.date, userName)}
                    className="mt-4 w-full h-10 rounded-xl bg-gradient-primary text-primary-foreground text-xs font-semibold shadow-soft hover:shadow-glow cursor-pointer transition-shadow inline-flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </DashboardShell>
  );
}
