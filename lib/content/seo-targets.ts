// Search targets for every service and industry page, picked from DataForSEO keyword data
// (monthly searches and difficulty, US and Bangladesh, November 2026). Each page gets the
// phrase people actually search for in its title, description and main heading; the
// visible copy below the heading stays as it is.
//
// `title` is used as-is (it already ends with "| Moonlab"); keep it under about 60 characters.
// `description` stays between about 140 and 160 characters.

export type SeoTarget = {
  /** The phrases this page competes for, most important first. */
  keywords: string[];
  title: string;
  description: string;
  /** Services: the page's main heading. Industries: the small label above the heading. */
  heading: string;
};

export const serviceSeo: Record<string, SeoTarget> = {
  "sales-and-leads": {
    keywords: ["lead generation automation", "crm automation", "sales automation"],
    title: "Lead Generation & CRM Automation Services | Moonlab",
    description:
      "Lead generation automation for small businesses: instant replies to new leads, CRM automation and follow-ups that run on their own. Free 30-minute audit.",
    heading: "Lead generation and sales automation",
  },
  marketing: {
    keywords: ["marketing automation services", "marketing automation for small business", "social media automation"],
    title: "Marketing Automation Services for Small Business | Moonlab",
    description:
      "Marketing automation services for small businesses: scheduled social posts, review requests, email follow-ups and reports that go out on their own.",
    heading: "Marketing automation services",
  },
  "customer-support": {
    keywords: ["customer service automation", "ai chatbot development", "chatbot development company"],
    title: "Customer Service Automation & AI Chatbots | Moonlab",
    description:
      "Customer service automation and AI chatbots for your website, WhatsApp and Messenger. Faster replies and sorted support email, with a person for hard cases.",
    heading: "Customer service automation and AI chatbots",
  },
  "voice-and-calls": {
    keywords: ["ai receptionist", "ai phone answering service", "missed call text back"],
    title: "AI Receptionist & AI Phone Answering Service | Moonlab",
    description:
      "An AI receptionist that answers calls, books appointments and texts back missed callers, day and night. Set up in your own phone and calendar accounts.",
    heading: "AI receptionist and phone answering",
  },
  operations: {
    keywords: ["business process automation", "business automation", "workflow automation services"],
    title: "Business Process Automation Services | Moonlab",
    description:
      "Business process automation for small and mid-sized businesses in the US and Bangladesh: approvals, data entry, reports and handovers that run on their own.",
    heading: "Business process automation",
  },
  "finance-and-hr": {
    keywords: ["accounts payable automation", "invoice automation", "payroll automation", "hr automation"],
    title: "Finance & HR Automation: Invoices, AP, Payroll | Moonlab",
    description:
      "Accounts payable and invoice automation, payroll reports and HR admin for small businesses. A person approves anything that moves money. Free audit.",
    heading: "Finance and HR automation",
  },
  "e-commerce": {
    keywords: ["ecommerce automation", "shopify automation", "inventory management automation"],
    title: "Ecommerce Automation for Shopify & Online Stores | Moonlab",
    description:
      "Ecommerce automation for Shopify and other online stores: orders, stock levels, shipping updates and abandoned cart reminders kept in sync automatically.",
    heading: "Ecommerce automation",
  },
  "custom-build": {
    keywords: ["custom software development company", "ai agent development", "ai development company"],
    title: "Custom Software & AI Agent Development | Moonlab",
    description:
      "Custom software and AI agent development when no off-the-shelf tool fits. Built in Python and Node.js, documented, and handed over in your own accounts.",
    heading: "Custom software and AI agent development",
  },
  "web-development": {
    keywords: ["website development company", "web development agency", "web development company in bangladesh"],
    title: "Website Development Company for Small Business | Moonlab",
    description:
      "A website development company for small businesses in the US and Bangladesh. Fast, mobile-first sites built to bring in enquiries, with SEO basics done.",
    heading: "Website development for small businesses",
  },
  "app-development": {
    keywords: ["app development company", "mobile app development company", "flutter app development company"],
    title: "Mobile App Development Company (iOS & Android) | Moonlab",
    description:
      "Mobile app development for iOS and Android, built once and shipped to both stores. An app development company in Dhaka working with US and Bangladesh clients.",
    heading: "Mobile app development for iOS and Android",
  },
  "web-apps-and-saas": {
    keywords: ["saas development company", "web application development", "software company in bangladesh"],
    title: "SaaS & Web Application Development Company | Moonlab",
    description:
      "SaaS and custom web application development: client portals, internal tools and SaaS products, from first version to scale. A software company in Bangladesh.",
    heading: "SaaS and web application development",
  },
  "database-management": {
    keywords: ["database consulting", "database management services", "database development services"],
    title: "Database Consulting & Management Services | Moonlab",
    description:
      "Database consulting and management services: move from spreadsheets to a proper database with backups, faster queries and clean data. Free 30-minute audit.",
    heading: "Database consulting and management",
  },
  "data-and-analytics": {
    keywords: ["dashboard development", "business intelligence services", "power bi consultant"],
    title: "Dashboard Development & BI Services | Moonlab",
    description:
      "Dashboard development and business intelligence services: the numbers you track in one place, updated automatically, in Looker Studio or Power BI.",
    heading: "Dashboard development and business intelligence",
  },
  "cloud-and-devops": {
    keywords: ["cloud consulting services", "devops consulting", "aws consulting services"],
    title: "Cloud Consulting & DevOps Services | Moonlab",
    description:
      "Cloud consulting and DevOps services: servers, deploys, backups and monitoring that keep your apps and automations online, on AWS, Cloudflare or a VPS.",
    heading: "Cloud consulting and DevOps",
  },
  "ui-ux-design": {
    keywords: ["ui ux design services", "ux design agency", "ui ux design agency in bangladesh"],
    title: "UI/UX Design Services for Apps & Websites | Moonlab",
    description:
      "UI/UX design services for apps and websites: user research, flows, wireframes and clickable Figma prototypes, from a design team in Dhaka, Bangladesh.",
    heading: "UI/UX design services",
  },
  branding: {
    keywords: ["brand identity design", "logo design services", "branding agency in bangladesh"],
    title: "Logo & Brand Identity Design Services | Moonlab",
    description:
      "Logo and brand identity design for small businesses: a logo, colours, type and templates that make you look established. Studio in Dhaka, Bangladesh.",
    heading: "Logo and brand identity design",
  },
  seo: {
    keywords: ["seo agency", "seo services for small business", "seo expert in bangladesh"],
    title: "SEO Agency for Small Businesses, US & Bangladesh | Moonlab",
    description:
      "SEO services for small businesses: technical fixes, local SEO, Google Business Profile and content. An SEO team in Bangladesh working with US and local clients.",
    heading: "SEO services for small businesses",
  },
  "paid-ads": {
    keywords: ["google ads agency", "facebook ads agency", "meta ads agency", "ppc agency"],
    title: "Google Ads & Facebook Ads Agency (PPC) | Moonlab",
    description:
      "A Google Ads and Facebook ads agency for small businesses: campaigns measured by the leads and sales they bring back, with conversion tracking set up properly.",
    heading: "Google Ads and Meta ads management",
  },
  "content-and-social": {
    keywords: ["content marketing agency", "social media management services", "content writing services"],
    title: "Content Marketing & Social Media Management | Moonlab",
    description:
      "Content marketing and social media management for small businesses: regular posts, short videos, blogs and emails written for your audience. Free audit.",
    heading: "Content marketing and social media management",
  },
};

