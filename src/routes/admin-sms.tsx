import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/DashboardShell";
import { useEffect, useState } from "react";
import { collection, query, orderBy, addDoc, limit, onSnapshot, doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { sendSms } from "@/lib/api/sms.functions";
import { format } from "date-fns";

export const Route = createFileRoute("/admin-sms")({
  head: () => ({ meta: [{ title: "Admin · SMS Logs" }] }),
  component: AdminSmsPage,
});

function AdminSmsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    // Check admin role first
    async function checkAdmin() {
      try {
        const user = auth.currentUser;
        if (!user) {
          setIsAdmin(false);
          return;
        }
        const uDoc = await getDoc(doc(db, "users", user.uid));
        const data = uDoc.exists() ? uDoc.data() : null;
        const admin = data && ((data.role && data.role === "admin") || data.isAdmin === true);
        setIsAdmin(Boolean(admin));
      } catch (err) {
        console.error("Failed to verify admin:", err);
        setIsAdmin(false);
      }
    }

    checkAdmin();

    // Subscribe to logs regardless; the UI will gate rendering by isAdmin.
    setLoading(true);
    const q = query(collection(db, "sms_logs"), orderBy("createdAt", "desc"), limit(200));
    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error("SMS logs snapshot error:", err);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // fetchLogs is now a no-op: onSnapshot above already streams live updates.
  // Keeping the button wired to a lightweight forceRefresh for UX clarity.
  function fetchLogs() {
    setLoading(true);
    const q = query(collection(db, "sms_logs"), orderBy("createdAt", "desc"), limit(200));
    const unsub = onSnapshot(q, (snap) => {
      setLogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, (err) => {
      console.error("SMS logs refresh error:", err);
      setLoading(false);
    });
    // Immediately unsubscribe after first snapshot (one-shot manual refresh)
    return () => unsub();
  }

  async function handleResend(log: any) {
    try {
      await sendSms({ data: { to: log.to, body: log.body, apiKey: import.meta.env.VITE_SMS_API_KEY } });
      await addDoc(collection(db, "sms_logs"), {
        uid: log.uid ?? null,
        to: log.to,
        body: log.body,
        status: "resent",
        refId: log.id,
        createdAt: new Date(),
      });
      // onSnapshot listener will update logs automatically
    } catch (err) {
      console.error("Resend failed:", err);
      await addDoc(collection(db, "sms_logs"), {
        uid: log.uid ?? null,
        to: log.to,
        body: log.body,
        status: "resend_failed",
        error: String(err),
        refId: log.id,
        createdAt: new Date(),
      });
    }
  }

  if (isAdmin === null) {
    return (
      <DashboardShell>
        <div className="max-w-5xl mx-auto py-16 text-center">Checking permissions…</div>
      </DashboardShell>
    );
  }

  if (!isAdmin) {
    return (
      <DashboardShell>
        <div className="max-w-5xl mx-auto py-16 text-center">
          <h1 className="text-xl font-bold">Not authorized</h1>
          <p className="text-sm text-muted-foreground mt-2">You do not have permission to view SMS logs.</p>
          <div className="mt-6">
            <Link to="/dashboard" className="text-sm text-primary">Back to dashboard</Link>
          </div>
        </div>
      </DashboardShell>
    );
  }

  return (
    <DashboardShell>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">SMS Logs</h1>
          <div className="flex items-center gap-2">
            <Button onClick={fetchLogs} disabled={loading}>{loading ? "Refreshing..." : "Refresh"}</Button>
            <Link to="/dashboard" className="text-sm text-muted-foreground">Back</Link>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl p-4">
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground">No SMS logs found.</p>
          ) : (
            <div className="space-y-3">
              {logs.map((l) => (
                <div key={l.id} className="p-3 border border-border rounded-lg flex items-start justify-between">
                  <div className="min-w-0">
                    <div className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                    <span>To: <span className="font-mono">{l.to}</span></span>
                    <span>·</span>
                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                      l.status === "sent" || l.status === "resent"
                        ? "bg-success/10 text-success"
                        : l.status === "failed" || l.status === "resend_failed"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-muted text-muted-foreground"
                    }`}>{l.status}</span>
                  </div>
                    <div className="font-medium mt-1">{l.body}</div>
                    <div className="text-xs text-muted-foreground mt-2">{l.appointment ? `${l.appointment.doctor} · ${l.appointment.date} ${l.appointment.slot || ''}` : ''} — {l.createdAt ? (typeof l.createdAt === 'object' && l.createdAt.toDate ? format(l.createdAt.toDate(), 'PPpp') : String(l.createdAt)) : ''}</div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <Button onClick={() => handleResend(l)}>Resend</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
