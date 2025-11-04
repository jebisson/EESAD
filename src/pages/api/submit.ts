export const prerender = false;
import 'dotenv/config';
import type { APIRoute } from "astro";
import nodemailer from "nodemailer";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();

    const rows = Object.entries(body).map(([k, v]) => {
      const val = Array.isArray(v) ? v.join(", ") : String(v ?? "");
      return `<tr><td style="padding:6px;border:1px solid #334155;"><b>${k}</b></td><td style="padding:6px;border:1px solid #334155;">${val}</td></tr>`;
    }).join("");

    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;color:#e2e8f0;background:#0f172a;padding:12px">
        <h2 style="margin:0 0 10px">Nouvelle soumission — Questionnaire</h2>
        <table style="border-collapse:collapse">${rows}</table>
      </div>
    `;

   const host = process.env.SMTP_HOST || "smtp.office365.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const to   = process.env.MAIL_TO || user;

    if (!user || !pass) {
    console.error("SMTP_USER/SMTP_PASS missing");
    return new Response("Server misconfigured (missing SMTP credentials).", { status: 500 });
    }

    const transporter = nodemailer.createTransport({
  host,
  port,
  secure: false, // 587 + STARTTLS
  auth: { user, pass },
  tls: { ciphers: "TLSv1.2" },
    });


   const recipient = process.env.MAIL_TO || process.env.SMTP_USER!;

await transporter.sendMail({
  from: `"Questionnaire" <${process.env.SMTP_USER}>`,
  to: recipient,
  subject: "Soumission du questionnaire",
  html,
});


    return new Response("OK");
  } catch (err: any) {
    console.error(err);
    return new Response(err?.message || "Erreur", { status: 400 });
  }
};
