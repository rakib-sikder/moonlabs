// SEO guides shown at /guides. Plain data; rendered by app/(site)/guides.
export type GuideSection = { heading: string; paragraphs: string[]; bullets?: string[] };
export type Guide = {
  slug: string;
  title: string;            // <= 65 chars, includes the main keyword
  description: string;      // meta description, 140-160 chars
  published: string;        // "2026-11-10"
  readMinutes: number;
  keywords: string[];       // 4-6 target phrases
  intro: string[];          // 1-3 paragraphs
  sections: GuideSection[]; // 5-9 sections, H2 headings
  faqs: { q: string; a: string }[];
  services: string[];       // 2-3 service slugs from lib/site.ts
};

export const guides: Guide[] = [
  // ---------------------------------------------------------------------------
  {
    slug: "whatsapp-automation-for-business-bangladesh",
    title: "WhatsApp Automation for Business in Bangladesh: A Practical Guide",
    description:
      "What you can automate on WhatsApp in Bangladesh, the Business app vs the official API, a sample order flow, what it costs to start and the mistakes to avoid.",
    published: "2026-11-10",
    readMinutes: 6,
    keywords: [
      "whatsapp automation bangladesh",
      "whatsapp business api bangladesh",
      "whatsapp chatbot for business",
      "whatsapp order status automation",
      "whatsapp business app vs api",
    ],
    intro: [
      "In Bangladesh, a lot of business happens on WhatsApp. Customers ask for prices there, confirm orders there and send the screenshot of their bKash payment there. For a small team, that means one or two people spend most of the day answering the same questions on a phone.",
      "WhatsApp automation takes the repeat work off that phone. This guide covers what you can realistically automate, the difference between the free WhatsApp Business app and the official WhatsApp Business Platform, a simple example flow, how to think about cost, and when it is honestly not worth doing.",
    ],
    sections: [
      {
        heading: "What you can automate on WhatsApp",
        paragraphs: [
          "Most of the value comes from four jobs. None of them need a complicated AI system to start. They need a clear set of rules and a connection to the place where your data already lives, such as a Google Sheet, your online store or your courier account.",
        ],
        bullets: [
          "Enquiries: instant replies to common questions like price, size, delivery charge inside and outside Dhaka, and opening hours, with a hand-over to a person when the question is unusual.",
          "Order and parcel status: when an order is confirmed, packed or handed to the courier, the customer gets a message with the tracking details, so they stop asking 'vai, parcel kothay?'.",
          "Appointment reminders: clinics, salons, tutors and service businesses can send a reminder the day before and let the customer confirm or reschedule with one reply.",
          "Lead routing to sales: new enquiries are tagged by product or area and assigned to the right salesperson, and anything left unanswered for too long triggers an alert.",
        ],
      },
      {
        heading: "WhatsApp Business app vs the WhatsApp Business Platform",
        paragraphs: [
          "The WhatsApp Business app is the free app you install on a phone. It gives you a business profile, a product catalogue, labels, quick replies, a greeting message and an away message. For a shop with one person on the phone, these basics already save time, and you should set them up before paying for anything.",
          "The app has limits. It is built for a person typing, not for software. It does not connect properly to your store, sheet or CRM, and it has no supported way for another system to send messages on your behalf. Tools that fake this through WhatsApp Web break often and can get the number restricted.",
          "The WhatsApp Business Platform, often called the WhatsApp API, is Meta's official route for software to send and receive messages. You use it through Meta's Cloud API directly or through a Meta-approved Business Solution Provider (BSP). It requires a verified Meta business account and an approved display name.",
          "Two rules shape everything you build on the platform. First, when a customer messages you, you can reply freely for a limited customer service window. Second, any message you start, or send after that window has closed, must use a template that Meta has approved in advance, and the customer should have opted in to receive it. Order updates and reminders are templates, so plan their wording early.",
        ],
      },
      {
        heading: "A simple example flow for an online shop",
        paragraphs: [
          "Here is a flow for a typical Facebook or website shop in Dhaka that takes cash on delivery and bKash. It is small enough for one project.",
        ],
        bullets: [
          "A customer places an order on the website or the team adds it to a Google Sheet from a Messenger chat.",
          "The automation sends an approved confirmation template on WhatsApp with the order summary and a 'Confirm' and 'Cancel' button.",
          "If the customer taps Confirm, the order row is marked confirmed. If there is no reply after a set time, the order goes to a person to call.",
          "When the parcel is booked with the courier, the customer gets a second template with the tracking number.",
          "Any free-text reply from the customer lands in a shared inbox where the team can answer it, with the order details shown next to the chat.",
        ],
      },
      {
        heading: "What it costs to get started",
        paragraphs: [
          "There are three separate costs, and it helps to keep them apart. The first is Meta's own charge for certain messages on the platform, which depends on the message category and the customer's country. Meta changes these rates from time to time, so check the current pricing on Meta's site rather than trusting an old blog post.",
          "The second is the provider or inbox tool, if you use one. Some BSPs and shared-inbox tools charge a monthly fee, others charge per message on top of Meta. The third is the build itself: designing the flow, writing the templates, connecting your sheet or store and testing it.",
          "A single workflow like the order flow above fits a one-time project, and ongoing changes and monitoring fit a monthly plan. See /pricing for current plans. You get a fixed price after the free audit.",
        ],
      },
      {
        heading: "Common mistakes",
        paragraphs: [
          "Most disappointing WhatsApp projects fail for the same avoidable reasons.",
        ],
        bullets: [
          "Using unofficial tools or bulk senders that automate WhatsApp Web. They are cheap until the number gets banned, and that number is often the one printed on every product.",
          "Messaging people who never opted in. It annoys customers, leads to blocks and reports, and can hurt your number's quality rating with Meta.",
          "Building a chatbot with ten menu levels. Customers want an answer or a person, not a phone tree in chat form.",
          "No hand-over to a human. Every flow needs a clear point where a real person takes over, and the team must see those chats quickly.",
          "Templates written as an afterthought. Rejected templates delay launch, so write them in plain language with clear variables before the build starts.",
          "Nobody owns it after launch. Prices change, products change and the bot keeps quoting last month's delivery charge.",
        ],
      },
      {
        heading: "When it is not worth it",
        paragraphs: [
          "If you get a handful of WhatsApp messages a day and one person answers them comfortably, the free Business app with quick replies and labels is probably enough. A paid build will not pay back.",
          "It is also not worth automating a process that is not settled yet. If your delivery charges, return policy or booking rules change every week, fix the process first. Automation copies whatever you give it, including the confusion.",
          "If most conversations are negotiations or sensitive cases, keep people in charge and automate only the reminders and status updates.",
        ],
      },
      {
        heading: "Get a free WhatsApp automation audit",
        paragraphs: [
          "To find out which job would save you the most time, book a free 30-minute audit at /contact. We look at how your messages actually come in, tell you what is worth automating and what is not, and you keep the list either way.",
          "Related services: customer support automation at /services/customer-support, sales and lead follow-up at /services/sales-and-leads, and order and parcel updates for online shops at /services/e-commerce.",
        ],
      },
    ],
    faqs: [
      {
        q: "Is the WhatsApp Business API available in Bangladesh?",
        a: "Yes. Businesses in Bangladesh can use the WhatsApp Business Platform through Meta's Cloud API or through a Meta-approved provider. You need a verified Meta business account, a phone number for the platform and an approved display name.",
      },
      {
        q: "Can I send bulk messages on WhatsApp to my customers?",
        a: "Only to customers who have opted in, and only with templates Meta has approved. Unofficial bulk senders that automate WhatsApp Web break the rules and put your number at risk of being banned.",
      },
      {
        q: "Do I need a chatbot to automate WhatsApp?",
        a: "Not always. Order confirmations, parcel updates and reminders are rule-based messages that do not need AI at all. A chatbot helps when you get many free-text questions, and even then it should hand over to a person quickly.",
      },
      {
        q: "Can I keep using my WhatsApp number on my phone?",
        a: "It depends on your setup and provider. Meta now supports using some numbers on both the Business app and the platform, but the options and limits vary, so confirm with your provider before you move your main number.",
      },
    ],
    services: ["customer-support", "sales-and-leads", "e-commerce"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "small-business-automation-ideas",
    title: "12 Small Business Automation Ideas You Can Set Up This Month",
    description:
      "Twelve small business tasks you can automate now, grouped by sales, support, operations and finance, with the trigger, what happens and the tools for each.",
    published: "2026-11-10",
    readMinutes: 7,
    keywords: [
      "small business automation ideas",
      "tasks to automate in small business",
      "business process automation examples",
      "n8n zapier make automation ideas",
      "automate small business workflows",
    ],
    intro: [
      "Most small businesses do not need a big automation project. They need a few boring jobs to stop landing on the owner's desk. The good news is that the most useful automations are usually small: one trigger, a few steps, one result.",
      "Below are 12 tasks you can automate this month, grouped by sales, support, operations and finance. For each one we list the trigger, what happens and the tools that usually do the job. The tools named are common examples. The right choice depends on what you already use.",
    ],
    sections: [
      {
        heading: "Sales",
        paragraphs: [
          "Sales automations pay back fastest because a slow reply often means a lost lead. These three are where most businesses should start.",
        ],
        bullets: [
          "1. Instant lead follow-up. Trigger: a form is submitted on your website or an ad lead form. What happens: the lead is added to your CRM, gets a personal-sounding reply by email or SMS within a minute, and a salesperson gets an alert. Tools: Zapier or Make, your form tool, HubSpot, Pipedrive or GoHighLevel.",
          "2. Follow-up reminders that do not depend on memory. Trigger: a deal has had no activity for a set number of days. What happens: the owner of the deal gets a task, or a polite check-in email goes out for approval. Tools: your CRM's built-in workflows, or n8n reading the CRM on a schedule.",
          "3. Quotes from a template. Trigger: a deal moves to the 'quote' stage. What happens: a quote document is filled from the deal details, saved as a PDF and sent for review before it goes to the customer. Tools: Google Docs templates, Make or Zapier, PandaDoc or a similar tool.",
        ],
      },
      {
        heading: "Customer support",
        paragraphs: [
          "Support automations should make customers feel answered faster, not pushed away. Keep a person one step away in every flow.",
        ],
        bullets: [
          "4. Inbox sorting. Trigger: a new email arrives at your support or info address. What happens: it is labelled by type, such as order, complaint, invoice or spam, and routed to the right person, with urgent words flagged. Tools: Gmail or Outlook rules for the simple cases, n8n or Make with an AI step for the rest.",
          "5. Answers to repeat questions. Trigger: a chat on your website, Messenger or WhatsApp. What happens: an assistant answers from your own FAQ and policies, and hands over to a person when it is unsure. Tools: a chat widget or the official WhatsApp Business Platform, connected to a knowledge base you control.",
          "6. Review requests. Trigger: a job is marked complete or an order is delivered. What happens: a short message a few days later asks for a review, with a direct link to your Google review page. Tools: your booking or store system, Zapier or Make, an SMS or email tool.",
        ],
      },
      {
        heading: "Operations",
        paragraphs: [
          "Operations automations remove copy and paste. They are less exciting than chatbots and often save more time.",
        ],
        bullets: [
          "7. Booking confirmations and reminders. Trigger: an appointment is booked. What happens: the customer gets a confirmation, a reminder the day before and a simple way to reschedule. Tools: Calendly, Cal.com or your booking system, plus SMS or WhatsApp.",
          "8. Data entry from forms, PDFs and emails. Trigger: a new order form, supplier invoice or application arrives. What happens: the key fields are pulled out and written to the right row in a sheet or database, with anything unclear sent for a quick check. Tools: n8n or Make with an AI extraction step, Google Sheets or Airtable.",
          "9. New customer onboarding. Trigger: a contract is signed or a first payment is received. What happens: a welcome email goes out, a folder is created, tasks are added for the team and the customer gets a form for the details you need. Tools: Google Drive, your project tool, Zapier or Make.",
        ],
      },
      {
        heading: "Finance and reporting",
        paragraphs: [
          "Money tasks are repetitive and easy to forget, which makes them good candidates. Keep an approval step on anything that moves money.",
        ],
        bullets: [
          "10. Invoices and payment reminders. Trigger: a job is completed or a monthly date arrives. What happens: an invoice is created from the job details and sent, and friendly reminders go out if it is still unpaid after a set time. Tools: QuickBooks, Xero or Stripe invoicing, with Zapier or Make for the gaps.",
          "11. Receipt and expense capture. Trigger: a receipt is photographed or forwarded to an email address. What happens: the amount, date and vendor are read and logged, and the file is stored with a consistent name. Tools: your accounting tool's receipt capture, or n8n with an AI step and Google Drive.",
          "12. A weekly numbers report. Trigger: every Monday morning. What happens: leads, sales, open invoices and booking counts are pulled from each tool into one short message or dashboard. Tools: Google Sheets or Looker Studio, n8n on a schedule, email, Slack or Telegram.",
        ],
      },
      {
        heading: "How to choose your first one",
        paragraphs: [
          "Pick the task that happens most often and annoys people the most, not the one that sounds the most impressive. Write down the steps a person follows today, including the exceptions. If you cannot describe the steps, the automation will not be able to follow them either.",
          "Then decide where a human should stay in the loop. Anything that goes to a customer or touches money should start with an approval step. You can remove it later once the output is reliably right. This is how we run our own systems, including LeadPilot, the lead engine we use for our own outreach.",
        ],
      },
      {
        heading: "What not to automate",
        paragraphs: [
          "Some work should stay with people, at least for now. Automating it either saves very little or costs you trust.",
        ],
        bullets: [
          "Tasks that happen a few times a month. The setup and upkeep will cost more than the time saved.",
          "Processes that are still changing. Settle the steps first, then automate them.",
          "Sensitive conversations, such as complaints, refunds, bad news and anything medical or legal. Automate the logging and reminders, not the reply.",
          "Decisions that need judgement, like pricing a custom job or approving credit. An automation can gather the facts, a person should decide.",
          "Anything you cannot monitor. If nobody will notice when it breaks, it will quietly break.",
        ],
      },
      {
        heading: "Start with a free audit",
        paragraphs: [
          "If you want a second opinion on which of these fits your business, book a free 30-minute audit at /contact. We go through a normal week with you, list what is worth automating, and tell you plainly what is not.",
          "Related services: connected workflows in n8n, Make and Zapier at /services/custom-build, back-office automation at /services/operations, and lead follow-up at /services/sales-and-leads.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is the easiest thing to automate in a small business?",
        a: "Instant replies to new leads and appointment reminders are usually the easiest. They have a clear trigger, a simple message and an obvious benefit. Most businesses can have one running within a week or two.",
      },
      {
        q: "Should I use Zapier, Make or n8n?",
        a: "Zapier is the easiest to start with and has the widest app list. Make handles more complex flows at a lower cost per task. n8n can be self-hosted, which suits higher volumes or data you want to keep on your own server.",
      },
      {
        q: "Do I need AI for business automation?",
        a: "Most useful automations are plain rules: when this happens, do that. AI helps with messy inputs, such as reading invoices, sorting emails or drafting replies. Use it where the input is unstructured and keep a person checking the output at first.",
      },
      {
        q: "How much does it cost to automate a small business task?",
        a: "It depends on how many tools are involved and how many exceptions there are. Tool subscriptions are often modest for small volumes. Moonlab's current plans are listed on the pricing page, and you get a fixed price before any work starts.",
      },
    ],
    services: ["custom-build", "operations", "sales-and-leads"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "missed-call-text-back-and-online-booking",
    title: "Missed Call Text Back and Online Booking for Small Businesses",
    description:
      "Missed calls and phone-only booking lose customers. How missed-call text back, online booking with reminders and after-hours answering work, plus a setup list.",
    published: "2026-11-10",
    readMinutes: 6,
    keywords: [
      "missed call text back",
      "online booking for small business",
      "appointment reminder texts",
      "after hours answering service",
      "missed calls home services",
    ],
    intro: [
      "If you run a plumbing company, a clinic or a salon, the phone is still where a lot of new business starts. The trouble is that the phone rings when you are under a sink, with a patient or in the middle of a haircut. When nobody answers, many callers do not leave a voicemail. They call the next business on the list.",
      "Phone-only booking adds a second leak. Customers who would happily book at 10pm cannot, so they wait until morning and often forget. This guide explains three fixes that work well together: missed-call text back, online booking with reminders and after-hours answering. It also covers how to set them up and what to measure.",
    ],
    sections: [
      {
        heading: "Why missed calls cost more than they look",
        paragraphs: [
          "A missed call is not just one lost conversation. For home services, the caller usually has an urgent problem and is ready to pay someone today. For clinics and salons, the caller has made a decision to book and wants it done now.",
          "Most businesses have no idea how many calls they miss, because a missed call leaves almost no trace. Your phone system or carrier can usually export a call log. Looking at a few weeks of it, with missed calls by hour of day, is the cheapest piece of research you can do before spending anything.",
        ],
      },
      {
        heading: "How missed-call text back works",
        paragraphs: [
          "Missed-call text back sends an automatic SMS to anyone whose call was not answered. The message thanks them, says you are with a customer and gives them a way forward: reply with what they need, or tap a link to book.",
          "Behind the scenes, your business number runs through a phone system that can detect an unanswered call, such as a VoIP provider, a CRM with built-in calling, or a service like Twilio. When the call ends without being picked up, it triggers the text. The reply comes back into a shared inbox or CRM so the team can see the whole thread in one place.",
          "A good text is short and sounds like a person wrote it. For example: 'Sorry we missed your call, this is [Business name]. We are on a job right now. Reply with what you need and your address and we will get back to you within the hour, or book here: [link].' Only promise a response time you can actually keep.",
          "In the US, business texting from a regular local number usually needs A2P 10DLC registration with the carriers, and every message should make it easy to opt out. Your SMS provider will walk you through registration. Allow for it in the timeline, since approval is not instant.",
        ],
      },
      {
        heading: "Online booking with reminders",
        paragraphs: [
          "Online booking lets customers pick a time without calling. It works best when it shows real availability, asks only for the details you truly need and confirms the booking straight away by text and email.",
          "Reminders do most of the work after that. A reminder the day before and another a couple of hours before, each with a one-tap way to confirm or reschedule, catches the people who would otherwise forget. A rescheduled slot can be offered to someone else. A no-show cannot.",
          "For home services, a booking might be an estimate window rather than an exact time. That is fine. Show the windows you actually offer, and send the 'technician on the way' text when the job starts, so customers are home when you arrive.",
        ],
      },
      {
        heading: "After-hours answering",
        paragraphs: [
          "Some calls cannot wait for a text reply. Emergency plumbing, a burst pipe or a patient with a question about tomorrow's appointment all need something better than silence.",
          "There are a few options. An after-hours voicemail can send a transcript straight to the on-call person's phone. An AI voice agent can answer, collect the details, book a slot or flag a real emergency to a human. A traditional answering service is still a good choice for some clinics. Whatever you choose, decide clearly what counts as urgent and who gets woken up.",
          "Clinics should be careful with patient details in texts and AI tools. Keep messages to scheduling, avoid health information in SMS and check that every tool handling patient data meets your privacy obligations.",
        ],
      },
      {
        heading: "Setup checklist",
        paragraphs: [
          "You can usually have the basics running in 1-2 weeks. Work through this list in order.",
        ],
        bullets: [
          "Pull a few weeks of call logs and note when calls are missed.",
          "Choose a phone setup that can trigger a text on a missed call, ideally keeping your existing number.",
          "Register for business texting with your SMS provider and allow time for approval.",
          "Write the missed-call text, the booking confirmation and both reminders in plain language, with opt-out wording.",
          "Set up online booking with your real hours, service types and buffer times between jobs.",
          "Add the booking link to your website, Google Business Profile and the missed-call text.",
          "Send all replies into one inbox or CRM so nothing lives on one person's phone.",
          "Decide the after-hours rule: what is urgent, who is on call and how they are alerted.",
          "Test every path yourself from a personal phone before switching it on.",
        ],
      },
      {
        heading: "What to measure",
        paragraphs: [
          "Measure a few simple numbers before you start and again a month later. You do not need a dashboard for this, a weekly look at a sheet is enough.",
        ],
        bullets: [
          "Missed calls per week, and how many of them replied to the text.",
          "Time from a missed call to the first real reply from your team.",
          "Bookings made online, and how many came outside business hours.",
          "No-shows and late cancellations before and after reminders.",
          "New jobs or appointments that started from a missed call.",
        ],
      },
      {
        heading: "Book a free audit",
        paragraphs: [
          "If you want to know how many calls you are missing and what to fix first, book a free 30-minute audit at /contact. We look at your call flow and booking path and give you a short list of changes, whether or not you work with us.",
          "Related services: missed-call text back and AI voice agents at /services/voice-and-calls, booking and reminder workflows at /services/operations, and booking-ready websites at /services/web-development.",
        ],
      },
    ],
    faqs: [
      {
        q: "What is missed call text back?",
        a: "It is an automatic text message sent to someone whose call you did not answer. It lets them know you saw the call and gives them a way to reply or book online. The aim is to keep the conversation going before they call a competitor.",
      },
      {
        q: "Is it legal to text people who called my business?",
        a: "Replying to someone who just called you is common practice, but US texting rules still apply. Register your number for business texting, keep the message about their enquiry, include opt-out wording and do not add them to marketing lists without consent. Check with your provider or legal adviser if you are unsure.",
      },
      {
        q: "Can I keep my existing business phone number?",
        a: "Usually yes. Many phone systems can port your number or forward calls in a way that still triggers the text. Check this before you choose a provider, because changing the number on your vans and listings is a big job.",
      },
      {
        q: "Do appointment reminders really reduce no-shows?",
        a: "Reminders help because most no-shows are people who simply forgot. A reminder with an easy reschedule option turns some of those into changed bookings you can refill. Track your own no-show count before and after to see the effect for your business.",
      },
    ],
    services: ["voice-and-calls", "operations", "web-development"],
  },

  // ---------------------------------------------------------------------------
  {
    slug: "website-audit-checklist-small-business",
    title: "Website Audit Checklist for Small Business: 20 Points to Check",
    description:
      "A practical 20-point website checklist for small businesses: HTTPS, mobile layout, titles, images, contact forms, email links, booking, sitemap and speed.",
    published: "2026-11-10",
    readMinutes: 7,
    keywords: [
      "website audit checklist",
      "small business website checklist",
      "website checklist for seo",
      "fix contact form not working",
      "website health check",
    ],
    intro: [
      "When we look at small business websites, the same problems come up again and again. Most of them are not design problems. They are small technical mistakes that quietly cost enquiries: a contact form that sends to nowhere, an email link that still points to the template address, or a page that is hard to use on a phone.",
      "This checklist covers the 20 things worth checking first. You can work through most of it yourself in an hour with a phone, a laptop and a free tool or two. Each point says what to check and what good looks like.",
    ],
    sections: [
      {
        heading: "Security and setup (points 1-4)",
        paragraphs: [
          "These are the basics that browsers and search engines notice first. If any of them fail, fix them before anything else.",
        ],
        bullets: [
          "1. HTTPS everywhere. Every page should load on https:// with the padlock showing. Type your address with http:// and check it redirects to the secure version.",
          "2. A valid certificate. Click the padlock and check the certificate covers your domain and is not close to expiry. Make sure renewal is automatic, because expired certificates show visitors a full-page warning.",
          "3. One main address. The www and non-www versions should end up at the same address. Two live copies of the site split your search signals.",
          "4. Mixed content. Images or scripts loaded over plain http on a secure page can break the padlock. Your browser's developer console lists them.",
        ],
      },
      {
        heading: "Mobile and layout (points 5-6)",
        paragraphs: [
          "Most visitors to a local business site arrive on a phone, so check the site on a real phone, not just a narrow desktop window.",
        ],
        bullets: [
          "5. A mobile viewport. The page should fit the screen without pinching or sideways scrolling. If it looks like a tiny desktop page, the viewport meta tag is usually missing.",
          "6. Readable text and tappable buttons. Text should be readable without zooming, and buttons and links should be big enough and far enough apart to tap with a thumb.",
        ],
      },
      {
        heading: "Search basics (points 7-11)",
        paragraphs: [
          "These are the on-page details search engines use to understand each page. They take minutes to fix and are missed on a surprising number of sites.",
        ],
        bullets: [
          "7. A unique page title on every page. Each title should say what the page is about and where you work, for example 'Emergency Plumber in Austin | Company Name'. Watch for every page sharing the same title, or titles like 'Home' and 'Untitled'.",
          "8. A meta description for every important page. It does not change rankings directly, but it is often the text people read in search results before they click.",
          "9. One H1 per page. The main heading should describe the page. Common problems are no H1 at all, the logo used as the H1, or several H1s on one page.",
          "10. Images sized for the web. Photos straight from a camera or phone can be several megabytes each. Resize them to the size they are shown at and use a modern format like WebP.",
          "11. Alt text on meaningful images. Describe what the image shows, such as 'technician fitting a water heater'. Skip decorative images and do not stuff keywords.",
        ],
      },
      {
        heading: "Contact paths (points 12-15)",
        paragraphs: [
          "This is where we find the most costly problems. A site can look perfect and still lose every enquiry because the contact path is broken.",
        ],
        bullets: [
          "12. A contact form that actually delivers. Fill in your own form and check the message arrives, lands in the inbox and not spam, and reaches someone who reads it. Check again after any site update or hosting change.",
          "13. Email links pointing to a real address. Click every email link. A common mistake is a mailto link still set to the theme's placeholder, such as info@example.com or the template designer's address, or an address on a domain you no longer use.",
          "14. A tappable phone number. On a phone, tapping the number should start a call. That needs a tel: link, not just text or an image of the number.",
          "15. A clear booking path. If customers can book, the booking button should be visible on the home page and every service page, and the flow should work end to end on a phone.",
        ],
      },
      {
        heading: "Local listings and indexing (points 16-18)",
        paragraphs: [
          "These points help search engines find your pages and connect your website to your business listing.",
        ],
        bullets: [
          "16. Google Business Profile linked and consistent. Your profile should link to your site, and the business name, address and phone number should match the site exactly.",
          "17. A sitemap. Most sites can generate one at /sitemap.xml. Submit it in Google Search Console and check it only lists pages that really exist.",
          "18. A robots.txt that is not blocking you. Open /robots.txt. If it says 'Disallow: /' for all user agents, search engines are being told to stay out, often left over from when the site was being built.",
        ],
      },
      {
        heading: "Upkeep and speed (points 19-20)",
        paragraphs: [
          "The last two points are small signals that tell visitors whether anyone is looking after the site.",
        ],
        bullets: [
          "19. An up-to-date footer. A copyright year from several years ago makes a business look closed. Make the year update itself, and check that opening hours and service areas are current.",
          "20. Reasonable speed. Run your home page and one service page through Google PageSpeed Insights on mobile. Oversized images, too many plugins and heavy sliders are the usual causes of a slow site.",
        ],
      },
      {
        heading: "How to use this checklist",
        paragraphs: [
          "Go through the list once on a phone and once on a laptop, and note each problem with the page address. Fix the contact paths first, since they cost you enquiries directly, then security, then the search basics.",
          "Repeat the check every few months and after any redesign, plugin update or hosting move. Many of these problems appear after a change nobody tested. A simple uptime and form check can be automated so you hear about a broken form before a customer does.",
        ],
      },
      {
        heading: "Get a free website audit",
        paragraphs: [
          "If you would rather have someone else run the check, book a free 30-minute audit at /contact. We go through these points on your site, show you what is broken and what matters most, and you keep the list.",
          "Related services: fixes, redesigns and ongoing care at /services/web-development, technical and local SEO at /services/seo, and SSL, hosting and email deliverability at /services/cloud-and-devops.",
        ],
      },
    ],
    faqs: [
      {
        q: "How often should a small business audit its website?",
        a: "A quick check every few months is enough for most small sites. Also check after any redesign, plugin update, theme change or hosting move, since that is when forms and links tend to break.",
      },
      {
        q: "Why is my website contact form not sending emails?",
        a: "The usual causes are a wrong recipient address, the site's server not being allowed to send mail, or messages landing in spam because the domain's email settings (SPF, DKIM, DMARC) are missing. Send a test message and check the form's settings and your spam folder first.",
      },
      {
        q: "Can I do a website audit myself?",
        a: "Yes, most of this checklist needs only a phone, a browser and free tools like Google PageSpeed Insights and Search Console. Fixing some issues, such as redirects or email settings, may need your web developer or host.",
      },
      {
        q: "Does a website audit help with SEO?",
        a: "Yes. Fixing titles, headings, images, sitemaps and robots.txt removes problems that stop search engines from understanding or indexing your pages. It will not replace good content and reviews, but it makes sure they are not wasted.",
      },
    ],
    services: ["web-development", "seo", "cloud-and-devops"],
  },
];
