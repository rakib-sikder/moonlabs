// Industry landing pages. `services` are slugs from lib/site.ts.

export type IndustryDetail = {
  slug: string;
  name: string;
  headline: string;
  intro: string;
  pains: string[];
  automations: { title: string; body: string }[];
  services: string[];
  /** One example automation for this industry, drawn as a pipeline. */
  workflow: { name: string; trigger: string; steps: string[]; outcome: string };
  /** Related case study slug (lib/content/company.ts), when one fits. */
  caseStudy?: string;
};

export const industryDetails: IndustryDetail[] = [
  {
    slug: "real-estate",
    name: "Real estate",
    headline: "Reply to enquiries before the next agent does.",
    intro: "Property leads come in from portals, your site and the phone, and they go cold fast. We make sure each one gets a reply and every viewing is confirmed.",
    pains: ["Portal enquiries answered hours late", "Viewings booked by phone tag", "Listings updated by hand on every site"],
    automations: [
      { title: "Instant lead reply", body: "Enquiries from portals and your site get a personal reply and viewing slots within minutes." },
      { title: "Viewing reminders", body: "Confirmations and reminders by SMS cut no-shows." },
      { title: "Listing sync", body: "Update a property once and it changes on every portal." },
      { title: "Seller reports", body: "Owners get a weekly summary of views, enquiries and feedback." },
    ],
    services: ["sales-and-leads", "voice-and-calls", "operations", "web-development"],
    workflow: {
      name: "Portal enquiry to booked viewing",
      trigger: "An enquiry arrives from a property portal or your website",
      steps: [
        "The lead is matched to the listing and logged in your CRM",
        "A personal reply with three viewing slots goes out within minutes",
        "The buyer picks a slot and it lands in the agent's calendar",
        "SMS reminders go out the day before and two hours before",
      ],
      outcome: "A confirmed viewing with no phone tag, and every enquiry tracked.",
    },
    caseStudy: "leadpilot",
  },
  {
    slug: "healthcare",
    name: "Clinics & healthcare",
    headline: "Fewer no-shows, less front-desk overload.",
    intro: "Clinics lose hours to booking calls, reminders and paperwork. We automate that admin and leave clinical work to your staff.",
    pains: ["Phones ringing all day for bookings", "Patients forgetting appointments", "Intake forms retyped into the system"],
    automations: [
      { title: "Online booking + reminders", body: "Patients book themselves and get reminders that reduce no-shows." },
      { title: "Digital intake", body: "Forms are filled before the visit and land in your system automatically." },
      { title: "Missed-call recovery", body: "Unanswered calls get an instant SMS with a booking link." },
      { title: "Review requests", body: "Happy patients are asked for a review after their visit." },
    ],
    services: ["voice-and-calls", "operations", "marketing", "app-development"],
    workflow: {
      name: "Missed call to booked appointment",
      trigger: "A patient calls while reception is busy",
      steps: [
        "A text goes out within a minute with a booking link",
        "The patient picks a slot with the right practitioner",
        "Intake forms are sent and attached to the record",
        "Reminders cut no-shows and a waitlist fills cancellations",
      ],
      outcome: "Fewer missed bookings and a front desk that isn't buried.",
    },
  },
  {
    slug: "restaurants",
    name: "Restaurants",
    headline: "More bookings and reviews, less admin.",
    intro: "From reservations to supplier orders, we take the repetitive work off a busy kitchen and front of house.",
    pains: ["Reservation calls during service", "Inconsistent social posting", "Stock counted on paper"],
    automations: [
      { title: "Booking assistant", body: "Reservations by chat, WhatsApp or phone, confirmed automatically." },
      { title: "Daily specials posting", body: "Post today's menu to every channel from one message." },
      { title: "Review requests", body: "Guests are asked for a review the day after their visit." },
      { title: "Supplier reorders", body: "Low stock triggers a draft order to your supplier." },
    ],
    services: ["customer-support", "marketing", "operations", "app-development"],
    workflow: {
      name: "Review and feedback loop",
      trigger: "A reservation or order is completed",
      steps: [
        "The guest gets a thank-you message the next day",
        "Happy guests are pointed to Google; complaints come to the manager privately",
        "Every new review is posted to the team chat",
        "A weekly summary shows ratings and recurring themes",
      ],
      outcome: "More reviews, and bad experiences caught before they go public.",
    },
  },
  {
    slug: "e-commerce",
    name: "E-commerce stores",
    headline: "Sell on several channels without the spreadsheets.",
    intro: "Every new sales channel adds more orders, stock counts and customer messages. We keep them in sync and cut down the support email.",
    pains: ["Overselling across channels", "Abandoned carts with no follow-up", "'Where is my order?' emails"],
    automations: [
      { title: "Inventory sync", body: "Stock updates across every store and marketplace in real time." },
      { title: "Cart recovery", body: "Timed reminders bring shoppers back to finish checkout." },
      { title: "Order updates", body: "Customers get proactive shipping updates by SMS or email." },
      { title: "Product uploads", body: "Bulk-create and update listings from a sheet or supplier feed." },
    ],
    services: ["e-commerce", "customer-support", "marketing", "paid-ads"],
    workflow: {
      name: "Order to delivery",
      trigger: "A new order is placed",
      steps: [
        "Stock is updated on every sales channel",
        "The order goes to fulfilment and a shipping label is created",
        "The customer gets tracking updates by email or WhatsApp",
        "Abandoned carts and low stock trigger their own flows",
      ],
      outcome: "Accurate stock and far fewer 'where is my order?' emails.",
    },
  },
  {
    slug: "agencies",
    name: "Agencies",
    headline: "Less time on reports, more on client work.",
    intro: "Agencies repeat the same processes for every client: onboarding, reporting and approvals. That makes them good candidates for automation.",
    pains: ["Monthly reports built by hand", "Client onboarding emails copied each time", "Lead gen for your own agency neglected"],
    automations: [
      { title: "Automatic client reports", body: "Ad and SEO results pulled into a branded report on schedule." },
      { title: "Client onboarding", body: "Contracts, access requests and kickoff scheduling in one flow." },
      { title: "Outbound for your agency", body: "Targeted lead lists and outreach running in the background." },
      { title: "Approval workflows", body: "Content goes to clients for sign-off and comes back tracked." },
    ],
    services: ["marketing", "sales-and-leads", "custom-build", "web-apps-and-saas"],
    workflow: {
      name: "Weekly client reporting",
      trigger: "Every Monday at 8am",
      steps: [
        "Numbers are pulled from ads, analytics and CRM for each client",
        "A branded report is generated per client",
        "AI drafts a summary of what changed and why",
        "The account manager approves it and it's sent",
      ],
      outcome: "Client reports in minutes instead of a day each month.",
    },
    caseStudy: "gmail-forwarding",
  },
  {
    slug: "law-firms",
    name: "Law firms",
    headline: "Take intake and document work off your fee-earners.",
    intro: "Lawyers shouldn't spend billable hours on intake forms and chasing documents. We automate that admin so they can focus on the legal work.",
    pains: ["Intake calls that never become clients", "Documents chased by email", "Deadlines tracked in personal calendars"],
    automations: [
      { title: "Structured intake", body: "Enquiries are qualified with the right questions and routed to the right lawyer." },
      { title: "Document collection", body: "Clients upload what is needed through a guided checklist with reminders." },
      { title: "Contract drafting", body: "First drafts are generated from templates and intake answers for review." },
      { title: "Deadline alerts", body: "Key dates are tracked centrally with reminders to the whole team." },
    ],
    services: ["operations", "customer-support", "custom-build", "seo"],
    workflow: {
      name: "Intake to engagement letter",
      trigger: "A potential client completes the intake form",
      steps: [
        "Conflict-check details are extracted and logged",
        "The matter is created in your practice system",
        "An engagement letter is drafted from your template",
        "It goes out for e-signature and is filed when signed",
      ],
      outcome: "New matters opened the same day, with nothing retyped.",
    },
  },
  {
    slug: "education",
    name: "Education & coaching",
    headline: "Enrolment and reminders, handled automatically.",
    intro: "Course creators and coaching businesses lose students in the gaps between enquiry, payment and the first session.",
    pains: ["Enquiries without follow-up", "Manual class reminders", "Student questions answered one by one"],
    automations: [
      { title: "Enrolment funnel", body: "Enquiries get information, a payment link and follow-ups automatically." },
      { title: "Class reminders", body: "Students are reminded before every session by email or WhatsApp." },
      { title: "Student help bot", body: "Common questions about schedules and materials answered instantly." },
      { title: "Progress check-ins", body: "Automatic nudges for students who fall behind." },
    ],
    services: ["sales-and-leads", "customer-support", "marketing", "app-development"],
    workflow: {
      name: "Enquiry to enrolled",
      trigger: "A student or parent enquires",
      steps: [
        "Course details and a trial-class link are sent instantly",
        "Bookings go to the right teacher's calendar",
        "Attendance and payments are tracked automatically",
        "Reminders go out for renewals and unpaid fees",
      ],
      outcome: "More trials booked and fewer students lost between messages.",
    },
  },
  {
    slug: "logistics",
    name: "Logistics",
    headline: "Shipment updates sent automatically.",
    intro: "Shipments create a constant stream of updates, documents and questions. We automate the communication around them.",
    pains: ["Customers calling for status", "Delivery documents retyped", "Quotes taking a day to return"],
    automations: [
      { title: "Proactive tracking updates", body: "Customers get status changes without asking." },
      { title: "Document extraction", body: "Bills of lading and invoices are read and filed automatically." },
      { title: "Fast quoting", body: "Quote requests are priced from your rate tables and sent for approval." },
      { title: "Exception alerts", body: "Delays and failed deliveries are flagged to your team immediately." },
    ],
    services: ["operations", "customer-support", "custom-build", "data-and-analytics"],
    workflow: {
      name: "Proof of delivery to invoice",
      trigger: "A driver marks a delivery complete",
      steps: [
        "The photo and signature are attached to the job",
        "The customer gets a delivery confirmation",
        "An invoice is created in your accounting tool",
        "Late or failed deliveries alert the dispatcher",
      ],
      outcome: "Invoices out the same day and no paperwork to chase.",
    },
  },
];
