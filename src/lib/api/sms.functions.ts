import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

// Simple API-key guard: set `SMS_API_KEY` on the server and provide the matching
// `VITE_SMS_API_KEY` on the client for development. This is not as secure as
// verifying ID tokens but is fast to add for testing.
export const sendSms = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      to: z.string().min(1),
      body: z.string().min(1),
      apiKey: z.string().optional(),
    })
  )
  .handler(async ({ data }) => {
    const serverKey = process.env.SMS_API_KEY;
    if (!serverKey) {
      throw new Error("Server SMS_API_KEY is not configured.");
    }

    if (data.apiKey !== serverKey) {
      throw new Error("Unauthorized: invalid SMS API key.");
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error("Twilio credentials (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER) are required on the server.");
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const body = new URLSearchParams({ To: data.to, From: fromNumber, Body: data.body });

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Twilio send failed: ${res.status} ${text}`);
    }

    return { success: true };
  });
