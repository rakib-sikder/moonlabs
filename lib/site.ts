// Single source of truth for brand, navigation, services and industries.
// Pages, nav and footer all read from here so copy never drifts between them.

import { industryDetails } from "./content/industries";

export const site = {
  name: "Moonlabs",
  tagline: "Automation agency",
  description:
    "Moonlabs builds AI agents, workflows and integrations that take repetitive work off your team — plus the websites, apps, data and marketing around them.",
  /** Public contact address — set NEXT_PUBLIC_CONTACT_EMAIL; hidden everywhere when empty. */
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "",
  /** Canonical origin for SEO (sitemap, Open Graph). */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://moonlabs.vercel.app",
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

export type CategoryId = "automation" | "development" | "data-cloud" | "design" | "growth";

export type ServiceCategory = {
  id: CategoryId;
  name: string;
  short: string;
  /** Heading above a service's list of items on its detail page. */
  itemsLabel: string;
  color: string;
  /** The studio's main focus — shown first and larger everywhere. */
  core?: boolean;
};

// Automation is the core of the studio; the other four sectors round it out so a client
// can get the website, app, data and marketing work from the same team.
export const serviceCategories: ServiceCategory[] = [
  {
    id: "automation",
    name: "Automation & AI",
    short: "Our core. AI agents, workflows and integrations that take repetitive work off your team.",
    itemsLabel: "What we automate",
    color: "#9d8cff",
    core: true,
  },
  {
    id: "development",
    name: "Web & App Development",
    short: "Websites, mobile apps and custom web apps — built to plug straight into your automations.",
    itemsLabel: "What we build",
    color: "#6fb8ff",
  },
  {
    id: "data-cloud",
    name: "Data & Cloud",
    short: "Databases, dashboards and the servers everything runs on, kept fast, backed up and secure.",
    itemsLabel: "What's included",
    color: "#5ee0d0",
  },
  {
    id: "design",
    name: "UI/UX & Brand Design",
    short: "Interfaces people understand at a glance, and a brand that looks the part.",
    itemsLabel: "What we design",
    color: "#ff8fb1",
  },
  {
    id: "growth",
    name: "SEO & Growth Marketing",
    short: "Get found on Google, run ads that pay back, and keep content going out every week.",
    itemsLabel: "What's included",
    color: "#ffc76b",
  },
];

export type Service = {
  slug: string;
  name: string;
  category: CategoryId;
  short: string;
  /** Planet colour in the hero scene and the mini orbit on cards (decorative only). */
  color: string;
  items: string[];
};

// Automation services are the "planets" in the hero; the other sectors follow them.
const automation: Omit<Service, "category">[] = [
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

const beyond: Service[] = [
  // ---------- Web & App Development ----------
  {
    slug: "web-development",
    name: "Websites",
    category: "development",
    short: "Fast, good-looking websites that turn visitors into enquiries.",
    color: "#6fb8ff",
    items: [
      "Business and company websites",
      "Landing pages for campaigns and ads",
      "Online stores on Shopify, WooCommerce or fully custom",
      "Blogs and content sites with an easy CMS (WordPress, Webflow or headless)",
      "Booking, membership and directory sites",
      "Multi-language websites",
      "Redesigns and speed fixes for an existing site",
      "Ongoing care — updates, backups and uptime monitoring",
    ],
  },
  {
    slug: "app-development",
    name: "Mobile Apps",
    category: "development",
    short: "iOS and Android apps, built once and shipped to both stores.",
    color: "#8fd3ff",
    items: [
      "Booking and appointment apps",
      "Food, grocery and delivery ordering apps",
      "Marketplace apps with buyers, sellers and payouts",
      "Loyalty, membership and rewards apps",
      "Field-staff apps — job lists, check-ins, photos and signatures, even offline",
      "Fitness, health and habit-tracking apps",
      "Companion apps for an existing web product",
      "App Store and Google Play publishing and updates",
    ],
  },
  {
    slug: "web-apps-and-saas",
    name: "Web Apps & SaaS",
    category: "development",
    short: "Custom portals, internal tools and SaaS products, from first version to scale.",
    color: "#a9b8ff",
    items: [
      "SaaS MVPs with sign-up, subscriptions and an admin panel",
      "Customer and client portals",
      "Internal tools and admin dashboards",
      "Booking, scheduling and quoting systems",
      "A CRM or ERP built around how you actually work",
      "AI features — chat assistants, search over your documents, summaries",
      "APIs and backend services",
      "Payments with Stripe and PayPal",
    ],
  },
  // ---------- Data & Cloud ----------
  {
    slug: "database-management",
    name: "Database Management",
    category: "data-cloud",
    short: "Clean, fast, backed-up data — not a pile of spreadsheets.",
    color: "#5ee0d0",
    items: [
      "Database design and schema planning",
      "Moving from spreadsheets or Airtable to a real database",
      "PostgreSQL, MySQL, MongoDB, Supabase and Firebase",
      "Speed fixes — indexes, slow queries and caching",
      "Automatic backups with tested restores",
      "User roles, access control and encryption",
      "Data cleaning, de-duplication and merging",
      "Monitoring and ongoing maintenance",
    ],
  },
  {
    slug: "data-and-analytics",
    name: "Data & Dashboards",
    category: "data-cloud",
    short: "Every number you care about in one place, updated on its own.",
    color: "#7fe8b0",
    items: [
      "KPI dashboards in Looker Studio, Power BI or Metabase",
      "Data pipelines that pull every app into one warehouse",
      "Scheduled reports to email, Slack or Telegram",
      "Sales, marketing and finance analytics",
      "Web scraping and data collection",
      "Alerts when a number moves outside its normal range",
    ],
  },
  {
    slug: "cloud-and-devops",
    name: "Cloud & DevOps",
    category: "data-cloud",
    short: "Servers, deploys and monitoring that keep everything online.",
    color: "#62c6e8",
    items: [
      "Hosting on AWS, Google Cloud, DigitalOcean, Vercel or Oracle Cloud",
      "Linux server setup and hardening",
      "CI/CD — automatic tests and one-click deploys",
      "Docker and containers",
      "Uptime monitoring with alerts to your phone",
      "Domains, SSL and email deliverability (SPF, DKIM, DMARC)",
      "Failover servers and backups",
      "Cloud cost reviews",
    ],
  },
  // ---------- Design ----------
  {
    slug: "ui-ux-design",
    name: "UI/UX Design",
    category: "design",
    short: "Apps and websites that feel obvious to use.",
    color: "#ff8fb1",
    items: [
      "User research and interviews",
      "User flows and wireframes",
      "High-fidelity UI design in Figma",
      "Clickable prototypes to test before building",
      "Design systems and component libraries",
      "Dashboard and SaaS interfaces",
      "Mobile app UI for iOS and Android",
      "UX and accessibility audits of an existing product",
    ],
  },
  {
    slug: "branding",
    name: "Brand & Graphic Design",
    category: "design",
    short: "A logo, look and set of templates that make you look established.",
    color: "#ffb0d0",
    items: [
      "Logo and visual identity",
      "Brand guidelines — colours, type, voice",
      "Social media templates",
      "Pitch decks and presentations",
      "Ads, banners and print material",
      "Product and packaging mockups",
      "Icons and illustrations",
    ],
  },
  // ---------- SEO & Growth ----------
  {
    slug: "seo",
    name: "SEO",
    category: "growth",
    short: "Show up when customers search for what you sell.",
    color: "#ffc76b",
    items: [
      "Technical SEO audits and fixes — speed, Core Web Vitals, indexing",
      "Keyword research and a content plan",
      "On-page optimisation of titles, copy and structure",
      "Local SEO and Google Business Profile",
      "Programmatic pages for locations and services",
      "White-hat link building",
      "Monthly ranking and traffic reports",
    ],
  },
  {
    slug: "paid-ads",
    name: "Paid Ads",
    category: "growth",
    short: "Google and Meta ads measured by what they bring back.",
    color: "#ffa96b",
    items: [
      "Google Ads — Search, Shopping and Performance Max",
      "Meta ads on Facebook and Instagram",
      "LinkedIn and TikTok ads",
      "Conversion tracking — GA4, Meta Pixel and Conversions API",
      "Landing page A/B tests",
      "Weekly spend and return reports",
    ],
  },
  {
    slug: "content-and-social",
    name: "Content & Social Media",
    category: "growth",
    short: "A steady flow of posts, videos and emails your audience actually reads.",
    color: "#ffd98f",
    items: [
      "Social media calendar and management",
      "Short-form video editing for Reels, TikTok and Shorts",
      "Blog posts and articles",
      "Email newsletters",
      "Website and ad copywriting",
      "Community and comment management",
    ],
  },
];

export const services: Service[] = [
  ...automation.map((s) => ({ ...s, category: "automation" as const })),
  ...beyond,
];

/** The core automation services — one planet each in the hero scene. */
export const automationServices = services.filter((s) => s.category === "automation");

export const categoryOf = (s: Service) => serviceCategories.find((c) => c.id === s.category)!;

export const servicesIn = (id: CategoryId) => services.filter((s) => s.category === id);

/** Page title for a service: automation services read "Sales & Leads automation". */
export const serviceTitle = (s: Service) => (s.category === "automation" ? `${s.name} automation` : s.name);

export type Industry = { slug: string; name: string };

export const industries: Industry[] = industryDetails.map(({ slug, name }) => ({ slug, name }));

export const footerNav: { title: string; links: NavLink[] }[] = [
  {
    title: "Services",
    links: serviceCategories.map((c) => ({ href: `/services#${c.id}`, label: c.name })),
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
      { href: "/security", label: "Security" },
      { href: "/roi-calculator", label: "ROI calculator" },
      { href: "/faq", label: "FAQ" },
    ],
  },
];
