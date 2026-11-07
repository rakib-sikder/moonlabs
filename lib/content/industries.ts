// Industry landing pages. `services` are slugs from lib/site.ts.

export type IndustryDetail = {
  slug: string;
  name: string;
  headline: string;
  intro: string;
  pains: string[];
  automations: { title: string; body: string }[];
  services: string[];
};

export const industryDetails: IndustryDetail[] = [
  {
    slug: "real-estate",
    name: "Real estate",
    headline: "Answer every enquiry before the next agent does.",
    intro: "Property leads are time-sensitive and arrive from everywhere. We make sure none are missed and every viewing is confirmed.",
    pains: ["Portal enquiries answered hours late", "Viewings booked by phone tag", "Listings updated by hand on every site"],
    automations: [
      { title: "Instant lead reply", body: "Enquiries from portals and your site get a personal reply and viewing slots within minutes." },
      { title: "Viewing reminders", body: "Confirmations and reminders by SMS cut no-shows." },
      { title: "Listing sync", body: "Update a property once and it changes on every portal." },
      { title: "Seller reports", body: "Owners get a weekly summary of views, enquiries and feedback." },
    ],
    services: ["sales-and-leads", "voice-and-calls", "operations"],
  },
  {
    slug: "healthcare",
    name: "Clinics & healthcare",
    headline: "Fewer no-shows, less front-desk overload.",
    intro: "Clinics lose hours to booking calls, reminders and paperwork. We automate the admin around care, never the care itself.",
    pains: ["Phones ringing all day for bookings", "Patients forgetting appointments", "Intake forms retyped into the system"],
    automations: [
      { title: "Online booking + reminders", body: "Patients book themselves and get reminders that reduce no-shows." },
      { title: "Digital intake", body: "Forms are filled before the visit and land in your system automatically." },
      { title: "Missed-call recovery", body: "Unanswered calls get an instant SMS with a booking link." },
      { title: "Review requests", body: "Happy patients are asked for a review after their visit." },
    ],
    services: ["voice-and-calls", "operations", "marketing"],
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
      { title: "Review engine", body: "Guests are asked for a review at the right moment." },
      { title: "Supplier reorders", body: "Low stock triggers a draft order to your supplier." },
    ],
    services: ["customer-support", "marketing", "operations"],
  },
  {
    slug: "e-commerce",
    name: "E-commerce stores",
    headline: "Sell everywhere without the spreadsheet chaos.",
    intro: "Orders, stock and customer messages multiply with every channel. We keep them in sync and your inbox quiet.",
    pains: ["Overselling across channels", "Abandoned carts with no follow-up", "'Where is my order?' emails"],
    automations: [
      { title: "Inventory sync", body: "Stock updates across every store and marketplace in real time." },
      { title: "Cart recovery", body: "Timed reminders bring shoppers back to finish checkout." },
      { title: "Order updates", body: "Customers get proactive shipping updates by SMS or email." },
      { title: "Product uploads", body: "Bulk-create and update listings from a sheet or supplier feed." },
    ],
    services: ["e-commerce", "customer-support", "marketing"],
  },
  {
    slug: "agencies",
    name: "Agencies",
    headline: "Spend your hours on clients, not on reporting.",
    intro: "Agencies run on repeatable processes — onboarding, reporting, approvals. They are perfect to automate.",
    pains: ["Monthly reports built by hand", "Client onboarding emails copied each time", "Lead gen for your own agency neglected"],
    automations: [
      { title: "Automatic client reports", body: "Ad and SEO results pulled into a branded report on schedule." },
      { title: "Client onboarding", body: "Contracts, access requests and kickoff scheduling in one flow." },
      { title: "Outbound for your agency", body: "Targeted lead lists and outreach running in the background." },
      { title: "Approval workflows", body: "Content goes to clients for sign-off and comes back tracked." },
    ],
    services: ["marketing", "sales-and-leads", "custom-build"],
  },
  {
    slug: "law-firms",
    name: "Law firms",
    headline: "Take intake and document work off your fee-earners.",
    intro: "Lawyers should not spend billable hours on intake forms and document chasing. We automate the process around the advice.",
    pains: ["Intake calls that never become clients", "Documents chased by email", "Deadlines tracked in personal calendars"],
    automations: [
      { title: "Structured intake", body: "Enquiries are qualified with the right questions and routed to the right lawyer." },
      { title: "Document collection", body: "Clients upload what is needed through a guided checklist with reminders." },
      { title: "Contract drafting", body: "First drafts are generated from templates and intake answers for review." },
      { title: "Deadline alerts", body: "Key dates are tracked centrally with reminders to the whole team." },
    ],
    services: ["operations", "customer-support", "custom-build"],
  },
  {
    slug: "education",
    name: "Education & coaching",
    headline: "Enrol, remind and follow up — automatically.",
    intro: "Course creators and coaching businesses lose students in the gaps between enquiry, payment and the first session.",
    pains: ["Enquiries without follow-up", "Manual class reminders", "Student questions answered one by one"],
    automations: [
      { title: "Enrolment funnel", body: "Enquiries get information, a payment link and follow-ups automatically." },
      { title: "Class reminders", body: "Students are reminded before every session by email or WhatsApp." },
      { title: "Student help bot", body: "Common questions about schedules and materials answered instantly." },
      { title: "Progress check-ins", body: "Automatic nudges for students who fall behind." },
    ],
    services: ["sales-and-leads", "customer-support", "marketing"],
  },
  {
    slug: "logistics",
    name: "Logistics",
    headline: "Status updates that send themselves.",
    intro: "Shipments create a constant stream of updates, documents and questions. We automate the communication around them.",
    pains: ["Customers calling for status", "Delivery documents retyped", "Quotes taking a day to return"],
    automations: [
      { title: "Proactive tracking updates", body: "Customers get status changes without asking." },
      { title: "Document extraction", body: "Bills of lading and invoices are read and filed automatically." },
      { title: "Fast quoting", body: "Quote requests are priced from your rate tables and sent for approval." },
      { title: "Exception alerts", body: "Delays and failed deliveries are flagged to your team immediately." },
    ],
    services: ["operations", "customer-support", "custom-build"],
  },
];
