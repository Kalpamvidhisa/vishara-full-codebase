import { createFileRoute } from "@tanstack/react-router";
import { jsPDF } from "jspdf";
import { DashboardShell } from "@/components/DashboardShell";
import { FileHeart, Download } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/health-report")({
    component: HealthReportPage,
});

const patient = {
    name: "Vidhisa Kalpam",
    age: 20,
    bloodGroup: "B+",
    allergies: "None",
    phone: "9876543210",
};

const appointments = [
    {
        doctor: "Dr. Rajesh Kumar",
        date: "2026-06-09",
        time: "10:30 AM",
    },
    {
        doctor: "Dr. Anjali Mehta",
        date: "2026-05-18",
        time: "02:00 PM",
    },
];

const medicalHistory = [
    "General Consultation",
    "Annual Health Checkup",
    "Skin Allergy Review",
];

function HealthReportPage() {
    const downloadPDF = () => {
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text("Vishara Health Report", 20, 20);

        doc.setFontSize(12);
        doc.text(`Name: ${patient.name}`, 20, 40);
        doc.text(`Age: ${patient.age}`, 20, 50);
        doc.text(`Blood Group: ${patient.bloodGroup}`, 20, 60);
        doc.text(`Allergies: ${patient.allergies}`, 20, 70);
        doc.text(`Phone: ${patient.phone}`, 20, 80);

        doc.text("Medical History", 20, 100);

        let y = 110;

        medicalHistory.forEach((item) => {
            doc.text(`• ${item}`, 25, y);
            y += 10;
        });

        y += 10;

        doc.text("Appointments", 20, y);

        y += 10;

        appointments.forEach((a) => {
            doc.text(
                `${a.date} | ${a.time} | ${a.doctor}`,
                25,
                y
            );
            y += 10;
        });

        doc.save("Vishara_Health_Report.pdf");

        toast.success("Health Report Downloaded");
    };

    return (
        <DashboardShell>
            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary grid place-items-center">
                        <FileHeart className="w-6 h-6 text-white" />
                    </div>

                    <div>
                        <h1 className="text-3xl font-bold">
                            Health Report
                        </h1>
                        <p className="text-muted-foreground">
                            Download and view your complete health summary.
                        </p>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-semibold text-lg mb-4">
                        Patient Information
                    </h2>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <p><strong>Name:</strong> {patient.name}</p>
                            <p><strong>Age:</strong> {patient.age}</p>
                        </div>

                        <div>
                            <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                            <p><strong>Phone:</strong> {patient.phone}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-semibold text-lg mb-4">
                        Medical History
                    </h2>

                    <ul className="space-y-2">
                        {medicalHistory.map((item) => (
                            <li key={item}>
                                • {item}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-card border border-border rounded-2xl p-6">
                    <h2 className="font-semibold text-lg mb-4">
                        Appointment History
                    </h2>

                    <div className="space-y-3">
                        {appointments.map((appointment, index) => (
                            <div
                                key={index}
                                className="p-3 rounded-xl border border-border"
                            >
                                <p>
                                    <strong>Doctor:</strong>{" "}
                                    {appointment.doctor}
                                </p>

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {appointment.date}
                                </p>

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {appointment.time}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={downloadPDF}
                    className="h-12 px-6 rounded-xl bg-gradient-primary text-white inline-flex items-center gap-2"
                >
                    <Download className="w-4 h-4" />
                    Download PDF Report
                </button>
            </div>
        </DashboardShell>
    );
}