export const industrySeo: Record<string, SeoTarget> = {
  "real-estate": {
    keywords: ["real estate marketing automation", "real estate automation", "real estate lead follow up"],
    title: "Real Estate Automation & Lead Follow-Up | Moonlab",
    description:
      "Real estate automation for agents and agencies: instant replies to portal leads, viewing reminders, listing sync and seller reports that run on their own.",
    heading: "Real estate automation",
  },
  healthcare: {
    keywords: ["healthcare automation", "clinic management software", "patient appointment reminder system"],
    title: "Clinic & Healthcare Automation: Bookings | Moonlab",
    description:
      "Healthcare automation for clinics and dental offices: online booking, appointment reminders, digital intake and missed-call recovery. Fewer no-shows.",
    heading: "Clinic and healthcare automation",
  },
  restaurants: {
    keywords: ["restaurant automation", "restaurant reservation system", "restaurant marketing automation"],
    title: "Restaurant Automation: Reservations & Reviews | Moonlab",
    description:
      "Restaurant automation: reservations by chat or phone, daily specials posted everywhere, review requests and supplier reorders, without extra admin work.",
    heading: "Restaurant automation",
  },
  "e-commerce": {
    keywords: ["ecommerce order automation", "abandoned cart automation", "ecommerce automation"],
    title: "Online Store Automation: Orders, Stock, Carts | Moonlab",
    description:
      "Automation for online stores: order and shipping updates, stock synced across channels, abandoned cart reminders and bulk product uploads, done for you.",
    heading: "Ecommerce order automation",
  },
  agencies: {
    keywords: ["marketing agency automation", "automated client reporting", "agency automation"],
    title: "Marketing Agency Automation & Client Reporting | Moonlab",
    description:
      "Marketing agency automation: automated client reporting, onboarding, approvals and outbound for your own agency, so the team spends time on client work.",
    heading: "Marketing agency automation",
  },
  "law-firms": {
    keywords: ["law firm automation", "legal document automation", "legal intake automation"],
    title: "Law Firm Automation: Intake & Legal Documents | Moonlab",
    description:
      "Law firm automation: client intake, conflict check prompts, legal document automation and reminders, with a lawyer approving anything that leaves the firm.",
    heading: "Law firm automation",
  },
  education: {
    keywords: ["school management software", "education automation", "coaching business automation"],
    title: "School & Coaching Automation: Enrolment, Fees | Moonlab",
    description:
      "Automation for schools, coaching centres and tutors: enrolment, fee reminders, attendance messages and class schedules, built around the tools you use.",
    heading: "School and coaching automation",
  },
  logistics: {
    keywords: ["logistics automation", "delivery management software", "shipment tracking automation"],
    title: "Logistics Automation & Delivery Management | Moonlab",
    description:
      "Logistics automation for couriers and delivery businesses: shipment tracking updates, driver handovers, proof of delivery and daily reports, automatically.",
    heading: "Logistics automation",
  },
};
