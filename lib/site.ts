// Single source of truth for brand, navigation, services and industries.
// Pages, nav and footer all read from here so copy never drifts between them.

export const site = {
  name: "Moonlabs",
  tagline: "Automation agency",
  description:
    "Moonlabs builds AI agents, workflows and integrations that take repetitive work off your team — leads, support, invoices, data entry and more.",
  // Placeholder until the real address is set up in Stage 5.
  email: "hello@moonlabs.example",
};

export type NavLink = { href: string; label: string };

export const mainNav: NavLink[] = [
  { href: "/services", label: "Services" },
  { href: "/industries", label: "Industries" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
];

export const primaryCta: NavLink = { href: "/contact", label: "Free audit" };

export type Service = {
  slug: string;
  name: string;
  short: string;
  /** Planet colour in the hero scene and the mini orbit on cards (decorative only). */
  color: string;
  items: string[];
};

// Each category is one "planet" in the hero; its items are that planet's moons.
export const services: Service[] = [
  {
    slug: "sales-and-leads",
    name: "Sales & Leads",
    short: "Find, enrich and follow up with leads automatically.",
    color: "#9d8cff",
    items: [
      "Lead scraping from Google Maps, directories, LinkedIn and websites",
      "Lead enrichment — find and verify emails and phone numbers",
      "Cold email outreach with automatic follow-ups",
      "SMS and WhatsApp outreach",
      "CRM setup and automation (HubSpot, GoHighLevel, Pipedrive, Airtable)",
      "Automatic proposals and quotes",
      "Sales pipeline reports and alerts",
    ],
  },
  {
    slug: "marketing",
    name: "Marketing",
    short: "Content, posting, reviews and reporting on autopilot.",
    color: "#ff8fb1",
    items: [
      "Social media auto-posting and scheduling",
      "AI-assisted content — posts, captions, blogs, ad copy",
      "Email marketing and newsletters",
      "Review collection and reputation management",
      "SEO automation — keyword tracking, reports, programmatic pages",
      "Automatic Facebook and Google Ads reporting",
      "Competitor and price monitoring",
    ],
  },
  {
    slug: "customer-support",
    name: "Customer Support",
    short: "Answer faster without hiring more people.",
    color: "#5ee0d0",
    items: [
      "AI chatbots for website, Messenger, WhatsApp and Instagram DMs",
      "Automatic email replies and inbox sorting",
      "Ticket triage and routing",
      "FAQ and knowledge-base bots",
      "Customer feedback surveys and analysis",
    ],
  },
  {
    slug: "voice-and-calls",
    name: "Voice & Calls",
    short: "Never miss a call or a booking again.",
    color: "#ffc76b",
    items: [
      "AI voice agents that answer calls and book appointments",
      "Automatic SMS when a call is missed",
      "Call recording transcription and summaries",
    ],
  },
  {
    slug: "operations",
    name: "Operations",
    short: "The back-office work nobody wants to do by hand.",
    color: "#6fb8ff",
    items: [
      "Invoicing, billing and payment reminders",
      "Data entry from PDFs, forms and emails into sheets",
      "Document processing — AI extraction and summaries",
      "Appointment booking and reminders",
      "Inventory and order tracking",
      "Contract and e-signature workflows",
    ],
  },
  {
    slug: "finance-and-hr",
    name: "Finance & HR",
    short: "Books, payroll and hiring that run themselves.",
    color: "#9be07f",
    items: [
      "Expense tracking and receipt scanning",
      "Bookkeeping sync with QuickBooks and Xero",
      "Payroll and attendance reports",
      "Recruitment — CV screening and interview scheduling",
      "Employee onboarding and offboarding workflows",
    ],
  },
  {
    slug: "e-commerce",
    name: "E-commerce",
    short: "Orders, listings and stock synced across every channel.",
    color: "#ff9a62",
    items: [
      "Shopify and WooCommerce order automation",
      "Bulk product listing upload and updates",
      "Abandoned cart recovery",
      "Order status SMS and email",
      "Multi-platform inventory sync",
    ],
  },
  {
    slug: "custom-build",
    name: "Custom Build",
    short: "When no off-the-shelf tool fits, we build one.",
    color: "#cfd8ff",
    items: [
      "Zapier, Make and n8n workflows",
      "API integrations between the apps you use",
      "Google Workspace and Sheets automation",
      "Custom dashboards and reporting",
      "Browser automation and bots",
      "Custom AI agents",
      "Internal tools and web apps",
      "Telegram and Slack alert systems",
    ],
  },
];

export type Industry = { slug: string; name: string };

export const industries: Industry[] = [
  { slug: "real-estate", name: "Real estate" },
  { slug: "healthcare", name: "Clinics & healthcare" },
  { slug: "restaurants", name: "Restaurants" },
  { slug: "e-commerce", name: "E-commerce stores" },
  { slug: "agencies", name: "Agencies" },
  { slug: "law-firms", name: "Law firms" },
  { slug: "education", name: "Education & coaching" },
  { slug: "logistics", name: "Logistics" },
];

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: services.slice(0, 5).map((s) => ({ href: `/services/${s.slug}`, label: s.name })),
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/work", label: "Work" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/how-it-works", label: "How it works" },
      { href: "/industries", label: "Industries" },
      { href: "/roi-calculator", label: "ROI calculator" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];
