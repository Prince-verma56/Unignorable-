import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export interface EnquiryInput {
  name: string;
  company?: string;
  email: string;
  phone?: string;
  services: string[];
  budget?: string;
  timeline?: string;
  message: string;
}

function publicClient() {
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
  return createClient<Database>(process.env["SUPABASE_URL"]!, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const h = new Headers(init?.headers);
        if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
          h.delete("Authorization");
        }
        h.set("apikey", key);
        return fetch(input, { ...init, headers: h });
      },
    },
  });
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sendMail(payload: { to: string; subject: string; html: string }) {
  const apiKey = process.env["RESEND_API_KEY"];
  const from = process.env["AGENCY_FROM_EMAIL"] ?? "onboarding@resend.dev";
  if (!apiKey) return; // email is optional until the key is configured
  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, ...payload }),
    });
  } catch (err) {
    console.error("[enquiry] email failed", err);
  }
}

export const submitEnquiry = createServerFn({ method: "POST" })
  .inputValidator((raw: EnquiryInput) => {
    const name = String(raw?.name ?? "").trim();
    const email = String(raw?.email ?? "").trim().toLowerCase();
    const message = String(raw?.message ?? "").trim();
    if (name.length < 2) throw new Error("Name is required.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Valid email is required.");
    if (message.length < 10) throw new Error("Tell us a little more about the project.");
    return {
      name: name.slice(0, 120),
      company: String(raw.company ?? "").trim().slice(0, 160) || null,
      email: email.slice(0, 180),
      phone: String(raw.phone ?? "").trim().slice(0, 40) || null,
      services: Array.isArray(raw.services) ? raw.services.slice(0, 20).map(String) : [],
      budget: String(raw.budget ?? "").trim() || null,
      timeline: String(raw.timeline ?? "").trim() || null,
      message: message.slice(0, 4000),
    };
  })
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { error } = await supabase.from("contact_submissions").insert(data);
    if (error) {
      console.error("[enquiry] insert failed", error.message);
      throw new Error("We couldn't save your enquiry. Please try again.");
    }

    const agencyEmail = process.env["AGENCY_EMAIL"];
    const rows: [string, string][] = [
      ["Name", data.name],
      ["Company", data.company ?? "—"],
      ["Email", data.email],
      ["Phone / WhatsApp", data.phone ?? "—"],
      ["Services", data.services.join(", ") || "—"],
      ["Budget", data.budget ?? "—"],
      ["Timeline", data.timeline ?? "—"],
      ["Project description", data.message],
      ["Date", new Date().toUTCString()],
    ];

    if (agencyEmail) {
      await sendMail({
        to: agencyEmail,
        subject: `New Project Enquiry — ${data.name}`,
        html: `<h2 style="font-family:sans-serif">New project enquiry</h2>
<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
${rows
  .map(
    ([k, v]) =>
      `<tr><td style="padding:6px 14px 6px 0;color:#777">${esc(k)}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`,
  )
  .join("")}
</table>`,
      });

      await sendMail({
        to: data.email,
        subject: "Your project enquiry has landed",
        html: `<p style="font-family:sans-serif">Hi ${esc(data.name)},</p>
<p style="font-family:sans-serif">Your project enquiry has landed. We've received your requirements and will get back to you shortly.</p>`,
      });
    }

    return { ok: true as const };
  });

export const subscribeToNewsletter = createServerFn({ method: "POST" })
  .inputValidator((raw: { email: string }) => {
    const email = String(raw?.email ?? "").trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Valid email is required.");
    return { email: email.slice(0, 180) };
  })
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { error } = await supabase.from("newsletter_subscribers").insert(data);
    if (error) {
      // unique violation = already subscribed
      if (error.code === "23505") return { ok: true as const, alreadySubscribed: true };
      console.error("[newsletter] insert failed", error.message);
      throw new Error("Subscription failed.");
    }
    return { ok: true as const, alreadySubscribed: false };
  });
