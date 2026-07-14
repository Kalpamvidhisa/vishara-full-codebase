export function getGeminiApiKey(): string | null {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem("vishara_gemini_api_key");
    if (saved && saved.trim() !== "") {
      return saved.trim();
    }
  }
  return (import.meta.env.VITE_GEMINI_API_KEY as string) || null;
}

export function setGeminiApiKey(key: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("vishara_gemini_api_key", key.trim());
  }
}

export function clearGeminiApiKey(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vishara_gemini_api_key");
  }
}

export function hasGeminiApiKey(): boolean {
  return !!getGeminiApiKey();
}

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const SYSTEM_INSTRUCTION = `You are "Vishara AI", an empathetic, expert virtual health assistant for rural telemedicine.
Your goal is to help patients understand their symptoms and provide actionable guidance.

Rules:
1. Be polite, clear, and avoid excessive medical jargon. Use simple, reassuring language.
2. ALWAYS add a disclaimer that your guidance is not a replacement for professional medical advice, diagnosis, or treatment.
3. Keep answers concise (max 3 short paragraphs).
4. Based on the symptoms, if they are severe, suggest emergency services.
5. If the patient asks for actions, recommend next steps clearly.
6. At the very end of your response, if you recommend a doctor, a specialist, or emergency services, append one of the following hidden command markers on a new line (use the exact formatting):
[SUGGEST: Book General Physician] - for general illnesses like fever, cold, stomach upset, mild symptoms, etc.
[SUGGEST: Book Specialist] - for specific issues requiring specialty care (e.g. skin, heart, eyes, teeth, bone pain).
[SUGGEST: Open Emergency SOS] - for severe symptoms like chest pain, severe trouble breathing, heavy bleeding, stroke symptoms, etc.

Do not use these markers if the patient is just saying hello or asking general non-clinical questions. Use at most one marker per message.`;

export async function askGeminiChat(history: ChatMessage[], nextMessage: string): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("No Gemini API key configured.");
  }

  // Format conversation history for Gemini API
  const contents = [
    ...history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }]
    })),
    {
      role: "user",
      parts: [{ text: nextMessage }]
    }
  ];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents,
          systemInstruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }]
          },
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 1024,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Gemini API Error: ${msg}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) {
      throw new Error("Empty response received from Gemini.");
    }

    return replyText;
  } catch (error: any) {
    console.error("Gemini Chat call failed:", error);
    throw error;
  }
}

export async function askGeminiVision(
  prompt: string,
  base64Data: string,
  mimeType: string
): Promise<string> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error("No Gemini API key configured.");
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                {
                  inlineData: {
                    mimeType: mimeType,
                    data: base64Data
                  }
                }
              ]
            }
          ],
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.4,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = errorData?.error?.message || `HTTP ${response.status} ${response.statusText}`;
      throw new Error(`Gemini Vision API Error: ${msg}`);
    }

    const data = await response.json();
    const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) {
      throw new Error("Empty response received from Gemini Vision.");
    }

    return replyText;
  } catch (error: any) {
    console.error("Gemini Vision call failed:", error);
    throw error;
  }
}
