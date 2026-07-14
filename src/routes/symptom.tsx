import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { DashboardShell } from "@/components/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Activity,
  Bot,
  Send,
  User,
  Stethoscope,
  Settings,
  Key,
  AlertCircle,
  Sparkles,
  RefreshCw,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  getGeminiApiKey,
  setGeminiApiKey,
  clearGeminiApiKey,
  hasGeminiApiKey,
  askGeminiChat,
} from "@/lib/gemini";

export const Route = createFileRoute("/symptom")({
  head: () => ({ meta: [{ title: "AI Symptom Checker · Vishara" }] }),
  component: SymptomPage,
});

type Msg = { role: "user" | "bot"; text: string; suggest?: string[] };

const INTRO: Msg = {
  role: "bot",
  text: "Hi, I'm Vishara AI, your healthcare virtual assistant. Tell me how you're feeling — for example, 'I have a fever and sore throat for 2 days'. I can analyze your symptoms and suggest action steps.",
};

// Fallback rule-based matching if offline/no key is set
function analyze(input: string): Msg {
  const t = input.toLowerCase();
  if (/(chest pain|breath|stroke|unconscious|severe bleed|heart attack)/.test(t)) {
    return {
      role: "bot",
      text: "⚠️ These symptoms can be highly serious and life-threatening. Please seek urgent immediate attention. Use the Emergency SOS now and contact emergency services.",
      suggest: ["Open Emergency SOS"],
    };
  }
  if (/(fever|cold|cough|sore throat|flu|runny nose|headache)/.test(t)) {
    return {
      role: "bot",
      text: "You might be experiencing a common viral upper-respiratory tract infection. We suggest resting, drinking plenty of warm fluids, and monitoring your body temperature. If the symptoms or fever persist beyond 3 days, consult a physician.",
      suggest: ["Book General Physician"],
    };
  }
  if (/(stomach|vomit|loose|diarr|abdominal|nausea)/.test(t)) {
    return {
      role: "bot",
      text: "Possible gastroenteritis or stomach upset. Sip Oral Rehydration Solutions (ORS) and eat light, non-greasy foods. If diarrhea persists for more than 24 hours, or you experience high fever/severe pain, consult a doctor.",
      suggest: ["Book General Physician"],
    };
  }
  if (/(rash|skin|itch|spot|burn)/.test(t)) {
    return {
      role: "bot",
      text: "This could be related to contact dermatitis, allergy, or a localized skin issue. Avoid scratching or applying harsh soap. It is recommended to have a professional examine the area.",
      suggest: ["Book Specialist"],
    };
  }
  return {
    role: "bot",
    text: "Thank you for describing your symptoms. I recommend speaking with a general physician so they can perform a complete assessment and advise you safely.",
    suggest: ["Book General Physician"],
  };
}

