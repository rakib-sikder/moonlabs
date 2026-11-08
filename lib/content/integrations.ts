// Tools we connect, grouped, with what we typically do with each.
// `services` are slugs from lib/site.ts so each tool links back to relevant work.

export type Tool = { name: string; what: string; services: string[] };
export type ToolGroup = { id: string; name: string; tools: Tool[] };

export const toolGroups: ToolGroup[] = [
  {
    id: "crm-sales",
    name: "CRM & sales",
    tools: [
      { name: "HubSpot", what: "Lead capture, deal stages, sequences and reporting", services: ["sales-and-leads", "marketing"] },
      { name: "GoHighLevel", what: "Pipelines, SMS follow-up and booking for agencies", services: ["sales-and-leads", "voice-and-calls"] },
      { name: "Pipedrive", what: "Deal automation and activity reminders", services: ["sales-and-leads"] },
      { name: "Salesforce", what: "Record sync, case routing and enrichment", services: ["sales-and-leads", "customer-support"] },
      { name: "Apollo", what: "Prospect search and contact enrichment", services: ["sales-and-leads"] },
      { name: "Airtable", what: "Lightweight CRM and operations databases", services: ["sales-and-leads", "operations"] },
    ],
  },
  {
    id: "messaging",
    name: "Email & messaging",
    tools: [
      { name: "Gmail", what: "Inbox sorting, auto-replies and forwarding", services: ["customer-support", "sales-and-leads"] },
      { name: "Outlook", what: "Shared inbox rules and drafted replies", services: ["customer-support"] },
      { name: "WhatsApp Business", what: "Chatbots, order updates and outreach", services: ["customer-support", "sales-and-leads"] },
      { name: "Messenger & Instagram", what: "DM assistants and lead capture", services: ["customer-support", "marketing"] },
      { name: "Telegram", what: "Team alerts and approval buttons", services: ["custom-build", "operations"] },
      { name: "Slack", what: "Alerts, reports and approval workflows", services: ["custom-build", "operations"] },
      { name: "Twilio", what: "SMS, missed-call text-back and voice", services: ["voice-and-calls"] },
    ],
  },
  {
    id: "ai",
    name: "AI & voice",
    tools: [
      { name: "OpenAI", what: "Drafting, classification and extraction", services: ["custom-build", "customer-support"] },
      { name: "Claude", what: "Long-document reading and careful writing", services: ["custom-build", "operations"] },
      { name: "Retell / Vapi", what: "AI voice agents that answer and book calls", services: ["voice-and-calls"] },
      { name: "Whisper", what: "Call and meeting transcription", services: ["voice-and-calls"] },
    ],
  },
  {
    id: "workflow",
    name: "Workflow platforms",
    tools: [
      { name: "n8n", what: "Self-hostable workflows with full control", services: ["custom-build"] },
      { name: "Make", what: "Visual workflows your team can edit", services: ["custom-build"] },
      { name: "Zapier", what: "Quick app-to-app connections", services: ["custom-build"] },
      { name: "Playwright", what: "Browser automation where no API exists", services: ["custom-build", "data-and-analytics"] },
    ],
  },
  {
    id: "finance-ops",
    name: "Finance & operations",
    tools: [
      { name: "QuickBooks", what: "Invoice creation and bookkeeping sync", services: ["finance-and-hr", "operations"] },
      { name: "Xero", what: "Bills, receipts and reconciliation", services: ["finance-and-hr"] },
      { name: "Stripe", what: "Payments, subscriptions and dunning", services: ["operations", "web-apps-and-saas"] },
      { name: "Google Workspace", what: "Sheets, Docs, Drive and Calendar automation", services: ["operations", "custom-build"] },
      { name: "DocuSign", what: "Contracts sent and filed automatically", services: ["operations"] },
      { name: "Calendly / Cal.com", what: "Bookings, reminders and routing", services: ["operations", "voice-and-calls"] },
    ],
  },
  {
    id: "commerce",
    name: "E-commerce",
    tools: [
      { name: "Shopify", what: "Orders, listings, inventory and stores", services: ["e-commerce", "web-development"] },
      { name: "WooCommerce", what: "Order automation and store builds", services: ["e-commerce", "web-development"] },
      { name: "Amazon", what: "Listing and stock sync", services: ["e-commerce"] },
      { name: "Klaviyo", what: "Flows, abandoned carts and segments", services: ["e-commerce", "marketing"] },
      { name: "ShipStation", what: "Labels and shipping updates", services: ["e-commerce"] },
    ],
  },
  {
    id: "marketing",
    name: "Marketing & analytics",
    tools: [
      { name: "Google Ads", what: "Campaigns, tracking and reports", services: ["paid-ads", "marketing"] },
      { name: "Meta Ads", what: "Campaigns and Conversions API", services: ["paid-ads"] },
      { name: "Google Analytics 4", what: "Conversion tracking and reporting", services: ["paid-ads", "seo"] },
      { name: "Search Console", what: "Indexing and ranking data", services: ["seo"] },
      { name: "Looker Studio", what: "Shared dashboards", services: ["data-and-analytics", "marketing"] },
      { name: "Mailchimp", what: "Newsletters and audience sync", services: ["marketing", "content-and-social"] },
    ],
  },
  {
    id: "data-cloud",
    name: "Data, cloud & build",
    tools: [
      { name: "PostgreSQL", what: "Primary databases for apps and reporting", services: ["database-management"] },
      { name: "Supabase", what: "Database, auth and storage for apps", services: ["web-apps-and-saas", "database-management"] },
      { name: "BigQuery", what: "Warehouse for analytics pipelines", services: ["data-and-analytics"] },
      { name: "AWS", what: "Hosting, storage and serverless", services: ["cloud-and-devops"] },
      { name: "Google Cloud", what: "Hosting and data services", services: ["cloud-and-devops"] },
      { name: "Vercel", what: "Websites and web apps", services: ["web-development", "cloud-and-devops"] },
      { name: "Cloudflare", what: "DNS, tunnels and protection", services: ["cloud-and-devops"] },
      { name: "GitHub", what: "Code, reviews and CI/CD", services: ["cloud-and-devops"] },
      { name: "Figma", what: "Interface design and prototypes", services: ["ui-ux-design"] },
      { name: "React Native", what: "iOS and Android apps", services: ["app-development"] },
    ],
  },
];

export const toolCount = toolGroups.reduce((n, g) => n + g.tools.length, 0);
