export const prerender = false;

import type { APIRoute } from "astro";
import nodemailer from "nodemailer";
import "dotenv/config";

export const POST: APIRoute = async ({ request }) => {
  console.log("API /api/submit reached");


  try {
    // Read JSON body
    const body = await request.json();
    console.log("Body received:", body);

    // Convert form data to HTML table
    const rows = Object.entries(body)
      .map(([k, v]) => {
        const val = Array.isArray(v) ? v.join(", ") : String(v ?? "");
        return `<tr>
          <td style="padding:6px;border:1px solid #334155;"><b>${k}</b></td>
          <td style="padding:6px;border:1px solid #334155;">${val}</td>
        </tr>`;
      })
      .join("");

    const html = `
      <div style="font-family:system-ui,Segoe UI,Arial,sans-serif;color:#e2e8f0;background:#0f172a;padding:12px">
        <h2 style="margin:0 0 10px">Nouvelle soumission — Questionnaire</h2>
        <table style="border-collapse:collapse">${rows}</table>
      </div>
    `;

    // Read SMTP config
    const host = process.env.SMTP_HOST || "smtp.office365.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const recipient = process.env.MAIL_TO || user;

    if (!user || !pass) {
      console.error("❌ SMTP_USER or SMTP_PASS missing");
      return new Response("SMTP ERROR: missing credentials", { status: 500 });
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: false,
      auth: { user, pass },
      tls: { ciphers: "TLSv1.2" },
    });

    // Send mail
    await transporter.sendMail({
      from: `"Questionnaire TI" <${user}>`,
      to: recipient,
      subject: "Soumission du questionnaire",
      html,
    });

    console.log("📤 Email sent successfully!");

    return new Response("OK", { status: 200 });
  } catch (err: any) {
    console.error("❌ API ERROR:", err);
    return new Response(err?.message || "Erreur serveur", { status: 500 });
  }
};