function SymptomPage() {
  const [messages, setMessages] = useState<Msg[]>([INTRO]);
  const [input, setInput] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState("");
  const [isLive, setIsLive] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sync key status on mount
    const key = getGeminiApiKey();
    setApiKeyInput(key || "");
    setIsLive(!!key);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isGenerating]);

  const handleSaveKey = () => {
    const key = apiKeyInput.trim();
    if (key) {
      setGeminiApiKey(key);
      setIsLive(true);
      toast.success("Gemini API Key configured! Live AI active.");
    } else {
      clearGeminiApiKey();
      setIsLive(false);
      toast.info("Gemini API Key cleared. Running in Demo Mode.");
    }
    setShowSettings(false);
  };

  const handleClearKey = () => {
    clearGeminiApiKey();
    setApiKeyInput("");
    setIsLive(false);
    toast.info("Gemini API Key removed. Running in Demo Mode.");
  };

  async function send(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || isGenerating) return;

    const userMsg: Msg = { role: "user", text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setIsGenerating(true);

    try {
      if (isLive) {
        // Map UI messages to API format: bot -> model
        const apiHistory = messages.map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("model" as const),
          text: m.text,
        }));

        const reply = await askGeminiChat(apiHistory, text);

        let cleanReply = reply;
        const suggest: string[] = [];

        // Parse special suggestion tags injected by system instructions
        const suggestMarkers = [
          { marker: "[SUGGEST: Book General Physician]", value: "Book General Physician" },
          { marker: "[SUGGEST: Book Specialist]", value: "Book Specialist" },
          { marker: "[SUGGEST: Open Emergency SOS]", value: "Open Emergency SOS" },
        ];

        for (const item of suggestMarkers) {
          if (cleanReply.includes(item.marker)) {
            suggest.push(item.value);
            cleanReply = cleanReply.replace(item.marker, "");
          }
        }

        cleanReply = cleanReply.trim();

        const botMsg: Msg = {
          role: "bot",
          text: cleanReply,
          suggest: suggest.length > 0 ? suggest : undefined,
        };

        setMessages((m) => [...m, botMsg]);
      } else {
        // Simulated local fallback
        await new Promise((resolve) => setTimeout(resolve, 800));
        setMessages((m) => [...m, analyze(text)]);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to communicate with live Gemini AI.");
      
      // Fallback response showing warning
      const fallback = analyze(text);
      setMessages((m) => [
        ...m,
        {
          role: "bot",
          text: `⚠️ Live Gemini AI request encountered an error. Here is the offline diagnostic backup instead:\n\n${fallback.text}`,
          suggest: fallback.suggest,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  }

  const handleClearHistory = () => {
    setMessages([INTRO]);
    toast.success("Conversation history cleared.");
  };

  return (
    <DashboardShell>
      {/* Header with Live Status & Configure Action */}
      <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-primary grid place-items-center shadow-soft">
            <Activity className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight flex items-center gap-2">
              AI Symptom Checker
              {isLive ? (
                <span className="text-[10px] tracking-wider font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles className="w-3 h-3 text-emerald-500" /> LIVE AI ACTIVE
                </span>
              ) : (
                <span className="text-[10px] tracking-wider font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  DEMO MODE (PREVIEW)
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Get instant assessment of your health concerns powered by Gemini.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {messages.length > 1 && (
            <button
              onClick={handleClearHistory}
              title="Clear History"
              className="h-10 w-10 border border-border/80 hover:bg-destructive/10 hover:text-destructive text-muted-foreground rounded-xl flex items-center justify-center transition-colors shadow-soft bg-card cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
            className="h-10 rounded-xl flex items-center gap-2 border-border shadow-soft bg-card cursor-pointer"
          >
            <Settings className="w-4 h-4 text-muted-foreground animate-spin-hover" />
            Configure Gemini
          </Button>
        </div>
      </div>

      {/* Settings Modal (Inline Card) */}
      {showSettings && (
        <div className="mb-6 bg-card border border-border p-5 rounded-2xl shadow-soft max-w-xl animate-fade-in space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm">Gemini API Key Settings</h3>
            </div>
            {isLive && (
              <button
                onClick={handleClearKey}
                className="text-xs text-rose-500 hover:text-rose-600 font-bold hover:underline cursor-pointer"
              >
                Remove Key
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Configure a personal Gemini API Key to enable live, unmetered multi-turn diagnosis.
            Get a free key in 30 seconds from the{" "}
            <a
              href="https://aistudio.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              Google AI Studio
            </a>
            .
          </p>
          <div className="flex gap-2.5">
            <Input
              type="password"
              placeholder="Paste AI Studio Key (AIzaSy...)"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="h-11 rounded-xl bg-secondary/20"
            />
            <Button
              onClick={handleSaveKey}
              className="h-11 px-5 rounded-xl bg-gradient-primary shadow-soft text-primary-foreground font-bold cursor-pointer"
            >
              Save Key
            </Button>
          </div>
          {!isLive && (
            <div className="text-[11px] text-amber-600 dark:text-amber-400 bg-amber-500/5 border border-amber-500/10 p-3 rounded-xl flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
              <span>
                No API Key set. The analyzer will operate using local rule-based simulation.
              </span>
            </div>
          )}
        </div>
      )}

      {/* Chat Display Interface */}
      <div className="bg-card border border-border rounded-3xl shadow-soft overflow-hidden flex flex-col">
        <div className="h-[28rem] overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-secondary/20 to-transparent">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3.5 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              <div
                className={`w-9.5 h-9.5 rounded-full grid place-items-center flex-shrink-0 ${
                  m.role === "user" ? "bg-secondary" : "bg-gradient-primary shadow-soft"
                }`}
              >
                {m.role === "user" ? (
                  <User className="w-4 h-4 text-foreground" />
                ) : (
                  <Bot className="w-4.5 h-4.5 text-primary-foreground" />
                )}
              </div>
              <div
                className={`max-w-[78%] rounded-2xl px-4.5 py-3.5 text-sm leading-relaxed shadow-sm ${
                  m.role === "user"
                    ? "bg-gradient-primary text-primary-foreground rounded-tr-sm font-medium"
                    : "bg-card border border-border/80 rounded-tl-sm text-foreground whitespace-pre-wrap"
                }`}
              >
                <p>{m.text}</p>
                {m.suggest && (
                  <div className="mt-3.5 flex flex-wrap gap-2 pt-2 border-t border-border/50">
                    {m.suggest.map((s) => (
                      <Link
                        key={s}
                        to={s.includes("SOS") ? "/sos" : "/appointments"}
                        className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-card border border-border text-foreground hover:bg-secondary hover:text-foreground transition-all shadow-sm"
                      >
                        <Stethoscope className="w-3.5 h-3.5 text-primary" /> {s}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Thinking loading indicator */}
          {isGenerating && (
            <div className="flex gap-3.5">
              <div className="w-9.5 h-9.5 rounded-full bg-gradient-primary grid place-items-center flex-shrink-0 shadow-soft">
                <Bot className="w-4.5 h-4.5 text-primary-foreground" />
              </div>
              <div className="bg-card border border-border/80 rounded-2xl rounded-tl-sm px-4.5 py-3.5 text-sm leading-relaxed shadow-sm flex items-center gap-2 text-muted-foreground">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/60 animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="font-semibold text-xs tracking-wide">Vishara AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input Form Footer */}
        <form onSubmit={send} className="border-t border-border p-4 flex gap-2 bg-card/65 backdrop-blur-sm">
          <Input
            placeholder={
              isGenerating
                ? "Vishara AI is formulating response..."
                : isLive
                ? "Describe how you're feeling (e.g. cough, chest tightness)..."
                : "Ask symptom checker (Demo Mode - configure key above for Live AI)..."
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isGenerating}
            className="h-12 rounded-xl bg-secondary/10 border-border focus-visible:ring-1 focus-visible:ring-primary/45"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="h-12 px-5 rounded-xl bg-gradient-primary shadow-soft hover:shadow-glow text-primary-foreground font-bold cursor-pointer transition-all disabled:opacity-40"
          >
            <Send className="w-4.5 h-4.5" />
          </Button>
        </form>
      </div>
    </DashboardShell>
  );
}

