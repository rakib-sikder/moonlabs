// Case studies, process, pricing and FAQ content.
// Case studies describe real systems we built and run — no invented client names or metrics.

export type CaseStudy = {
  slug: string;
  name: string;
  kind: string;
  summary: string;
  problem: string;
  solution: string[];
  outcomes: string[];
  stack: string[];
  color: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "leadpilot",
    name: "LeadPilot",
    kind: "Lead generation & outreach engine",
    summary: "A system that runs around the clock, finds new leads, drafts a first message for each one and alerts the team.",
    problem:
      "Finding new leads meant hours of manual searching every day, and by the time someone wrote a reply the best leads had already been contacted by others.",
    solution: [
      "Collectors watch lead sources around the clock and capture new posts the moment they appear",
      "Each lead gets screenshots and an AI-written introduction tailored to what they asked for",
      "A shared lead store lets several machines work without double-contacting anyone",
      "A web dashboard with two-factor sign-in, passkeys and device management controls everything",
      "Telegram alerts for 14 configurable events, including new leads, failures and quota warnings",
    ],
    outcomes: [
      "Runs unattended on a main machine with automatic failover to a standby cloud server",
      "Fails back to the main node by itself when it recovers",
      "Replies go out in minutes instead of hours",
    ],
    stack: ["Python", "Playwright", "PostgREST", "Telegram Bot API", "Cloudflare Tunnel", "Linux VPS"],
    color: "#f5b24e",
  },
  {
    slug: "gmail-forwarding",
    name: "Inbox Unifier",
    kind: "Gmail setup automation",
    summary: "Turns on 'forward a copy' across many Gmail accounts so every message lands in one inbox. Nobody has to click through settings.",
    problem:
      "Running outreach from about ten Gmail accounts meant checking ten inboxes. Setting up forwarding by hand on each one was slow and easy to get wrong.",
    solution: [
      "A browser automation signs in to each account and walks through Gmail's forwarding settings",
      "It watches the page and adapts when Gmail's interface changes, instead of relying on fixed clicks",
      "When Google asks for a security check, it pauses and hands over to a person. It never tries to get around it",
      "Confirmation emails are picked up and verified automatically",
    ],
    outcomes: [
      "All replies arrive in one inbox",
      "A setup job that took an afternoon now runs in the background",
      "Google's security checks are left to a person",
    ],
    stack: ["Node.js", "Playwright", "Gmail", "Chrome"],
    color: "#5ee0d0",
  },
  {
    slug: "browser-profiles",
    name: "Automation Toolkit",
    kind: "Multi-profile browser workstation",
    summary: "A desktop app that runs many separate Chrome profiles, each with its own proxy and settings, for teams that manage multiple accounts.",
    problem:
      "Managing many accounts from one browser mixed up cookies and logins, and the commercial tools were expensive and hard to inspect.",
    solution: [
      "Each profile is a fully isolated real Chrome instance launched and controlled with Playwright",
      "Each profile gets its own proxy, and a tester on a cloud server checks the proxies around the clock",
      "Profiles can also run remotely on a server and be used from any laptop",
    ],
    outcomes: [
      "Clean separation between accounts",
      "Dead proxies are caught before they cause problems",
      "One-click launch of any profile, locally or remotely",
    ],
    stack: ["Electron", "Playwright", "Chrome", "Linux VPS", "Xpra"],
    color: "#ffc76b",
  },
];

export const processStages = [
  {
    n: "01",
    title: "Free audit",
    when: "Day 1 · 30 min",
    body: "A video call where we go through the repetitive work in your business and pick out what could be automated.",
    youGet: ["List of automation opportunities", "Rough hours-saved estimate", "Honest 'not worth it' calls"],
    youGive: "30 minutes and a walk-through of a normal week.",
  },
  {
    n: "02",
    title: "Automation plan",
    when: "2-3 days",
    body: "A short written plan covering what we automate, which tools we connect, the price and the hours it should save.",
    youGet: ["Workflow diagram", "Fixed price & timeline", "Success criteria we both sign off"],
    youGive: "Feedback on the plan and a go-ahead.",
  },
  {
    n: "03",
    title: "Build",
    when: "1-4 weeks",
    body: "We build and test against your real data, with a human approval step anywhere a mistake would cost you.",
    youGet: ["Weekly progress demo", "Test runs on real examples", "Everything built in your accounts"],
    youGive: "Access to the tools involved and a contact for questions.",
  },
  {
    n: "04",
    title: "Launch",
    when: "1 day + 2 weeks care",
    body: "We switch it on, train your team in one session, and watch the first runs closely.",
    youGet: ["Team training session", "Written documentation", "Two weeks of close monitoring"],
    youGive: "One hour for training.",
  },
  {
    n: "05",
    title: "Orbit",
    when: "Monthly",
    body: "We keep an eye on everything, fix what breaks and add new automations as you need them, on a monthly plan.",
    youGet: ["Monitoring & alerts", "Fixes when tools change", "New automations each month"],
    youGive: "Ideas for what to automate next.",
  },
];

