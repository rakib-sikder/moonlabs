// Long-form content for each service page, keyed by service slug (see lib/site.ts).
// For automation services `workflow` is an example automation; for the other sectors it
// is how a typical project runs.

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
      outcome: "A booked call lands on your calendar with no copy-pasting.",
    },
    tools: ["HubSpot", "GoHighLevel", "Pipedrive", "Airtable", "Gmail", "Google Maps", "Apollo", "WhatsApp"],
    setup: "1-2 weeks",
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
      name: "Review requests",
      trigger: "An order or job is marked complete",
      steps: [
        "Wait a few days for the customer to use the product",
        "Send a short, personal review request by SMS or email",
        "Happy replies are pointed to Google; unhappy ones come to you privately",
        "Every new review is posted to your team's Slack or Telegram",
      ],
      outcome: "Review requests go out on time without anyone having to remember.",
    },
    tools: ["Meta Business Suite", "Google Business Profile", "Mailchimp", "Klaviyo", "Google Ads", "Looker Studio", "OpenAI", "Claude"],
    setup: "1-2 weeks",
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
      outcome: "Simple questions get an instant answer, and your team gets to the rest sooner.",
    },
    tools: ["Intercom", "Zendesk", "Freshdesk", "Gmail", "WhatsApp Business", "Messenger", "Instagram", "OpenAI", "Claude"],
    setup: "1-3 weeks",
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
      name: "Missed-call follow-up",
      trigger: "A call goes unanswered",
      steps: [
        "The caller instantly receives a friendly SMS with a booking link",
        "If they reply, an AI assistant answers basic questions by text",
        "The lead and conversation are saved to your CRM",
        "Your team gets a summary to call back the warm ones",
      ],
      outcome: "Missed callers get a reply straight away instead of trying the next business.",
    },
    tools: ["Twilio", "Vapi", "Retell", "Aircall", "Calendly", "Cal.com", "HubSpot", "Google Sheets"],
    setup: "1-2 weeks",
    faqs: [
      { q: "Does the AI voice sound natural?", a: "Current voice agents sound quite natural. We still tell callers they are talking to an assistant and give them a way to reach a person." },
      { q: "Can we keep our existing phone number?", a: "Usually, yes. Calls are forwarded from your current number." },
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
      name: "Supplier invoice processing",
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
    setup: "1-3 weeks",
    faqs: [
      { q: "How accurate is document extraction?", a: "Very accurate on clean documents. We add validation rules and a human review step for anything below a confidence threshold." },
      { q: "Can it handle our odd spreadsheet layout?", a: "Yes. We build around the way you already work and don't force a new format on you." },
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
      outcome: "Every new hire gets the same start, and no steps get skipped.",
    },
    tools: ["QuickBooks", "Xero", "Google Workspace", "Slack", "BambooHR", "DocuSign", "Notion", "Google Forms"],
    setup: "2-3 weeks",
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
      outcome: "Stock counts stay accurate and fewer customers email to ask where their order is.",
    },
    tools: ["Shopify", "WooCommerce", "Amazon", "Daraz", "Stripe", "ShipStation", "Klaviyo", "Google Sheets"],
    setup: "1-3 weeks",
    faqs: [
      { q: "Which platforms do you support?", a: "Shopify and WooCommerce most often, plus marketplaces that offer an API." },
      { q: "Can you bulk-update thousands of products?", a: "Yes, from a spreadsheet, a supplier feed or another store." },
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
      outcome: "Everyone starts the week looking at the same numbers.",
    },
    tools: ["n8n", "Make", "Zapier", "Python", "Node.js", "Playwright", "Supabase", "Telegram"],
    setup: "2-6 weeks",
    faqs: [
      { q: "Who owns the code and workflows?", a: "You do. Everything is built in your accounts and handed over with documentation." },
      { q: "What if a tool changes its API?", a: "Our support plans include monitoring and fixes when a connected service changes." },
    ],
  },
  // ---------- Web & App Development ----------
  "web-development": {
    tags: ["Business sites", "Online stores", "Landing pages"],
    pains: [
      { title: "The site looks dated", body: "Visitors judge you in seconds, and an old template tells them you might be out of business." },
      { title: "It's slow on phones", body: "Most traffic is mobile, and every extra second of loading loses people before they read a word." },
      { title: "Enquiries go nowhere", body: "Contact forms land in an inbox nobody checks, instead of in your CRM with an instant reply." },
    ],
    workflow: {
      name: "From brief to live site",
      trigger: "A 30-minute call about your business, customers and goals",
      steps: [
        "Sitemap and wireframes so the structure is agreed before design",
        "Visual design in your brand, reviewed page by page",
        "Build, content entry and speed and SEO basics",
        "Forms wired into your CRM, email and automations",
      ],
      outcome: "A fast, editable website that sends every enquiry where it needs to go.",
    },
    tools: ["Next.js", "WordPress", "Webflow", "Shopify", "WooCommerce", "Vercel", "Cloudflare", "Google Analytics"],
    setup: "2-5 weeks",
    faqs: [
      { q: "Can we edit the website ourselves?", a: "Yes. We set up an editor that suits your team, such as WordPress, Webflow or a simple CMS, and show you how to use it." },
      { q: "Do you write the content?", a: "We can. Send us what you have and we'll shape it, or we write it from a short interview with you." },
      { q: "What about hosting and domains?", a: "We set them up in your own accounts, so you own them. Ongoing care is available if you want us to look after updates and backups." },
    ],
  },
  "app-development": {
    tags: ["iOS + Android", "Booking apps", "Marketplaces"],
    pains: [
      { title: "Two apps cost twice", body: "Separate iOS and Android teams double the budget and the time for every change." },
      { title: "Customers expect an app", body: "Repeat customers want bookings, orders and rewards in their pocket, not in a browser tab." },
      { title: "Field staff work on paper", body: "Jobs, photos and signatures come back on paper or WhatsApp and get typed up later." },
    ],
    workflow: {
      name: "App from idea to store",
      trigger: "You share the idea, who it's for and what it must do first",
      steps: [
        "Scope a first version that does the important things well",
        "UX flows and UI design, tested as a clickable prototype",
        "Build for iOS and Android from one cross-platform codebase",
        "Beta test with real users, then publish to both stores",
      ],
      outcome: "A live app in the App Store and Google Play, with a plan for the next release.",
    },
    tools: ["React Native", "Expo", "Flutter", "Firebase", "Supabase", "Stripe", "OneSignal", "App Store Connect"],
    setup: "6-12 weeks",
    faqs: [
      { q: "Native or cross-platform?", a: "Most business apps are best built cross-platform with React Native or Flutter. One codebase covers both stores and costs less. We'll tell you if your app needs native." },
      { q: "Do you handle App Store approval?", a: "Yes. Store listings, screenshots, privacy forms and the review process are part of the project." },
      { q: "Can the app connect to our existing systems?", a: "Yes. Apps usually sit on top of your CRM, store or database, and we connect them with your automations." },
    ],
  },
  "web-apps-and-saas": {
    tags: ["SaaS MVPs", "Client portals", "Internal tools"],
    pains: [
      { title: "The process lives in spreadsheets", body: "The business has outgrown a tangle of sheets, and nobody trusts which copy is current." },
      { title: "Off-the-shelf doesn't fit", body: "You pay for three tools that each do 60% of what you need." },
      { title: "An idea with no product yet", body: "You know the problem well but need a team to turn it into software people pay for." },
    ],
    workflow: {
      name: "SaaS MVP",
      trigger: "A clear problem and a first group of users",
      steps: [
        "Agree the smallest version worth charging for",
        "Design the core screens and data model",
        "Build sign-up, the core feature, billing and an admin panel",
        "Launch to first users, measure, and plan the next release",
      ],
      outcome: "A working product in front of real users, with code you fully own.",
    },
    tools: ["Next.js", "React", "Node.js", "Python", "PostgreSQL", "Supabase", "Stripe", "OpenAI"],
    setup: "4-10 weeks",
    faqs: [
      { q: "Who owns the code?", a: "You do. It lives in your repository and accounts from day one." },
      { q: "Can you add AI features?", a: "Yes. Chat assistants, search over your own documents, summaries and automatic data extraction are common additions." },
      { q: "What happens after launch?", a: "We can stay on for new features, monitoring and fixes, or hand over to your own developers with documentation." },
    ],
  },
  // ---------- Data & Cloud ----------
  "database-management": {
    tags: ["Postgres", "Migrations", "Backups"],
    pains: [
      { title: "Spreadsheets as a database", body: "Ten thousand rows, five editors and a formula someone broke last month." },
      { title: "Everything is slow", body: "Pages and reports take seconds to load because the queries were never tuned." },
      { title: "No tested backup", body: "Backups exist in theory, but nobody has ever tried restoring one." },
    ],
    workflow: {
      name: "Spreadsheet to database",
      trigger: "Your data has outgrown sheets or Airtable",
      steps: [
        "Map what you store today and how it's used",
        "Design a clean schema with the right relations and rules",
        "Migrate, de-duplicate and verify every record",
        "Set up access roles, backups and monitoring",
      ],
      outcome: "One reliable source of truth your apps, reports and automations all read from.",
    },
    tools: ["PostgreSQL", "MySQL", "MongoDB", "Supabase", "Firebase", "Redis", "Airtable", "Google Sheets"],
    setup: "1-4 weeks",
    faqs: [
      { q: "Can we still use spreadsheets?", a: "Yes. We can keep a synced sheet or a simple admin view for the people who prefer it." },
      { q: "Will there be downtime during migration?", a: "We plan migrations so the switch-over takes minutes, usually outside your working hours." },
    ],
  },
  "data-and-analytics": {
    tags: ["KPI dashboards", "Pipelines", "Auto reports"],
    pains: [
      { title: "Numbers in ten tabs", body: "Answering a simple question means exporting from four tools and pasting into a sheet." },
      { title: "Reports are always late", body: "By the time the monthly report is ready, the month it describes is long gone." },
      { title: "Nobody notices problems", body: "A drop in sales or a spike in refunds is spotted weeks later, if at all." },
    ],
    workflow: {
      name: "Live business dashboard",
      trigger: "Every hour, on a schedule",
      steps: [
        "Pull data from your CRM, store, ads and accounting tools",
        "Clean and join it in one warehouse",
        "Refresh dashboards with the KPIs you agreed",
        "Send alerts when a number moves outside its normal range",
      ],
      outcome: "Up-to-date numbers on one screen, and a ping when something needs attention.",
    },
    tools: ["Looker Studio", "Power BI", "Metabase", "BigQuery", "PostgreSQL", "Python", "Google Sheets", "Slack"],
    setup: "1-3 weeks",
    faqs: [
      { q: "Which dashboard tool should we use?", a: "Usually the one your team already opens. Looker Studio is free and fine for most; Power BI suits Microsoft shops." },
      { q: "Can you collect data from websites?", a: "Yes, where the site's terms allow it. Typical examples are prices, listings and public directories." },
    ],
  },
  "cloud-and-devops": {
    tags: ["Hosting", "CI/CD", "Monitoring"],
    pains: [
      { title: "Deploys are scary", body: "Updates go out by hand on a Friday evening, and sometimes take the site down." },
      { title: "You hear about outages from customers", body: "There's no monitoring, so the first alert is an angry email." },
      { title: "The cloud bill keeps growing", body: "Servers nobody remembers creating are still running and still billing." },
    ],
    workflow: {
      name: "Automatic deploys",
      trigger: "A developer pushes a change",
      steps: [
        "Tests and checks run automatically",
        "A preview copy is built for review",
        "On approval it goes live with zero downtime",
        "Health checks watch it, and a bad release rolls back by itself",
      ],
      outcome: "Releases become routine, and you hear about outages before your customers do.",
    },
    tools: ["AWS", "Google Cloud", "DigitalOcean", "Oracle Cloud", "Vercel", "Docker", "GitHub Actions", "Cloudflare"],
    setup: "1-3 weeks",
    faqs: [
      { q: "Do you offer ongoing server management?", a: "Yes. Monitoring, updates, backups and fixes are included in our monthly plans." },
      { q: "Can you make our emails stop going to spam?", a: "Often, yes. Correct SPF, DKIM and DMARC records and a clean sending setup fix most deliverability problems." },
    ],
  },
  // ---------- Design ----------
  "ui-ux-design": {
    tags: ["Figma", "Prototypes", "Design systems"],
    pains: [
      { title: "Users get lost", body: "Support tickets ask where things are, and sign-ups stall halfway through." },
      { title: "Every screen looks different", body: "Features were added one at a time, and the product no longer feels like one thing." },
      { title: "Building before testing", body: "Developers build screens nobody tested, then rebuild them after launch." },
    ],
    workflow: {
      name: "Design sprint",
      trigger: "A product, feature or flow that needs to work better",
      steps: [
        "Talk to users and review analytics to find where they struggle",
        "Map the flows and sketch wireframes",
        "Design high-fidelity screens in Figma on a shared design system",
        "Test a clickable prototype with real users and refine",
      ],
      outcome: "Designs that are ready to build and have been tested with real users.",
    },
    tools: ["Figma", "FigJam", "Framer", "Maze", "Hotjar", "Google Analytics", "Storybook", "Tailwind CSS"],
    setup: "2-4 weeks",
    faqs: [
      { q: "Can you design and also build it?", a: "Yes. Our developers build from the same design system, so less gets lost in the hand-off." },
      { q: "Do you do accessibility?", a: "Yes. We design to WCAG contrast and keyboard guidelines, and can audit what you already have." },
    ],
  },
  branding: {
    tags: ["Logos", "Brand kits", "Pitch decks"],
    pains: [
      { title: "You look smaller than you are", body: "A home-made logo and mismatched colours undersell a business that's doing well." },
      { title: "Every post looks different", body: "Without templates, each graphic is designed from scratch, in a different style." },
      { title: "Decks take days", body: "Every pitch or proposal starts from an old file and a lot of reformatting." },
    ],
    workflow: {
      name: "Brand kit",
      trigger: "A short questionnaire about your business, audience and taste",
      steps: [
        "Mood boards and direction options",
        "Logo concepts, refined with your feedback",
        "Colours, typography and voice written into brand guidelines",
        "Social, deck and document templates in your new look",
      ],
      outcome: "A complete brand kit your team can use without calling a designer.",
    },
    tools: ["Figma", "Adobe Illustrator", "Photoshop", "Canva", "Google Slides", "PowerPoint", "After Effects"],
    setup: "2-3 weeks",
    faqs: [
      { q: "Do we get the source files?", a: "Yes. Every logo format, the editable files and the templates are yours." },
      { q: "Can our team edit the templates?", a: "Yes. We build them in Canva or Google Slides when your team needs to edit them without design software." },
    ],
  },
  // ---------- SEO & Growth ----------
  seo: {
    tags: ["Technical SEO", "Local SEO", "Content plans"],
    pains: [
      { title: "Competitors rank above you", body: "Customers search for exactly what you sell and find someone else first." },
      { title: "Traffic but no leads", body: "The pages that do rank attract visitors who were never going to buy." },
      { title: "Nobody knows what's working", body: "Blog posts go out, but nobody tracks which ones bring business." },
    ],
    workflow: {
      name: "Monthly SEO work",
      trigger: "A technical and competitor audit of your site",
      steps: [
        "Fix the technical issues holding pages back",
        "Pick keywords that people ready to buy actually search",
        "Optimise key pages and publish a steady content plan",
        "Build local listings and reputable links",
      ],
      outcome: "Steady work on rankings and enquiries, with a monthly report on what changed.",
    },
    tools: ["Google Search Console", "Google Analytics", "Ahrefs", "Semrush", "Screaming Frog", "Google Business Profile", "Surfer"],
    setup: "Ongoing, results in 3-6 months",
    faqs: [
      { q: "How long until we see results?", a: "Technical fixes can help within weeks; meaningful ranking gains usually take three to six months." },
      { q: "Do you guarantee first place?", a: "No, and nobody honest can. We commit to the work, the reporting and a clear plan." },
    ],
  },
  "paid-ads": {
    tags: ["Google Ads", "Meta Ads", "Tracking"],
    pains: [
      { title: "Spend with no clear return", body: "Money goes out every day, but nobody can say which ads brought customers." },
      { title: "Tracking is broken", body: "Conversions are double-counted or missing since the last site update." },
      { title: "Ads point at the homepage", body: "Expensive clicks land on a page that wasn't built to convert them." },
    ],
    workflow: {
      name: "Ad account rebuild",
      trigger: "An audit of your accounts, tracking and landing pages",
      steps: [
        "Fix conversion tracking so every lead and sale is counted",
        "Build campaigns around the searches and audiences that buy",
        "Launch with focused landing pages and A/B tests",
        "Shift budget weekly toward what returns the most",
      ],
      outcome: "Ad spend you can tie to leads and revenue, reported every week.",
    },
    tools: ["Google Ads", "Meta Ads Manager", "LinkedIn Ads", "TikTok Ads", "GA4", "Google Tag Manager", "Looker Studio"],
    setup: "1-2 weeks to launch",
    faqs: [
      { q: "Is ad spend included in your fee?", a: "No. Ad spend is paid directly by you to Google or Meta, so you always see exactly where it goes." },
      { q: "What budget do we need?", a: "It depends on your market. We'll suggest a test budget in the audit, sized so the results mean something." },
    ],
  },
  "content-and-social": {
    tags: ["Social calendar", "Short video", "Newsletters"],
    pains: [
      { title: "Channels go quiet", body: "Posting stops whenever the team gets busy, which is most weeks." },
      { title: "Content takes too long", body: "One post takes an afternoon of writing, designing and resizing." },
      { title: "No consistent voice", body: "Every post sounds like whoever had time to write it." },
    ],
    workflow: {
      name: "Monthly content plan",
      trigger: "A monthly planning call",
      steps: [
        "Plan topics around your offers, seasons and questions customers ask",
        "Write, design and edit posts, videos and emails",
        "You approve the batch in one place",
        "Everything is scheduled, and results are reviewed next month",
      ],
      outcome: "A month of on-brand content scheduled ahead, with little of your team's time spent on it.",
    },
    tools: ["Meta Business Suite", "Buffer", "Canva", "CapCut", "Premiere Pro", "Mailchimp", "Klaviyo", "Notion"],
    setup: "First posts in 1-2 weeks",
    faqs: [
      { q: "Do we need to be on camera?", a: "No. Many formats work without a face, such as screen recordings, product shots, animated text and customer stories." },
      { q: "Can AI help keep costs down?", a: "Yes. We use AI for drafts and repurposing, and a person edits everything before it goes out." },
    ],
  },
};
