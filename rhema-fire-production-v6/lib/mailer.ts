import nodemailer from "nodemailer";

export function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = String(process.env.SMTP_SECURE || "false") === "true";

  if (!host || !user || !pass) return null;

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });
}

export function fromEmail() {
  return process.env.FROM_EMAIL || process.env.SMTP_USER || "no-reply@rhemafire.org";
}
