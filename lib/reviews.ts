// Client reviews (table `reviews`, migration 0003). Anyone can send one through /review, but it
// stays 'pending' until staff approve it in the portal admin. Only approved reviews are public,
// and only the fields a reader needs: never the reviewer's email.

export const REVIEW_STATUSES = ["pending", "approved", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export type Review = {
  id: string;
  name: string;
  email: string;
  role: string | null;
  company: string | null;
  website: string | null;
  rating: number;
  quote: string;
  project: string | null;
  consent: number;
  status: ReviewStatus;
  created_at: string;
  reviewed_at: string | null;
};

/** What the site shows for an approved review. */
export type PublicReview = Pick<Review, "id" | "name" | "role" | "company" | "website" | "rating" | "quote" | "project" | "created_at">;

export type ReviewPayload = {
  name: string;
  email: string;
  role: string;
  company: string;
  website: string;
  rating: number;
  quote: string;
  project: string;
  consent: boolean;
  /** Honeypot: real people leave it empty. */
  url: string;
};

export const REVIEW_LIMITS = { name: 100, email: 200, role: 100, company: 120, website: 200, quote: 1200, project: 120 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Field → error message; an empty object means valid. Shared by the form and the API. */
export function validateReview(p: Partial<ReviewPayload>): Record<string, string> {
  const errors: Record<string, string> = {};
  const name = (p.name ?? "").trim();
  const quote = (p.quote ?? "").trim();
  if (name.length < 2) errors.name = "Please add your name.";
  else if (name.length > REVIEW_LIMITS.name) errors.name = "That name is a little long.";
  const email = (p.email ?? "").trim();
  if (!EMAIL_RE.test(email) || email.length > REVIEW_LIMITS.email) errors.email = "Please enter the email you used with us.";
  if ((p.role ?? "").length > REVIEW_LIMITS.role) errors.role = "Please shorten your role.";
  if ((p.company ?? "").length > REVIEW_LIMITS.company) errors.company = "Please shorten the company name.";
  if ((p.project ?? "").length > REVIEW_LIMITS.project) errors.project = "Please shorten this.";
  const website = (p.website ?? "").trim();
  if (website && (website.length > REVIEW_LIMITS.website || !/^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(website)))
    errors.website = "That doesn't look like a website address.";
  const rating = Number(p.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.rating = "Please pick a rating.";
  if (quote.length < 20) errors.quote = "A couple of sentences about the work helps other businesses.";
  else if (quote.length > REVIEW_LIMITS.quote) errors.quote = `Please keep it under ${REVIEW_LIMITS.quote} characters.`;
  if (!p.consent) errors.consent = "We need your permission to show the review on our site.";
  return errors;
}