/* Prices are the owner's to confirm — edit here and every page updates. */
export const plans = [
  {
    name: "Crescent",
    tagline: "One automation, done properly.",
    price: "$99",
    unit: "one-time, from",
    cta: "Start with one",
    featured: false,
    features: [
      "One workflow, connecting up to 3 tools",
      "Built in your accounts, so you own it",
      "Team training and written docs",
      "2 weeks of post-launch care",
    ],
  },
  {
    name: "Half Moon",
    tagline: "New automations every month.",
    price: "$199",
    unit: "per month",
    cta: "Book a free audit",
    featured: true,
    features: [
      "Up to 2 new automations every month",
      "Monitoring, alerts and fixes included",
      "Priority support on Slack or Telegram",
      "Monthly hours-saved report",
      "Cancel any time",
    ],
  },
  {
    name: "Full Moon",
    tagline: "For teams with a long list.",
    price: "$399",
    unit: "per month",
    cta: "Talk to us",
    featured: false,
    features: [
      "Unlimited requests, one at a time",
      "Custom AI agents and internal tools",
      "Dedicated channel, same-day replies",
      "Quarterly automation roadmap",
      "Everything in Half Moon",
    ],
  },
];

/** Plan-by-plan feature matrix on the pricing page. `true` = included, `false` = not included. */
export const planMatrix: { group: string; rows: { label: string; values: [string | boolean, string | boolean, string | boolean] }[] }[] = [
  {
    group: "Building",
    rows: [
      { label: "New automations", values: ["1 workflow", "Up to 2 per month", "Unlimited, one at a time"] },
      { label: "Tools connected per workflow", values: ["Up to 3", "Any", "Any"] },
      { label: "Custom AI agents & internal tools", values: [false, false, true] },
      { label: "Built in your accounts, owned by you", values: [true, true, true] },
    ],
  },
  {
    group: "Care",
    rows: [
      { label: "Monitoring & alerts", values: ["First 2 weeks", true, true] },
      { label: "Fixes when a connected tool changes", values: ["First 2 weeks", true, true] },
      { label: "Documentation & team training", values: [true, true, true] },
    ],
  },
  {
    group: "Support & reporting",
    rows: [
      { label: "Support channel", values: ["Email", "Slack or Telegram, priority", "Dedicated channel"] },
      { label: "Reply time", values: ["2 working days", "Next working day", "Same day"] },
      { label: "Hours-saved report", values: [false, "Monthly", "Monthly"] },
      { label: "Automation roadmap", values: [false, false, "Quarterly"] },
      { label: "Client portal access", values: [true, true, true] },
    ],
  },
];

export const comparison: { row: string; values: [string, string, string] }[] = [
  { row: "Cost to start", values: ["Free audit, then a fixed price", "Salary + hiring time", "Hourly, varies"] },
  { row: "Time to first result", values: ["1-2 weeks", "2-3 months", "Depends who you find"] },
  { row: "Breadth of tools", values: ["AI, APIs, no-code, custom code", "Whatever one person knows", "Usually one platform"] },
  { row: "When something breaks", values: ["Monitored, fixed on retainer", "If they are not on leave", "Often gone after handover"] },
  { row: "Documentation", values: ["Always included", "Rarely", "Rarely"] },
];

export const faqs: { group: string; items: { q: string; a: string }[] }[] = [
  {
    group: "Getting started",
    items: [
      { q: "What does the free audit include?", a: "A 30-minute call where we look at how a normal week runs, list what could be automated, and estimate hours saved. You keep the list whether or not you work with us." },
      { q: "We're a small business. Is this for us?", a: "Yes. Small teams often get the most out of it, because the person answering emails is usually also doing sales and admin. Many projects start with one workflow." },
      { q: "Do you only do automation?", a: "Automation is most of our work. The same team also builds websites, mobile apps and web apps, manages databases and servers, designs interfaces and brands, and runs SEO, ads and content. It helps to have one team that knows how all the pieces connect." },
      { q: "Do we need to change our tools?", a: "Almost never. We connect the tools you already use. If something truly can't be connected, we'll tell you in the audit." },
    ],
  },
  {
    group: "Pricing & timeline",
    items: [
      { q: "How much does an automation cost?", a: "Single projects start from $99, and most land between $99 and $399 depending on how many tools are involved. You get a fixed price before we start." },
      { q: "How long does it take?", a: "Simple workflows go live in 1-2 weeks. Larger projects with several systems take 3-6 weeks." },
      { q: "Can we cancel a monthly plan?", a: "Yes, any time with 30 days' notice. Everything we built stays in your accounts." },
    ],
  },
  {
    group: "Security & control",
    items: [
      { q: "Is our data safe?", a: "We build inside your own accounts, use the minimum permissions needed, never store your data on our machines longer than a job needs, and sign an NDA on request." },
      { q: "Will AI send things without us knowing?", a: "Only if you ask it to. By default anything customer-facing or risky goes through a one-tap approval step, and every action is logged." },
      { q: "Who owns what you build?", a: "You do. The workflows, code and documentation are yours." },
    ],
  },
  {
    group: "After launch",
    items: [
      { q: "What happens when something breaks?", a: "On a monthly plan we monitor your automations and fix problems, often before you notice them. Without a plan, fixes are billed at a fixed rate." },
      { q: "Can our team change the automations?", a: "Yes. We document everything and train your team, and we build in tools your team can edit when that makes sense." },
    ],
  },
];
