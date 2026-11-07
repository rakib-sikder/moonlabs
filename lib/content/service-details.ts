// Long-form content for each service page, keyed by service slug (see lib/site.ts).

export type ServiceDetail = {
  /** Three short example automations shown as chips on cards. */
  tags: string[];
  /** Problems the client recognises themselves in. */
  pains: { title: string; body: string }[];
  /** One concrete example workflow, rendered as an animated pipeline. */
  workflow: { name: string; trigger: string; steps: string[]; outcome: string };
  tools: string[];
  /** Typical time from kickoff to first automation running. */
  setup: string;
  faqs: { q: string; a: string }[];
};

export const serviceDetails: Record<string, ServiceDetail> = {
  "sales-and-leads": {
    tags: ["Lead scraping", "Cold email", "CRM sync"],
    pains: [
      { title: "Leads go cold", body: "New enquiries sit in an inbox for hours before anyone replies, and the fastest competitor wins." },
      { title: "Prospecting eats the week", body: "Your sales people copy names from Google Maps into a sheet instead of selling." },
      { title: "The CRM is out of date", body: "Half the deals live in someone's head or a personal spreadsheet, so nobody trusts the pipeline." },
    ],
    workflow: {
      name: "Inbound lead to booked call",
      trigger: "A form is submitted on your website",
      steps: [
        "Company, size and contact details are enriched automatically",
        "The lead is scored and created in your CRM with the right owner",
        "A personalised first reply is drafted and sent within minutes",
        "Follow-ups go out on day 2 and day 5 if there is no answer",
      ],
      outcome: "A booked call lands on your calendar — no manual copy-paste.",
    },
    tools: ["HubSpot", "GoHighLevel", "Pipedrive", "Airtable", "Gmail", "Google Maps", "Apollo", "WhatsApp"],
    setup: "1–2 weeks",
    faqs: [
      { q: "Will automated emails land in spam?", a: "We set up sending domains, warm-up and sensible daily limits, and every sequence is reviewed by you before it goes live." },
      { q: "Can it work with the CRM we already have?", a: "Yes. We connect to your existing CRM rather than moving you to a new one." },
    ],
  },
  marketing: {
    tags: ["Auto-posting", "AI content", "Review requests"],
    pains: [
      { title: "Posting is inconsistent", body: "Social channels go quiet for weeks whenever the team gets busy." },
      { title: "Reports take a day", body: "Someone exports numbers from five ad dashboards into a deck every month." },
      { title: "Happy customers never leave reviews", body: "Nobody remembers to ask at the right moment, so your rating undersells you." },
    ],
    workflow: {
      name: "Review engine",
      trigger: "An order or job is marked complete",
      steps: [
        "Wait a few days for the customer to use the product",
        "Send a short, personal review request by SMS or email",
        "Happy replies are pointed to Google; unhappy ones come to you privately",
        "Every new review is posted to your team's Slack or Telegram",
      ],
      outcome: "A steady stream of reviews without anyone remembering to ask.",
    },
    tools: ["Meta Business Suite", "Google Business Profile", "Mailchimp", "Klaviyo", "Google Ads", "Looker Studio", "OpenAI", "Claude"],
    setup: "1–2 weeks",
    faqs: [
      { q: "Will AI-written content sound robotic?", a: "Drafts are written in your voice from examples you give us, and nothing is published without an approval step unless you ask for one." },
      { q: "Which ad platforms can you report on?", a: "Meta, Google, TikTok and LinkedIn, combined into one dashboard or a scheduled email." },
    ],
  },
  "customer-support": {
    tags: ["AI chatbot", "Inbox triage", "Ticket routing"],
    pains: [
      { title: "The same ten questions", body: "Most of your support time goes on questions already answered on your website." },
      { title: "Urgent messages get buried", body: "An angry customer waits behind fifty newsletters and auto-replies." },
      { title: "Support stops at 6pm", body: "Customers in other time zones wait until morning for a simple answer." },
    ],
    workflow: {
      name: "24/7 first response",
      trigger: "A message arrives on chat, email or WhatsApp",
      steps: [
        "The AI answers from your own help docs, citing the source",
        "Anything it is unsure about is handed to a person, with a summary",
        "Tickets are tagged by topic and urgency and routed to the right person",
        "A weekly report shows the most common questions to fix at the source",
      ],
      outcome: "Instant answers for simple questions, faster human answers for the rest.",
    },
    tools: ["Intercom", "Zendesk", "Freshdesk", "Gmail", "WhatsApp Business", "Messenger", "Instagram", "OpenAI", "Claude"],
    setup: "1–3 weeks",
    faqs: [
      { q: "What if the bot gives a wrong answer?", a: "It only answers from content you approve, says when it does not know, and hands over to a person. Every conversation is logged for review." },
      { q: "Can customers still reach a human?", a: "Always. A human hand-off is one message away, and urgent topics skip the bot entirely." },
    ],
  },
  "voice-and-calls": {
    tags: ["AI receptionist", "Missed-call SMS", "Call summaries"],
    pains: [
      { title: "Missed calls are missed sales", body: "If nobody picks up, most callers ring the next business on the list." },
      { title: "Front desk overload", body: "Your team spends the day answering the same booking and opening-hours calls." },
      { title: "Calls leave no trace", body: "What was promised on the phone is never written down anywhere." },
    ],
    workflow: {
      name: "Never miss a caller",
      trigger: "A call goes unanswered",
      steps: [
        "The caller instantly receives a friendly SMS with a booking link",
        "If they reply, an AI assistant answers basic questions by text",
        "The lead and conversation are saved to your CRM",
        "Your team gets a summary to call back the warm ones",
      ],
      outcome: "Every missed call becomes a booking or a warm callback.",
    },
    tools: ["Twilio", "Vapi", "Retell", "Aircall", "Calendly", "Cal.com", "HubSpot", "Google Sheets"],
    setup: "1–2 weeks",
    faqs: [
      { q: "Does the AI voice sound natural?", a: "Modern voice agents are close to human, but we always tell callers they are talking to an assistant and offer a human option." },
      { q: "Can we keep our existing phone number?", a: "Usually yes — calls are forwarded from your current number." },
    ],
  },
  operations: {
    tags: ["Invoice reminders", "PDF to sheet", "Booking reminders"],
    pains: [
      { title: "Chasing payments by hand", body: "Overdue invoices depend on someone remembering to send an awkward email." },
      { title: "Retyping documents", body: "Data from PDFs, forms and emails is typed into spreadsheets one field at a time." },
      { title: "No-shows", body: "Appointments are forgotten because reminders are sent manually, or not at all." },
    ],
    workflow: {
      name: "Paperwork autopilot",
      trigger: "A supplier invoice arrives by email",
      steps: [
        "The PDF is read and key fields are extracted by AI",
        "Totals are checked against the purchase order",
        "The line items are added to your accounting sheet or software",
        "Anything that does not match is flagged for a person to review",
      ],
      outcome: "Invoices are filed in minutes and mistakes are caught before payment.",
    },
    tools: ["Google Sheets", "Excel", "DocuSign", "PandaDoc", "Stripe", "Xero", "Cal.com", "Notion"],
    setup: "1–3 weeks",
    faqs: [
      { q: "How accurate is document extraction?", a: "Very accurate on clean documents. We add validation rules and a human review step for anything below a confidence threshold." },
      { q: "Can it handle our odd spreadsheet layout?", a: "Yes — we build around how you already work rather than forcing a new format." },
    ],
  },
  "finance-and-hr": {
    tags: ["Receipt scanning", "CV screening", "Onboarding"],
    pains: [
      { title: "Month-end panic", body: "Receipts are hunted down from inboxes and phones at the last minute." },
      { title: "Hundreds of CVs", body: "Each job post means days of reading applications that do not fit." },
      { title: "Messy onboarding", body: "New starters wait for accounts, documents and equipment because someone forgot a step." },
    ],
    workflow: {
      name: "New-hire onboarding",
      trigger: "A candidate is marked as hired",
      steps: [
        "The contract is generated and sent for e-signature",
        "Email, Slack and tool accounts are created on signing",
        "A first-week schedule and checklist are sent to the new starter",
        "The manager gets reminders for day-one, week-one and month-one check-ins",
      ],
      outcome: "Every new hire gets the same smooth start, with nothing forgotten.",
    },
    tools: ["QuickBooks", "Xero", "Google Workspace", "Slack", "BambooHR", "DocuSign", "Notion", "Google Forms"],
    setup: "2–3 weeks",
    faqs: [
      { q: "Is AI CV screening fair?", a: "We screen against criteria you define, never on protected characteristics, and a person makes every decision. Shortlists come with the reasoning shown." },
      { q: "Do you need access to our bank?", a: "No. We work with your accounting software's read and write permissions only, never bank logins." },
    ],
  },
  "e-commerce": {
    tags: ["Order sync", "Cart recovery", "Stock alerts"],
    pains: [
      { title: "Overselling", body: "Stock is updated by hand across channels, so you sell items you no longer have." },
      { title: "Abandoned carts", body: "Most shoppers who add to cart never check out, and nobody follows up." },
      { title: "Where is my order?", body: "Your inbox fills with tracking questions that a simple update would answer." },
    ],
    workflow: {
      name: "Order to doorstep",
      trigger: "An order is placed on any channel",
      steps: [
        "Stock levels update everywhere you sell",
        "The order is sent to your warehouse or courier",
        "The customer gets status updates by SMS or email",
        "Low stock triggers a reorder alert to your team",
      ],
      outcome: "Accurate stock, fewer support emails, and happier customers.",
    },
    tools: ["Shopify", "WooCommerce", "Amazon", "Daraz", "Stripe", "ShipStation", "Klaviyo", "Google Sheets"],
    setup: "1–3 weeks",
    faqs: [
      { q: "Which platforms do you support?", a: "Shopify and WooCommerce most often, plus marketplaces that offer an API." },
      { q: "Can you bulk-update thousands of products?", a: "Yes — from a spreadsheet, a supplier feed or another store." },
    ],
  },
  "custom-build": {
    tags: ["n8n workflows", "AI agents", "Dashboards"],
    pains: [
      { title: "Tools that don't talk", body: "Data lives in six apps and moves between them by copy-paste." },
      { title: "No single view", body: "Answering 'how are we doing this week?' means opening ten tabs." },
      { title: "Off-the-shelf doesn't fit", body: "Your process is specific, and no SaaS product quite does it." },
    ],
    workflow: {
      name: "Weekly business pulse",
      trigger: "Every Monday at 8am",
      steps: [
        "Numbers are pulled from your CRM, store, ads and accounting tools",
        "They are combined into one dashboard with week-on-week change",
        "An AI summary highlights what moved and why it might have",
        "The summary is posted to your leadership Slack or Telegram",
      ],
      outcome: "Everyone starts the week with the same numbers and the same story.",
    },
    tools: ["n8n", "Make", "Zapier", "Python", "Node.js", "Playwright", "Supabase", "Telegram"],
    setup: "2–6 weeks",
    faqs: [
      { q: "Who owns the code and workflows?", a: "You do. Everything is built in your accounts and handed over with documentation." },
      { q: "What if a tool changes its API?", a: "Our support plans include monitoring and fixes when a connected service changes." },
    ],
  },
};
