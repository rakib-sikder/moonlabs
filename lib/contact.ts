// Shared contact-form schema, used by the form (client) and the API route (server).

export const budgetOptions = ["Not sure yet", "Under $1,000", "$1,000 – $3,000", "$3,000 – $10,000", "$10,000+"] as const;
export const timelineOptions = ["As soon as possible", "Within a month", "In 1–3 months", "Just exploring"] as const;

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  services: string[];
  budget: string;
  timeline: string;
  message: string;
  /** Honeypot — real people leave it empty. */
  website: string;
};

export const LIMITS = { name: 100, email: 200, company: 150, message: 4000 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Returns field → error message; empty object means valid. */
export function validateContact(p: Partial<ContactPayload>): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = (p.name ?? "").trim();
  const email = (p.email ?? "").trim();
  const message = (p.message ?? "").trim();
  if (name.length < 2) errors.name = "Please tell us your name.";
  else if (name.length > LIMITS.name) errors.name = "That name is a little long.";
  if (!EMAIL_RE.test(email) || email.length > LIMITS.email) errors.email = "Please enter a valid email address.";
  if ((p.company ?? "").length > LIMITS.company) errors.company = "Please shorten the company name.";
  if (message.length < 10) errors.message = "A sentence or two about what you'd like to automate helps us prepare.";
  else if (message.length > LIMITS.message) errors.message = `Please keep it under ${LIMITS.message} characters.`;
  return errors;
}
