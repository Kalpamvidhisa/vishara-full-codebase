import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Activity, Bot, Send, User, Stethoscope } from "lucide-react";

export const Route = createFileRoute("/symptom")({
  head: () => ({ meta: [{ title: "AI Symptom Checker · Vishara" }] }),
  component: SymptomPage,
});

type Msg = { role: "user" | "bot"; text: string; suggest?: string[] };

const INTRO: Msg = {
  role: "bot",
  text: "Hi, I'm Vishara AI. Tell me how you're feeling — for example, 'fever and sore throat for 2 days'.",
};

function analyze(input: string): Msg {
  const t = input.toLowerCase();
  if (/(chest pain|breath|stroke|unconscious|severe bleed)/.test(t)) {
    return {
      role: "bot",
      text: "These symptoms can be serious. Please use the Emergency SOS now and contact a doctor immediately.",
      suggest: ["Open Emergency SOS"],
    };
  }
  if (/(fever|cold|cough|sore throat|flu)/.test(t)) {
    return {
      role: "bot",
      text: "Likely a viral upper-respiratory infection. Rest, stay hydrated and monitor temperature. If fever persists beyond 3 days or crosses 102°F, consult a General Physician.",
      suggest: ["Book General Physician"],
    };
  }
  if (/(stomach|vomit|loose|diarr)/.test(t)) {
    return {
      role: "bot",
      text: "Possible gastroenteritis. Sip ORS, eat light food. If symptoms persist >24h or you notice blood, book a doctor.",
      suggest: ["Book General Physician"],
    };
  }
  if (/(headache|migraine)/.test(t)) {
    return {
      role: "bot",
      text: "Could be tension headache or migraine. Rest in a dim room and hydrate. Recurring headaches need a neurologist consult.",
      suggest: ["Book Specialist"],
    };
  }
  return {
    role: "bot",
    text: "Thanks for sharing. I'd recommend a quick teleconsultation so a doctor can review your symptoms in detail.",
    suggest: ["Book a doctor"],
  };
}

function SymptomPage() {
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");

  function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text) return;
    const userMsg: Msg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => setMessages((m) => [...m, analyze(text)]), 600);
  }

  return (
    <DashboardShell>
      <div className="mb-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-primary grid place-items-center shadow-soft">
          <Activity className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">AI Symptom Checker</h1>
          <p className="text-sm text-muted-foreground">Get instant guidance. Not a replacement for medical advice.</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl shadow-soft overflow-hidden">
        <div className="h-[28rem] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-secondary/30 to-transparent">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`w-9 h-9 rounded-full grid place-items-center flex-shrink-0 ${
                m.role === "user" ? "bg-secondary" : "bg-gradient-primary"
              }`}>
                {m.role === "user"
                  ? <User className="w-4 h-4" />
                  : <Bot className="w-4 h-4 text-primary-foreground" />}
              </div>
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-soft ${
                m.role === "user"
                  ? "bg-gradient-primary text-primary-foreground rounded-tr-sm"
                  : "bg-card border border-border rounded-tl-sm"
              }`}>
                <p>{m.text}</p>
                {m.suggest && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {m.suggest.map((s) => (
                      <Link
                        key={s}
                        to={s.includes("SOS") ? "/sos" : "/appointments"}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-card border border-border text-foreground hover:bg-secondary transition-colors"
                      >
                        <Stethoscope className="w-3 h-3" /> {s}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={send} className="border-t border-border p-4 flex gap-2 bg-card">
          <Input
            placeholder="Describe your symptoms…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="h-12 rounded-xl"
          />
          <Button type="submit" className="h-12 px-5 rounded-xl bg-gradient-primary shadow-soft hover:shadow-glow">
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </DashboardShell>
  );
}
