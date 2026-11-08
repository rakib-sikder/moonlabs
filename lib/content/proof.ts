// Social proof — ONLY real, verifiable information supplied by the owner.
// Every section that reads from this file is hidden while its list is empty,
// so nothing invented ever appears on the site.

export type Client = {
  name: string;
  /** Optional path under /public, e.g. "/clients/acme.svg". Name is shown when missing. */
  logo?: string;
  url?: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  /** Optional photo under /public, e.g. "/people/jane.jpg". */
  photo?: string;
  /** Optional link to the related case study, e.g. "/work/leadpilot". */
  caseStudy?: string;
};

export type Stat = {
  /** e.g. "48+" or "1,200 h" */
  value: string;
  /** e.g. "automations running for clients" */
  label: string;
};

export type Founder = {
  name: string;
  role: string;
  bio: string;
  photo?: string;
  links?: { label: string; href: string }[];
};

export const clients: Client[] = [];

export const testimonials: Testimonial[] = [];

export const stats: Stat[] = [];

export const founders: Founder[] = [];
